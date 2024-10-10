import Card from "@/components/ui/card";
import routePaths from "@/config/routePaths";
import { User } from "@/pages/userManagement/types";
import PolyhouseSelectors from "@/redux/polyhouse/polyhouseSelectors";
import UserActions from "@/redux/user/actions";
import UserSelectors from "@/redux/user/selectors";
import { getTranslation } from "@/translation/i18n";
import Fields from "@/utilities/fields/field";
import moment from "moment";
import React, { useEffect, useState } from "react";
import { IoClose } from "react-icons/io5";
import { useNavigate, useParams } from "react-router-dom";
import EditableNurseryField from "./editableNurseryField";
import {
  numberValidator,
  nurseryGerminationType,
  nurseryType,
  wateringType,
} from "@/pages/farm/CreateFarm/const";
import Dropdown from "@/components/ui/dropdown";
import { Flex, Popconfirm, theme } from "antd";
import Button from "@/components/common/button";
import { BsThreeDots } from "react-icons/bs";
import PolyhouseActions from "@/redux/polyhouse/action";
import { DeleteOutlined } from "@ant-design/icons";
import { makeSelectErrorModel } from "@/redux/error/errorSelector";
import FullAlertError from "@/components/common/error/FullAlertError";
import requestingSelector from "@/redux/requesting/requestingSelector";
import { successToast } from "@/utilities/toast";
import AddSensorDataModal from "../../addSensorDataModal";
import { useAppDispatch, useAppSelector } from "@/hooks/redux";
import { MenuProps } from "antd/lib";
import AddSensorModal from "../../sensor/sensorModal";

