import React, { useEffect } from "react";
import SideBar from "@/components/ui/sidebar";
import UserSelectors from "@/redux/user/selectors";
import {
  Divider,
  Dropdown,
  Flex,
  Popconfirm,
  Space,
  theme,
} from "antd";
import { CloseOutlined } from "@ant-design/icons";
import UserActions from "@/redux/user/actions";
import { BsThreeDots } from "react-icons/bs";
import { DeleteOutlined } from "@ant-design/icons";
import { useState } from "react";
import Button from "@/components/common/button";
import "./style.scss";
import { getTranslation } from "@/translation/i18n";
import UserDetails from "./userDetails";
import { makeSelectErrorModel } from "@/redux/error/errorSelector";
import FullAlertError from "@/components/common/error/FullAlertError";
import requestingSelector from "@/redux/requesting/requestingSelector";
import { useAppDispatch, useAppSelector } from "@/hooks/redux";
import { useForm } from "@/components/common/form";
import { removeByActionType } from "@/redux/error/errorAction";

const { useToken } = theme;
const selectError = makeSelectErrorModel();

const UserSidebar = () => {
  const dispatch = useAppDispatch();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const { token } = useToken();
  const [form] = useForm();
  const contentStyle: React.CSSProperties = {
    backgroundColor: token.colorBgElevated,
    borderRadius: token.borderRadiusLG,
    boxShadow: token.boxShadowSecondary,
  };
  const selectedUser = useAppSelector(UserSelectors.selectSelectedUser);
  const deleteUserError = useAppSelector((state) =>
    selectError(state, UserActions.DELETE_USER_FINISHED)
  );
  const deleteUserLoading = useAppSelector((state) =>
    requestingSelector(state, [UserActions.DELETE_USER])
  );
  const closeSidebar = () => {
    dispatch(UserActions.unSelectUser());
    dispatch(removeByActionType(UserActions.DELETE_USER_FINISHED));
  };

  const deleteUser = () => {
    dispatch(UserActions.deleteUser(selectedUser?.userId));
  };

  useEffect(() => {
    if (!deleteUserLoading && deleteUserError) setIsMenuOpen(false);
  }, [deleteUserLoading,deleteUserError]);

  return (
    <SideBar isOpen={!!selectedUser}>
      <div style={{ padding: "20px 20px", width: "100%" }}>
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            textAlign: "center",
          }}
        >
          <h5 style={{ fontSize: "130%" }}>
            <strong> User Details</strong>
          </h5>
          <Flex gap={20}>
            <Dropdown
              trigger={["click"]}
              open={isMenuOpen}
              onOpenChange={setIsMenuOpen}
              dropdownRender={() => (
                <div style={contentStyle}>
                  <Space style={{ padding: 8 }}>
                    <Popconfirm
                      title={getTranslation("global.areYouSure")}
                      okText={getTranslation("global.yes")}
                      cancelText={getTranslation("global.cancel")}
                      onCancel={() => setIsMenuOpen(false)}
                      onConfirm={deleteUser}
                    >
                      <Button
                        data-testid="user-sidebar-menu-delete"
                        icon={<DeleteOutlined />}
                        type="primary"
                        label={getTranslation("global.delete")}
                        loading={deleteUserLoading}
                        style={{ padding: "0px 15px" }}
                        danger
                      />
                    </Popconfirm>
                  </Space>
                </div>
              )}
            >
              <BsThreeDots
                data-testid="user-sidebar-menu-three-dots"
                style={{
                  cursor: "pointer",
                  padding: "5px 5px",
                  fontSize: "30px",
                }}
              />
            </Dropdown>
            <CloseOutlined
              data-testid="user-sidebar-close"
              style={{ cursor: "pointer", padding: "5px 5px" }}
              onClick={closeSidebar}
            />
          </Flex>
        </div>
        <Divider />
        {deleteUserError && <FullAlertError error={deleteUserError} />}
        <UserDetails form={form} />
      </div>
    </SideBar>
  );
};

export default UserSidebar;
