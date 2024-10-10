import { Drawer, Layout } from "antd";
import { useState } from "react";
import { Outlet } from "react-router-dom";
import Header from "./Header";
import Sidenav from "./Sidebar";
import SSEComponent from "@/utilities/SseComponent";

const { Content, Sider } = Layout;

function Main() {
  const [visible, setVisible] = useState(false);

  const toggleSidebar = () => {
    setVisible(!visible);
  };

  return (
    <Layout>
      <SSEComponent />
      <Drawer
        title={false}
        placement="left"
        closable={false}
        onClose={() => setVisible(false)}
        visible={visible}
        key={"left"}
        width={280}
        className={`drawer-sidebar`}
      >
        <Sider trigger={null} width={280} theme="light">
          <Sidenav />
        </Sider>
      </Drawer>
      <Sider width={260} className="responsiveSider">
        <Sidenav />
      </Sider>
      <Layout>
        <Header toggleSidebar={toggleSidebar} />
        <Content className="content-ant">
          <Outlet />
        </Content>
      </Layout>
    </Layout>
  );
}

export default Main;