const selectError = makeSelectErrorModel();
const { useToken } = theme;
const NurseryDetailsHeaders = () => {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const { token } = useToken();
  const param = useParams();
  const selectedNursery = useAppSelector(
    PolyhouseSelectors.SelectSelectedNursery
  );
  const [isAddSensorDataModalOpen, setIsAddSensorDataModalOpen] =
    useState(false);
    const [isAddSensorModalOpen, setIsAddSensorModalOpen] = useState(false);
  const selectedPolyhouse = useAppSelector(
    PolyhouseSelectors.SelectSelectedPolyhouse
  );
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isActionDispatched, setIsActionDispatched] = useState(false);
  const users = useAppSelector(UserSelectors.selectUsers);

  const loading = useAppSelector((state) =>
    requestingSelector(state, [PolyhouseActions.DELETE_NURSERY])
  );

  const deleteError = useAppSelector((state) =>
    selectError(state, PolyhouseActions.DELETE_NURSERY_FINISHED)
  );

  const getSelectedUser = (userId: string) => {
    let selectedUserName = "";
    users.forEach((user: User) => {
      if (user.userId === userId)
        selectedUserName = `${user.firstName} ${user.lastName}`;
    });

    return selectedUserName;
  };
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

  useEffect(() => {
    if (users.length === 0) dispatch(UserActions.fetchUsers());
  }, [users]);

  const handleClose = () => {
    if (param.polyhouseId)
      navigate(routePaths.nurseries.replace(":polyhouseId", param.polyhouseId));
  };

  const deleteNursery = () => {
    dispatch(PolyhouseActions.deleteNursery(selectedNursery.nurseryId));
    setIsActionDispatched(true);
  };

  useEffect(() => {
    if (!loading && !deleteError && isActionDispatched) {
      successToast(
        getTranslation("polyhouse.polyhouseDetails.nurseryDeleteToast")
      );
      handleClose();
    }
  }, [loading, deleteError, isActionDispatched]);

  return (
    <div>
      {deleteError && <FullAlertError error={deleteError} />}
      {selectedNursery && (
        <Card
          title={
            <div className="heading1">
              <EditableNurseryField
                fieldName="name"
                value={selectedNursery?.name}
                nurseryId={selectedNursery.nurseryId}
                polyhouseId={selectedPolyhouse.polyhouseId}
              >
                {selectedNursery?.name}
              </EditableNurseryField>
            </div>
          }
          bordered={false}
          className="shadow-box"
          extra={
            <Flex
              style={{ width: "100%", alignItems: "center" }}
              gap={20}
              justify="center"
            >
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
                    <Popconfirm
                      title={getTranslation("global.areYouSure")}
                      okText={getTranslation("global.yes")}
                      cancelText={getTranslation("global.cancel")}
                      onCancel={() => setIsMenuOpen(false)}
                      onConfirm={deleteNursery}
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
                  </div>
                )}
                label={
                  <BsThreeDots
                    style={{
                      cursor: "pointer",
                      marginRight: "10px",
                    }}
                    fontSize={20}
                    data-testid="nursery-threeDots-icon"
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
                data-testid="nursery-header-close-icon"
                onClick={handleClose}
              />
            </Flex>
          }
        >
          <div className="polyhouse-content">
            <AddSensorDataModal
              isOpen={isAddSensorDataModalOpen}
              setIsOpen={setIsAddSensorDataModalOpen}
              sensorArea="nursery"
              polyhouse={{ nurseryId: selectedNursery.nurseryId }}
            />
            <AddSensorModal
              isOpen={isAddSensorModalOpen}
              setIsOpen={setIsAddSensorModalOpen}
              zoneId={selectedPolyhouse.zoneId}
              sensorArea="nursery"
            />
            <div className="polyhouse-column">
              <Fields
                info={[
                  {
                    label: "Type",
                    value: (
                      <span className="field-value">
                        <div>
                          <EditableNurseryField
                            fieldName="type"
                            value={selectedNursery?.type}
                            nurseryId={selectedNursery.nurseryId}
                            polyhouseId={selectedPolyhouse.polyhouseId}
                            udf={{
                              options: nurseryType,
                              onlyFromLov: true,
                              listOfValues: nurseryType,
                            }}
                            type="string"
                          >
                            {selectedNursery?.type}
                          </EditableNurseryField>
                        </div>
                      </span>
                    ),
                  },
                  {
                    label: "Watering type",
                    value: (
                      <span className="field-value">
                        <div>
                          <EditableNurseryField
                            fieldName="wateringType"
                            value={selectedNursery?.wateringType}
                            nurseryId={selectedNursery.nurseryId}
                            polyhouseId={selectedPolyhouse.polyhouseId}
                            udf={{
                              options: wateringType,
                              onlyFromLov: true,
                              listOfValues: wateringType,
                            }}
                            type="string"
                          >
                            {selectedNursery?.wateringType}
                          </EditableNurseryField>
                        </div>
                      </span>
                    ),
                  },
                  {
                    label: "Watering schedule",
                    value: (
                      <span className="field-value">
                        <div>
                          <EditableNurseryField
                            fieldName="wateringSchedule"
                            value={selectedNursery?.wateringSchedule}
                            nurseryId={selectedNursery.nurseryId}
                            polyhouseId={selectedPolyhouse.polyhouseId}
                          >
                            {selectedNursery?.wateringSchedule}
                          </EditableNurseryField>
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
                    label: "Germination type",
                    value: (
                      <span className="field-value">
                        <div>
                          <EditableNurseryField
                            fieldName="germinationType"
                            value={selectedNursery?.germinationType}
                            nurseryId={selectedNursery.nurseryId}
                            polyhouseId={selectedPolyhouse.polyhouseId}
                            udf={{
                              options: nurseryGerminationType,
                              onlyFromLov: true,
                              listOfValues: nurseryGerminationType,
                            }}
                            type="string"
                          >
                            {selectedNursery?.germinationType}
                          </EditableNurseryField>
                        </div>
                      </span>
                    ),
                  },

                  {
                    label: "Area",
                    value: (
                      <span className="field-value">
                        <div>
                          <EditableNurseryField
                            fieldName="area"
                            isParseField
                            customValidator={numberValidator}
                            value={selectedNursery?.area}
                            nurseryId={selectedNursery.nurseryId}
                            polyhouseId={selectedPolyhouse.polyhouseId}
                          >
                            {selectedNursery?.area}
                          </EditableNurseryField>
                        </div>
                      </span>
                    ),
                  },
                  {
                    label: "Seed count",
                    value: (
                      <span className="field-value">
                        <div>
                          <EditableNurseryField
                            fieldName="seedCount"
                            isParseField
                            customValidator={numberValidator}
                            value={selectedNursery?.seedCount}
                            nurseryId={selectedNursery.nurseryId}
                            polyhouseId={selectedPolyhouse.polyhouseId}
                          >
                            {selectedNursery?.seedCount}
                          </EditableNurseryField>
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
                    label: "Germination area",
                    value: (
                      <span className="field-value">
                        <div>
                          <EditableNurseryField
                            fieldName="germinationArea"
                            isParseField
                            customValidator={numberValidator}
                            value={selectedNursery?.germinationArea}
                            nurseryId={selectedNursery.nurseryId}
                            polyhouseId={selectedPolyhouse.polyhouseId}
                          >
                            {selectedNursery?.germinationArea}
                          </EditableNurseryField>
                        </div>
                      </span>
                    ),
                  },

                  {
                    label: getTranslation("global.createdBy"),
                    value: (
                      <span className="field-value">
                        <div>{getSelectedUser(selectedNursery?.createdBy)}</div>
                      </span>
                    ),
                  },
                  {
                    label: getTranslation("global.createdDate"),
                    value: (
                      <span className="field-value">
                        <div>
                          {moment(new Date(selectedNursery.createdDate)).format(
                            "DD-MM-YYYY"
                          )}
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
                        <div>{getSelectedUser(selectedNursery?.updatedBy)}</div>
                      </span>
                    ),
                  },
                  {
                    label: getTranslation("global.updatedDate"),
                    value: (
                      <span className="field-value">
                        <div>
                          {moment(new Date(selectedNursery.updatedDate)).format(
                            "DD-MM-YYYY"
                          )}
                        </div>
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

export default NurseryDetailsHeaders;
