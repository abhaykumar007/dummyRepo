import "./style.scss";
import UserSidebar from "./sidebar";
import UserTable from "./userTable";
const UserManagement = () => {


  return (
    <div style={{ height: "100%", display: "flex" }}>
      <UserTable />
      <UserSidebar />
    </div>
  );
};

export default UserManagement;
