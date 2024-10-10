import Card from "@/components/ui/card";
import routePaths from "@/config/routePaths";
import { User } from "@/pages/userManagement/types";
import PolyhouseActions from "@/redux/polyhouse/action";
import PolyhouseSelectors from "@/redux/polyhouse/polyhouseSelectors";
import UserActions from "@/redux/user/actions";
import UserSelectors from "@/redux/user/selectors";
import { getTranslation } from "@/translation/i18n";
import Fields from "@/utilities/fields/field";
import moment from "moment";
import React, { useEffect, useState } from "react";
import { IoClose } from "react-icons/io5";
import { useNavigate } from "react-router-dom";
import EditablePolyhouseField from "./editablePolyhouseField";
import { numberValidator } from "@/pages/farm/CreateFarm/const";
import Dropdown from "@/components/ui/dropdown";
import { Flex, Popconfirm, Space, theme } from "antd";
import Button from "@/components/common/button";
import { BsThreeDots } from "react-icons/bs";
import { DeleteOutlined } from "@ant-design/icons";
import requestingSelector from "@/redux/requesting/requestingSelector";
import { makeSelectErrorModel } from "@/redux/error/errorSelector";
import FullAlertError from "@/components/common/error/FullAlertError";
import { successToast } from "@/utilities/toast";
import AddSensorDataModal from "./addSensorDataModal";
import { useAppDispatch, useAppSelector } from "@/hooks/redux";
import { MenuProps } from "antd/lib";
import AddSensorModal from "./sensor/sensorModal";

