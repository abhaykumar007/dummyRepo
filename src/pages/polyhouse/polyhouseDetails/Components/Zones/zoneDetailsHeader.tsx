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
import EditableZoneField from "./editableZoneFields";
import {
  numberValidator,
  wateringType,
  zoneSystemType,
} from "@/pages/farm/CreateFarm/const";
import Dropdown from "@/components/ui/dropdown";
import { Flex, Popconfirm, Space, theme } from "antd";
import Button from "@/components/common/button";
import { BsThreeDots } from "react-icons/bs";
import { DeleteOutlined } from "@ant-design/icons";
import requestingSelector from "@/redux/requesting/requestingSelector";
import PolyhouseActions from "@/redux/polyhouse/action";
import { makeSelectErrorModel } from "@/redux/error/errorSelector";
import FullAlertError from "@/components/common/error/FullAlertError";
import { successToast } from "@/utilities/toast";
import { useAppDispatch, useAppSelector } from "@/hooks/redux";
import AddSensorDataModal from "../../addSensorDataModal";
import AddSensorModal from "../../sensor/sensorModal";
import { MenuProps } from "antd/lib";

const selectError = makeSelectErrorModel();
const { useToken } = theme;

const ZoneDetailsHeaders = () => {
  const dispatch = useAppDispatch();
  const param = useParams();
  const navigate = useNavigate();
  const { token } = useToken();
  const selectedZone = useAppSelector(PolyhouseSelectors.SelectSelectedZone);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isActionDispatched, setIsActionDispatched] = useState(false);
  const [isAddSensorDataModalOpen, setIsAddSensorDataModalOpen] =
    useState(false);
    const [isAddSensorModalOpen, setIsAddSensorModalOpen] = useState(false);
  const selectedPolyhouse = useAppSelector(
    PolyhouseSelectors.SelectSelectedPolyhouse
  );

  const users = useAppSelector(UserSelectors.selectUsers);

  const loading = useAppSelector((state) =>
    requestingSelector(state, [PolyhouseActions.DELETE_ZONE])
  );

  const deleteError = useAppSelector((state) =>
    selectError(state, PolyhouseActions.DELETE_ZONE_FINISHED)
  );
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
    if (param.polyhouseId)
      navigate(routePaths.zones.replace(":polyhouseId", param.polyhouseId));
  };

  const deleteZone = () => {
    dispatch(PolyhouseActions.deleteZone(selectedZone.zoneId));
    setIsActionDispatched(true);
  };

  useEffect(() => {
    if (!loading && isActionDispatched) {
      if (!deleteError) {
        successToast(
          getTranslation("polyhouse.polyhouseDetails.zoneDeleteToast")
        );
        handleClose();
      }
    }
  }, [loading, deleteError, isActionDispatched]);

  return (
    <div>
      {deleteError && <FullAlertError error={deleteError} />}
      {selectedZone && (
        <Card
          title={
            <div className="heading1">
              <EditableZoneField
                fieldName="name"
                value={selectedZone?.name}
                zoneId={selectedZone?.zoneId}
                polyhouseId={selectedPolyhouse.polyhouseId}
              >
                {selectedZone?.name}
              </EditableZoneField>
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
                    <Space style={{ padding: 3 }}>
                      <Popconfirm
                        title={getTranslation("global.areYouSure")}
                        okText={getTranslation("global.yes")}
                        cancelText={getTranslation("global.cancel")}
                        onCancel={() => setIsMenuOpen(false)}
                        onConfirm={deleteZone}
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
                    fontSize={20}
                    data-testid="zone-threeDots-icon"
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
                data-testid="zone-header-close-icon"
                onClick={handleClose}
              />
            </Flex>
          }
        >
          <div className="polyhouse-content">
            <AddSensorDataModal
              isOpen={isAddSensorDataModalOpen}
              setIsOpen={setIsAddSensorDataModalOpen}
              sensorArea="zone"
              polyhouse={{ zoneId: selectedZone.zoneId }}
            />
            <AddSensorModal
              isOpen={isAddSensorModalOpen}
              setIsOpen={setIsAddSensorModalOpen}
              sensorArea="zone"
               zoneId={selectedZone.zoneId}
            />
            <div className="polyhouse-column">
              <Fields
                info={[
                  {
                    label: getTranslation(
                      "polyhouse.polyhouseDetails.zones.systemType"
                    ),
                    value: (
                      <span className="field-value">
                        <div>
                          <EditableZoneField
                            fieldName="systemType"
                            value={selectedZone?.systemType}
                            zoneId={selectedZone?.zoneId}
                            polyhouseId={selectedPolyhouse.polyhouseId}
                            udf={{
                              options: zoneSystemType,
                              onlyFromLov: true,
                              listOfValues: zoneSystemType,
                            }}
                            type="string"
                          >
                            {selectedZone?.systemType}
                          </EditableZoneField>
                        </div>
                      </span>
                    ),
                  },
                  {
                    label: getTranslation(
                      "polyhouse.polyhouseDetails.zones.zoneArea"
                    ),
                    value: (
                      <span className="field-value">
                        <div>
                          <EditableZoneField
                            fieldName="area"
                            value={selectedZone?.area}
                            zoneId={selectedZone?.zoneId}
                            polyhouseId={selectedPolyhouse.polyhouseId}
                            isParseField
                            customValidator={numberValidator}
                          >
                            {selectedZone?.area}
                          </EditableZoneField>
                        </div>
                      </span>
                    ),
                  },
                  {
                    label: getTranslation(
                      "farm.createFarm.polyhouse.zone.wateringType"
                    ),
                    value: (
                      <span className="field-value">
                        <div>
                          <EditableZoneField
                            fieldName="wateringType"
                            value={selectedZone?.growingArea?.wateringType}
                            zoneId={selectedZone?.zoneId}
                            polyhouseId={selectedPolyhouse.polyhouseId}
                            udf={{
                              options: wateringType,
                              onlyFromLov: true,
                              listOfValues: wateringType,
                            }}
                            type="string"
                            isGrowing
                          >
                            {selectedZone?.growingArea?.wateringType}
                          </EditableZoneField>
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
                    label: getTranslation(
                      "farm.createFarm.polyhouse.zone.wateringSchedule"
                    ),
                    value: (
                      <span className="field-value">
                        <div>
                          <EditableZoneField
                            fieldName="wateringSchedule"
                            value={selectedZone?.growingArea?.wateringSchedule}
                            zoneId={selectedZone?.zoneId}
                            polyhouseId={selectedPolyhouse.polyhouseId}
                            isGrowing
                          >
                            {selectedZone?.growingArea?.wateringSchedule}
                          </EditableZoneField>
                        </div>
                      </span>
                    ),
                  },
                  {
                    label: getTranslation(
                      "farm.createFarm.polyhouse.zone.rowCount"
                    ),
                    value: (
                      <span className="field-value">
                        <div>
                          <EditableZoneField
                            fieldName="rowCount"
                            value={selectedZone?.growingArea?.rowCount}
                            zoneId={selectedZone?.zoneId}
                            polyhouseId={selectedPolyhouse.polyhouseId}
                            isGrowing
                            isParseField
                            customValidator={numberValidator}
                          >
                            {selectedZone?.growingArea?.rowCount}
                          </EditableZoneField>
                        </div>
                      </span>
                    ),
                  },

                  {
                    label: getTranslation(
                      "polyhouse.polyhouseDetails.zones.plantCount"
                    ),
                    value: (
                      <span className="field-value">
                        <div>
                          <EditableZoneField
                            fieldName="plantCountPerRow"
                            value={selectedZone?.growingArea?.plantCountPerRow}
                            zoneId={selectedZone?.zoneId}
                            polyhouseId={selectedPolyhouse.polyhouseId}
                            isGrowing
                            isParseField
                            customValidator={numberValidator}
                          >
                            {selectedZone?.growingArea?.plantCountPerRow}
                          </EditableZoneField>
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
                    label: getTranslation(
                      "polyhouse.polyhouseDetails.zones.plantSpacing"
                    ),
                    value: (
                      <span className="field-value">
                        <div>
                          <EditableZoneField
                            fieldName="plantSpacing"
                            value={selectedZone?.growingArea?.plantSpacing}
                            zoneId={selectedZone?.zoneId}
                            polyhouseId={selectedPolyhouse.polyhouseId}
                            isGrowing
                            isParseField
                            customValidator={numberValidator}
                          >
                            {selectedZone?.growingArea?.plantSpacing}
                          </EditableZoneField>
                        </div>
                      </span>
                    ),
                  },
                  {
                    label: getTranslation(
                      "polyhouse.polyhouseDetails.zones.rowSpacing"
                    ),
                    value: (
                      <span className="field-value">
                        <div>
                          <EditableZoneField
                            fieldName="rowSpacing"
                            value={selectedZone?.growingArea?.rowSpacing}
                            zoneId={selectedZone?.zoneId}
                            polyhouseId={selectedPolyhouse.polyhouseId}
                            isGrowing
                            isParseField
                            customValidator={numberValidator}
                          >
                            {selectedZone?.growingArea?.rowSpacing}
                          </EditableZoneField>
                        </div>
                      </span>
                    ),
                  },

                  {
                    label: getTranslation("global.createdBy"),
                    value: (
                      <span className="field-value">
                        <div>{getSelectedUser(selectedZone?.createdBy)}</div>
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
                    label: getTranslation("global.createdDate"),
                    value: (
                      <span className="field-value">
                        <div>
                          {moment(new Date(selectedZone?.createdDate)).format(
                            "DD-MM-YYYY"
                          )}
                        </div>
                      </span>
                    ),
                  },
                  {
                    label: getTranslation("global.updatedBy"),
                    value: (
                      <span className="field-value">
                        <div>{getSelectedUser(selectedZone?.updatedBy)}</div>
                      </span>
                    ),
                  },
                  {
                    label: getTranslation("global.updatedDate"),
                    value: (
                      <span className="field-value">
                        <div>
                          {moment(new Date(selectedZone.updatedDate)).format(
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

export default ZoneDetailsHeaders;
