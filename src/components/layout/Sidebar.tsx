import { useEffect, useState } from "react";
import { Menu } from "antd";
import { sidebarMenuData } from "@/config/sidebarMenu";
import { Images } from "@/utilities/imagesPath";
import { Link } from "react-router-dom";
import PolyhouseSelectors from "@/redux/polyhouse/polyhouseSelectors";
import routePaths from "@/config/routePaths";
import { getTranslation } from "@/translation/i18n";
import { useAppSelector } from "@/hooks/redux";
import { useAppDispatch } from "@/hooks/redux";
import PolyhouseActions from "@/redux/polyhouse/action";
import { BsTextareaResize } from "react-icons/bs";
import { GrCycle } from "react-icons/gr";
import { PiPottedPlant } from "react-icons/pi";

const MenuItem = ({ isHasLink, url, Icon, title }: any) => {
  return isHasLink ? (
    <Link to={url} className="menu_item">
      {Icon && <Icon fontSize={20} />}
      <p className="heading">{title}</p>
    </Link>
  ) : (
    <div className="menu_item">
      {Icon && <Icon fontSize={20} />}
      <p className="heading">{title}</p>
    </div>
  );
};

function Sidenav() {
  const dispatch = useAppDispatch();

  const [selectedKeys, setSelectedKeys] = useState<any>([]);
  const [openedKeys, setOpenedKeys] = useState(["farms", "polyhouses"]);
  const [sideBarMenu, setSideBarMenu] = useState(sidebarMenuData);
  const selectedPolyhouse = useAppSelector(
    PolyhouseSelectors.SelectSelectedPolyhouse
  );
  const handleClick = (e: any) => {
    setSelectedKeys([e.key]);
  };

  const polyhouseChildren = [
    {
      title: getTranslation("polyhouse.polyhouseDetails.zones.zones"),
      key: "zones",
      url: routePaths.zones.replace(
        ":polyhouseId",
        selectedPolyhouse?.polyhouseId || null
      ),
      icon: BsTextareaResize,
    },
    {
      title: getTranslation("polyhouse.polyhouseDetails.nurseries.nurseries"),
      key: "nurseries",
      url: routePaths.nurseries.replace(
        ":polyhouseId",
        selectedPolyhouse?.polyhouseId || null
      ),
      icon: PiPottedPlant,
    },
    {
      title: getTranslation("global.lifeCycles"),
      key: "lifeCycles",
      url: routePaths.lifeCycle.replace(
        ":polyhouseId",
        selectedPolyhouse?.polyhouseId || null
      ),
      icon: GrCycle,
    },
  ];

  useEffect(() => {
    const updatedSideBarMenu = sideBarMenu.map((sideBar) => {
      if (sideBar.key === "farms") {
        return {
          ...sideBar,
          children: sideBar.children?.map((child) => {
            if (child.key === "polyhouses") {
              return {
                ...child,
                children: selectedPolyhouse ? polyhouseChildren : null,
              };
            }

            return child;
          }),
        };
      }

      return sideBar;
    });

    setSideBarMenu(updatedSideBarMenu);
  }, [selectedPolyhouse]);

  const onOpenChange = (keys: string[]) => {
    setOpenedKeys(keys);
    setSelectedKeys([]);
  };

  const generateMenuItems = () => {
    const generateItem = (item: any) => {
      const { key, title, url, icon } = item;

      return (
        <Menu.Item
          key={key}
          className={location.pathname === url ? "ant-menu-item-selected" : ""}
        >
          <MenuItem isHasLink={url} title={title} url={url} Icon={icon} />
        </Menu.Item>
      );
    };

    const generateSubmenu = (items: any) =>
      items.map((menuItem: any) => {
        if (menuItem.children) {
          return (
            <Menu.SubMenu
              className={
                location.pathname === menuItem?.url ? "selected_submenu" : ""
              }
              title={
                <MenuItem
                  isHasLink={menuItem?.url}
                  key={menuItem.key}
                  title={menuItem?.title}
                  url={menuItem?.url}
                  Icon={menuItem?.icon}
                />
              }
              key={menuItem.key}
            >
              {generateSubmenu(menuItem.children)}
            </Menu.SubMenu>
          );
        }
        return generateItem(menuItem);
      });

    return sideBarMenu.map((menuItem) => {
      if (menuItem.children) {
        return (
          <Menu.SubMenu
            className={
              location.pathname === menuItem?.url ? "selected_submenu" : ""
            }
            title={
              <MenuItem
                isHasLink={menuItem?.url}
                key={menuItem.key}
                title={menuItem?.title}
                url={menuItem?.url}
                Icon={menuItem?.icon}
              />
            }
            key={menuItem.key}
          >
            {generateSubmenu(menuItem.children)}
          </Menu.SubMenu>
        );
      }
      return generateItem(menuItem);
    });
  };

  useEffect(() => {
    if (!location.pathname.includes("polyhouse")) {
      dispatch(PolyhouseActions.setSelectedPolyhouse(null));
    }
  }, [location.pathname]);

  return (
    <div className="sideBar">
      <div className="sidebar_logo">
        <img src={Images.LOGO_2} alt="Growloc" />
      </div>

      <div className="sidebar_menu_container">
        <Menu
          onClick={handleClick}
          selectedKeys={selectedKeys}
          openKeys={openedKeys}
          onOpenChange={onOpenChange}
          mode="inline"
          inlineIndent={15}
        >
          {generateMenuItems()}
        </Menu>
      </div>
    </div>
  );
}

export default Sidenav;
