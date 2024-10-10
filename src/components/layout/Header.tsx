import { LANGUAGE_OPTIONS } from "@/config/consts";
import routePaths from "@/config/routePaths";
import { useAppDispatch, useAppSelector } from "@/hooks/redux";
import FarmActions from "@/redux/farm/action";
import FarmSelectors from "@/redux/farm/farmSelectors";
import FarmModel from "@/redux/farm/models/farmModel";
import SessionActions from "@/redux/session/actions";
import SessionSelectors from "@/redux/session/selectors";
import { getTranslation } from "@/translation/i18n";
import { changeLanguage } from "i18next";
import { ElementType, useEffect } from "react";
import { FaRegUser } from "react-icons/fa";
import { GoOrganization } from "react-icons/go";
import { IoIosLogOut } from "react-icons/io";
import { IoLanguage, IoMenu } from "react-icons/io5";
import { Link } from "react-router-dom";
import Dropdown from "../ui/dropdown";
import Breadcrumb from "./Breadcrumb";

const FarmLabel = ({ selectedFarm }: { selectedFarm: FarmModel }) => {
  return selectedFarm ? (
    <div className="bodyText farm_label">
      <span className="select_farm_text">
        {getTranslation("global.farm")} :{" "}
      </span>{" "}
      {selectedFarm?.name}
    </div>
  ) : (
    <span className="bodyText select_farm_text">
      {getTranslation("header.selectFarm")}
    </span>
  );
};

const UserProfileDropdownList = ({
  Icon,
  label,
  className,
  onClick,
}: {
  Icon: ElementType;
  label: string;
  className?: string;
  onClick?: () => void;
}) => {
  return (
    <div
      className={`user_profile_dropdown_list ${className && className}`}
      onClick={onClick}
    >
      <div className="user_profile_dropdown_icon">
        <Icon />
      </div>
      <p className="bodyText">{label}</p>
    </div>
  );
};

interface headerProps {
  toggleSidebar: () => void;
}

const Header = ({ toggleSidebar }: headerProps) => {
  const dispatch = useAppDispatch();

  const farmList = useAppSelector(FarmSelectors.SelectActiveFarmOptions);
  const selectedFarmId = useAppSelector(FarmSelectors.SelectSelectedFarmId);
  const selectedFarm = useAppSelector((state) =>
    FarmSelectors.SelectFarmByFarmId(state, selectedFarmId)
  );
  const selectedLanguage = useAppSelector(
    SessionSelectors.SelectSelectedLanguage
  );
  const userDetails = useAppSelector(SessionSelectors.SelectUserDetails);

  const handleSelectFarm = (farmId: string) => {
    dispatch(FarmActions.selectFarm(farmId));
  };

  const handleSelectLanguage = (language: string) => {
    dispatch(SessionActions.changeLanguage(language));
    changeLanguage(language);
  };

  const handleLogout = () => {
    dispatch(SessionActions.logout());
  };

  useEffect(() => {
    dispatch(FarmActions.fetchFarms());
  }, []);

  return (
    <div className="header">
      <div className="header_title_container">
        <div className="sideBarMenuTab">
          <IoMenu onClick={toggleSidebar} fontSize={25} />
        </div>
        <Breadcrumb />
      </div>
      <div className="headerRight">
        {farmList.length > 0 && (
          <Dropdown
            value={selectedFarmId}
            label={<FarmLabel selectedFarm={selectedFarm} />}
            items={farmList}
            onChange={handleSelectFarm}
          />
        )}

        <div className="language_container">
          <Dropdown
            value={selectedLanguage}
            label={
              <div className="language_inside_container">
                <IoLanguage fontSize={16} />
                <p>{selectedLanguage}</p>
              </div>
            }
            items={LANGUAGE_OPTIONS}
            onChange={handleSelectLanguage}
          />
        </div>

        {/* <div className="language_container notification_container">
          <IoIosNotifications fontSize={18} />
        </div> */}

        <Dropdown
          label={
            <div className="profile_container">
              {/* <Avatar shape="square" size={30} icon={<FaUser />} /> */}
              <div>
                <p className="bodyText profile_name">
                  {userDetails?.given_name ?? "-"} {userDetails?.family_name}
                </p>
                <p className="user_role">{userDetails?.["custom:role"]}</p>
              </div>
            </div>
          }
          dropdownRender={() => {
            return (
              <div className="user_profile_dropdown_container">
                <Link to={routePaths.profile}>
                  <UserProfileDropdownList
                    Icon={FaRegUser}
                    label={getTranslation("global.profile")}
                  />
                </Link>
                <Link to={routePaths.organization}>
                  <UserProfileDropdownList
                    Icon={GoOrganization}
                    label={getTranslation("global.organization")}
                  />
                </Link>
                <UserProfileDropdownList
                  className="logout_container"
                  Icon={IoIosLogOut}
                  label={getTranslation("global.logout")}
                  onClick={handleLogout}
                />
              </div>
            );
          }}
        />
      </div>
    </div>
  );
};

export default Header;