const selectError = makeSelectErrorModel();
const { useToken } = theme;
const PolyhouseHeader = () => {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const { token } = useToken();
  const [isPolyhouseDeleteDispatch, setIsPolyhouseDeleteDispatch] =
    useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isAddSensorDataModalOpen, setIsAddSensorDataModalOpen] =
    useState(false);
  const [isAddSensorModalOpen, setIsAddSensorModalOpen] = useState(false);
  const selectedPolyhouse = useAppSelector(
    PolyhouseSelectors.SelectSelectedPolyhouse
  );
  const loading = useAppSelector((state) =>
    requestingSelector(state, [PolyhouseActions.DELETE_POLYHOUSE])
  );

  const deleteError = useAppSelector((state) =>
    selectError(state, PolyhouseActions.DELETE_POLYHOUSE_FINISHED)
  );

  const error = useAppSelector((state) =>
    selectError(state, PolyhouseActions.REQUEST_POLYHOUSE_FINISHED)
  );

  const batchCount = useAppSelector(PolyhouseSelectors.SelectBatchCount);
  const users = useAppSelector(UserSelectors.selectUsers);
  const contentStyle: React.CSSProperties = {
    backgroundColor: token.colorBgElevated,
    borderRadius: token.borderRadiusLG,
    boxShadow: token.boxShadowSecondary,
  };
  const menuStyle: React.CSSProperties = {
    boxShadow: "none",
  };
  const menuItems: MenuProps["items"] = [
    {
      key: "0",
      label: getTranslation("polyhouse.addSensor"),
    },
  ];

  const onMenuOptionClick: MenuProps["onClick"] = (info) => {
    if (info.key === "0") {
      setIsAddSensorModalOpen(true);
    }
  };

  const getSelectedUser = (userId: string) => {
    let selectedUserName = "";
    users.forEach((user: User) => {
      if (user.userId === userId)
        selectedUserName = `${user.firstName} ${user.lastName}`;
    });

    return selectedUserName;
  };

  useEffect(() => {
    if (users.length === 0) dispatch(UserActions.fetchUsers());
  }, [users]);

  const handleClose = () => {
    dispatch(PolyhouseActions.setSelectedPolyhouse(null));
    navigate(routePaths.polyhouse);
  };

  const deleteFarm = () => {
    setIsPolyhouseDeleteDispatch(true);
    dispatch(PolyhouseActions.deletePolyhouse(selectedPolyhouse.polyhouseId));
  };

  useEffect(() => {
    if (!loading && isPolyhouseDeleteDispatch) {
      if (!deleteError) {
        successToast(
          getTranslation("polyhouse.polyhouseDetails.polyhouseDeleteToast")
        );
        navigate(routePaths.polyhouse);
      }
    }
  }, [loading, deleteError, isPolyhouseDeleteDispatch]);

  return (
    <div>
      {error && <FullAlertError error={error} />}
      {deleteError && <FullAlertError error={deleteError} />}
      {selectedPolyhouse && (
        <Card
          title={
            <div className="heading1" style={{ width: "50%" }}>
              <EditablePolyhouseField
                fieldName="name"
                value={selectedPolyhouse?.name}
              >
                {selectedPolyhouse?.name}
              </EditablePolyhouseField>
            </div>
          }
          bordered={false}
          className="shadow-box"
          extra={
            <Flex style={{ width: "100%" }} gap={20} justify="center">
              <Button
                style={{ padding: "5px 15px" }}
                label={getTranslation("polyhouse.manualEntry")}
                onClick={() => setIsAddSensorDataModalOpen(true)}
              />
              <Dropdown
                trigger={["click"]}
                open={isMenuOpen}
                onOpenChange={setIsMenuOpen}
                dropdownRender={(menu) => (
                  <div style={contentStyle}>
                    {React.cloneElement(menu as React.ReactElement, {
                      style: menuStyle,
                    })}
                    <Space style={{ padding: 3 }}>
                      <Popconfirm
                        title={getTranslation("global.areYouSure")}
                        okText={getTranslation("global.yes")}
                        cancelText={getTranslation("global.cancel")}
                        onCancel={() => setIsMenuOpen(false)}
                        onConfirm={deleteFarm}
                      >
                        <Button
                          icon={<DeleteOutlined />}
                          type="primary"
                          label={getTranslation("global.delete")}
                          loading={loading}
                          style={{ padding: "0px 15px" }}
                          danger
                          iconPosition="start"
                        />
                      </Popconfirm>
                    </Space>
                  </div>
                )}
                label={
                  <BsThreeDots
                    style={{
                      cursor: "pointer",
                      marginRight: "10px",
                    }}
                    data-testid="polyhouse-threeDots-icon"
                    fontSize={20}
                  />
                }
                isDownDropIconHide={true}
                menu={{
                  onClick: onMenuOptionClick,
                  items: menuItems,
                  selectable: false,
                }}
              />
              <IoClose
                size={40}
                className="close-icon"
                data-testid="polyhouse-close-icon"
                onClick={handleClose}
              />
            </Flex>
          }
        >
          <div className="polyhouse-content">
            <AddSensorDataModal
              isOpen={isAddSensorDataModalOpen}
              setIsOpen={setIsAddSensorDataModalOpen}
              sensorArea="polyhouse"
              polyhouse={{ id: selectedPolyhouse.polyhouseId }}
            />
            <AddSensorModal
              isOpen={isAddSensorModalOpen}
              setIsOpen={setIsAddSensorModalOpen}
              zoneId={selectedPolyhouse.polyhouseId}
              sensorArea="polyhouse"
            />
            <div className="polyhouse-column">
              <Fields
                info={[
                  {
                    label: getTranslation("polyhouse.structureExpectedLife"),
                    value: (
                      <span className="field-value">
                        <EditablePolyhouseField
                          fieldName="structureExpectedLife"
                          value={selectedPolyhouse?.structureExpectedLife}
                          customValidator={numberValidator}
                          isParseField
                        >
                          <div style={{ display: "flex", gap: "5px" }}>
                            <div>
                              {selectedPolyhouse?.structureExpectedLife}
                            </div>
                            <div>{getTranslation("global.year")}</div>
                          </div>
                        </EditablePolyhouseField>
                      </span>
                    ),
                  },
                  {
                    label: getTranslation("polyhouse.plasticExpectedLife"),
                    value: (
                      <span className="field-value">
                        <EditablePolyhouseField
                          fieldName="plasticExpectedLife"
                          value={selectedPolyhouse?.plasticExpectedLife}
                          customValidator={numberValidator}
                          isParseField
                        >
                          <div style={{ display: "flex", gap: "5px" }}>
                            <div>{selectedPolyhouse?.plasticExpectedLife}</div>
                            <div>{getTranslation("global.year")}</div>
                          </div>
                        </EditablePolyhouseField>
                      </span>
                    ),
                  },
                ]}
              />
            </div>
            <div className="polyhouse-column">
              <Fields
                info={[
                  {
                    label: getTranslation("global.createdBy"),
                    value: (
                      <span className="field-value">
                        <div>
                          {getSelectedUser(selectedPolyhouse?.createdBy)}
                        </div>
                      </span>
                    ),
                  },
                  {
                    label: getTranslation("global.createdDate"),
                    value: (
                      <span className="field-value">
                        <div>
                          {moment(
                            new Date(selectedPolyhouse.createdDate)
                          ).format("DD-MM-YYYY")}
                        </div>
                      </span>
                    ),
                  },
                ]}
              />
            </div>
            <div className="polyhouse-column">
              <Fields
                info={[
                  {
                    label: getTranslation("global.updatedBy"),
                    value: (
                      <span className="field-value">
                        <div>
                          {getSelectedUser(selectedPolyhouse?.updatedBy)}
                        </div>
                      </span>
                    ),
                  },
                  {
                    label: getTranslation("global.updatedDate"),
                    value: (
                      <span className="field-value">
                        <div>
                          {moment(
                            new Date(selectedPolyhouse.updatedDate)
                          ).format("DD-MM-YYYY")}
                        </div>
                      </span>
                    ),
                  },
                ]}
              />
            </div>
            <div className="polyhouse-column">
              <Fields
                info={[
                  {
                    label: getTranslation("polyhouse.batches"),
                    value: (
                      <span className="field-value">
                        <div>{batchCount}</div>
                      </span>
                    ),
                  },
                ]}
              />
            </div>
          </div>
        </Card>
      )}
    </div>
  );
};

export default PolyhouseHeader;
