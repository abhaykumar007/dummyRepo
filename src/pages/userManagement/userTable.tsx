import Table from "../../components/ui/table";
import Card from "@/components/ui/card";
import { Input, Flex, Tooltip, Row, Col, Grid } from "antd";
import AddUserButton from "./addUserButton";
import columns from "./columns";
import { getTranslation } from "@/translation/i18n";
import FullAlertError from "@/components/common/error/FullAlertError";
import UserSelectors from "@/redux/user/selectors";
import { useEffect, useState } from "react";
import UserActions from "@/redux/user/actions";
import { User } from "./types";
import requestingSelector from "@/redux/requesting/requestingSelector";
import { makeSelectErrorModel } from "@/redux/error/errorSelector";
import { useAppDispatch, useAppSelector } from "@/hooks/redux";
import Button from "@/components/common/button";
import { ReloadOutlined } from "@ant-design/icons";

const selectError = makeSelectErrorModel();
const { Search } = Input;
const { useBreakpoint } = Grid;

const UserTable = () => {
  const screen = useBreakpoint();
  const [filteredUsers, setFilteredUsers] = useState<User[]>([]);
  const dispatch = useAppDispatch();
  const users = useAppSelector(UserSelectors.selectFilteredUsers);
  const selectedUser = useAppSelector(UserSelectors.selectSelectedUser);
  const loading = useAppSelector((state) =>
    requestingSelector(state, [UserActions.FETCH_USERS], "")
  );
  const error = useAppSelector((state) =>
    selectError(state, UserActions.FETCH_USERS_FINISHED)
  );
  const onRow: any = (record: User) => {
    return {
      onClick: () => {
        dispatch(UserActions.selectUser(record));
      },
    };
  };

  const onSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    dispatch(UserActions.setUserFilter({ search: value }));
  };

  const onRefresh = () => {
    dispatch(UserActions.fetchUsers());
  };

  useEffect(() => {
    if (!users || users.length === 0) dispatch(UserActions.fetchUsers());
  }, []);

  useEffect(() => {
    setFilteredUsers(users);
  }, [users]);

  return (
    <Card
      style={{
        width: !selectedUser ? "100%" : "calc( 100% - 350px)",
        height: "fit-content",
        paddingTop: "20px",
      }}
      bordered={false}
      title={getTranslation("global.users")}
      className="criclebox tablespace user-table"
      extra={
        <Row
          gutter={10}
          style={{
            width: screen.xs ? "200px" : "auto",
          }}
        >
          <Col
            xs={24}
            sm={12}
            style={{
              paddingBottom: screen.xs ? "10px" : "0px",
            }}
          >
            <Search
              placeholder={getTranslation(
                "userManagement.searchUserPlaceholder"
              )}
              style={{ width: "100%", height: "32px" }}
              onChange={onSearch}
            />
          </Col>
          <Col xs={24} sm={12}>
            <Flex gap={10}>
              <AddUserButton />
              <div style={{ width: "20%" }}>
                <Tooltip title={getTranslation("global.refresh")}>
                  <Button
                    className="refreshButton"
                    onClick={onRefresh}
                    loading={loading}
                    icon={<ReloadOutlined style={{ color: "green" }} />}
                    label={""}
                    data-testid="refresh-button"
                    type="default"
                  />
                </Tooltip>
              </div>
            </Flex>
          </Col>
        </Row>
      }
    >
      <div className="table-responsive" style={{ minWidth: "600px" }}>
        {error && <FullAlertError error={error} />}
        <Table
          columns={columns}
          dataSource={filteredUsers}
          className="ant-border-space"
          onRow={onRow}
          loading={loading}
          pagination={{ pageSize: 6 }}
        />
      </div>
    </Card>
  );
};

export default UserTable;
