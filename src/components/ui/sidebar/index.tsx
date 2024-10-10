import { Drawer, Layout } from "antd";
import styles from "./SideBar.module.scss";
import classNames from "classnames";

interface SideBarProps {
  isOpen: boolean;
  children: React.ReactNode;
  isResponsive?: boolean;
  onClose?: any;
  width?: any;
}

const SideBar = ({
  isOpen,
  children,
  isResponsive,
  onClose,
  width,
}: SideBarProps) => {
  if (isResponsive && window.screen.availWidth <= 1000) {
    return (
      <Layout>
        <div>
          <Drawer
            title={false}
            placement="right"
            closable={false}
            onClose={() => onClose()}
            open={isOpen}
            key={"right"}
            width={450}
          >
            <div>{isOpen ? children : null}</div>
          </Drawer>
        </div>
      </Layout>
    );
  }

  return (
    <div
      className={classNames(styles.sidebar)}
      style={{ width: isOpen ? width || "350px" : 0 }}
    >
      {isOpen ? children : null}
    </div>
  );
};

export default SideBar;
