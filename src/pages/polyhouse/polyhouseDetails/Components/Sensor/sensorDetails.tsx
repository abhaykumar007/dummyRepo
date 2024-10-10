import PolyhouseActions from "@/redux/polyhouse/action";
import PolyhouseSelectors from "@/redux/polyhouse/polyhouseSelectors";
import { Graph, Polyhouse, Schedule, Sensor } from "@/pages/polyhouse/types";
import { RootState } from "@/redux/store";
import requestingSelector from "@/redux/requesting/requestingSelector";
import { useEffect, useRef } from "react";
import { useNavigate, useParams } from "react-router-dom";
import FarmSelectors from "@/redux/farm/farmSelectors";
import Card from "@/components/ui/card";
import SensorGraph from "./sensorGraph";
import Fields from "@/utilities/fields/field";
import moment from "moment";
import { DeleteOutlined, LoadingOutlined } from "@ant-design/icons";
import { Spin } from "antd";
import { IoClose } from "react-icons/io5";
import "./style.scss";
import routePaths from "@/config/routePaths";
import { getTranslation } from "@/translation/i18n";
import { useAppDispatch, useAppSelector } from "@/hooks/redux";
import { getSensorUnit } from "@/pages/polyhouse/utills";
import AddSchedule from "./addSchedule";
import EditableScheduleField from "./editableSchedule";
import dayjs from "dayjs";
import { makeSelectErrorModel } from "@/redux/error/errorSelector";
import FullAlertError from "@/components/common/error/FullAlertError";

const selectError = makeSelectErrorModel();

const convertBackendTime = (time: number): dayjs.Dayjs => {
  const timeStr = time.toFixed(2).replace(".", ":");

  return dayjs(timeStr, "HH:mm");
};

const SensorDetails = () => {
  const navigate = useNavigate();
  const hasCalledHandleGetData = useRef(false);
  const dispatch = useAppDispatch();
  const param = useParams();
  const selectedPolyhouse = useAppSelector(
    PolyhouseSelectors.SelectSelectedPolyhouse
  );
  const selectedFarmId = useAppSelector(FarmSelectors.SelectSelectedFarmId);
  const selectedFarm = useAppSelector((state) =>
    FarmSelectors.SelectFarmByFarmId(state, selectedFarmId || "")
  );
  const sensorName = useAppSelector(PolyhouseSelectors.SelectSensorName);
  const sensor = useAppSelector(PolyhouseSelectors.SelectSensorData);
  const component = useAppSelector(PolyhouseSelectors.SelectComponentData);
  const nurserySensor = useAppSelector(
    PolyhouseSelectors.SelectSensorNurseryData
  );
  const nurseryComponent = useAppSelector(
    PolyhouseSelectors.SelectNurseryComponentData
  );

  const deleteScheduleError = useAppSelector((state) =>
    selectError(state, PolyhouseActions.ADD_SCHEDULE_FINISHED)
  );

  const requestLoading = useAppSelector((state) =>
    requestingSelector(state, [
      PolyhouseActions.REQUEST_POLYHOUSE,
      PolyhouseActions.REQUEST_SENSOR_DATA_FOR_ZONE,
      PolyhouseActions.REQUEST_SENSOR_DATA_FOR_NURSERY,
    ])
  );

  const zoneSensor = useAppSelector(PolyhouseSelectors.SelectSensorZoneData);
  const ZoneComponent = useAppSelector(
    PolyhouseSelectors.SelectZoneComponentData
  );
  const sensorDetails =
    sensor?.[sensorName] ||
    component?.[sensorName] ||
    nurserySensor?.[sensorName] ||
    nurseryComponent?.[sensorName] ||
    zoneSensor?.[sensorName] ||
    ZoneComponent?.[sensorName];

  const graph: { [k: string]: Graph } | null = useAppSelector(
    (state: RootState) => PolyhouseSelectors.SelectGraph(state)
  );

  const loading = useAppSelector((state) =>
    requestingSelector(state, [PolyhouseActions.REQUEST_GRAPH_DATA])
  );

  const handleGetData = (duration: string) => {
    dispatch(PolyhouseActions.requestGraphData(sensorDetails, duration));
  };

  useEffect(() => {
    if (sensorDetails && !hasCalledHandleGetData.current) {
      handleGetData("1");
      hasCalledHandleGetData.current = true;
    }
  }, [sensorDetails]);

  const pageRefresh = () => {
    if (selectedFarmId && !selectedPolyhouse) {
      switch (true) {
        case !!param.zoneId:
          if (param.polyhouseId) {
            dispatch(PolyhouseActions.requestPolyhouse(param.polyhouseId));
            dispatch(PolyhouseActions.requestZoneSensorData(param.zoneId));
            dispatch(PolyhouseActions.requestZoneComponentData(param.zoneId));
          }
          break;
        case !!param.nurseryId:
          if (param.polyhouseId) {
            dispatch(PolyhouseActions.requestPolyhouse(param.polyhouseId));
            dispatch(
              PolyhouseActions.requestNurserySensorData(param.nurseryId)
            );
            dispatch(
              PolyhouseActions.requestNurseryComponentData(param.nurseryId)
            );
          }
          break;
        case !!param.polyhouseId:
          dispatch(PolyhouseActions.requestPolyhouse(param.polyhouseId));
          dispatch(PolyhouseActions.requestSensorData(param.polyhouseId));
          dispatch(PolyhouseActions.requestComponentData(param.polyhouseId));
          break;
        default:
          break;
      }
    }

    if (!sensorName && param.sensorName) {
      dispatch(PolyhouseActions.setSelectedSensor(param.sensorName));
    }
  };

  const handleClose = () => {
    switch (true) {
      case !!param.zoneId:
        if (param.polyhouseId) {
          navigate(
            routePaths.zoneDetails
              .replace(":polyhouseId", param.polyhouseId)
              .replace(":zoneId", param.zoneId)
          );
        }
        break;
      case !!param.nurseryId:
        if (param.polyhouseId) {
          navigate(
            routePaths.nurseryDetails
              .replace(":polyhouseId", param.polyhouseId)
              .replace(":nurseryId", param.nurseryId)
          );
        }
        break;
      case !!param.polyhouseId:
        navigate(
          routePaths.polyhouseDetails.replace(":polyhouseId", param.polyhouseId)
        );
        break;
      default:
        break;
    }
  };

  useEffect(() => {
    pageRefresh();
  }, [selectedFarmId]);

  useEffect(() => {
    if (selectedPolyhouse) {
      const isPolyhousesAreOfSameFarmId = selectedFarm.polyhouses.find(
        (polyhouse: Polyhouse) =>
          polyhouse.polyhouseId === selectedPolyhouse.polyhouseId
      );
      if (!isPolyhousesAreOfSameFarmId) navigate(routePaths.polyhouse);
    }
  }, [selectedPolyhouse, selectedFarm]);

  return (
    <div>
      <div className="sensor-details-container shadow-box">
        <div className="sensor-details-header">
          <div
            className="heading1"
            style={{ fontWeight: 600, paddingLeft: "12px" }}
          >
            {sensorName}
          </div>
          <IoClose
            className="close-icon"
            data-testid="sensorDetails-close-button"
            onClick={handleClose}
          />
        </div>
      </div>
      {requestLoading && (
        <span
          style={{
            display: "flex",
            justifyContent: "center",
            marginTop: "10vh",
          }}
        >
          <Spin indicator={<LoadingOutlined spin />} size="large" />
        </span>
      )}
      {sensorDetails &&
        sensorDetails.map((sensor: Sensor, index: number) => (
          <Card
            key={sensor.sensorId}
            className="sensor-card shadow-box"
            title={`${sensorName} ${index + 1}`}
          >
            <div className="sensor-content">
              {sensor.parameters[0].isGraph && (
                <SensorGraph sensor={sensor} loading={loading} graph={graph} />
              )}
              <div style={{ flexGrow: "1" }}>
                <div className="sensor-content">
                  {sensorDetails && (
                    <div
                      className={`${
                        sensor.parameters[0].isGraph
                          ? "sensor-graph-info"
                          : "sensor-info"
                      }`}
                    >
                      <span className="heading3" style={{ fontWeight: 600 }}>
                        {getTranslation(
                          "polyhouse.polyhouseDetails.sensorDetails.basicDetails"
                        )}
                      </span>
                      <div style={{ marginTop: "10px" }}>
                        <Fields
                          info={[
                            {
                              label: getTranslation("global.name"),
                              value: (
                                <span>
                                  <div>{sensor.parameters[0].uiLabel}</div>
                                </span>
                              ),
                            },
                            {
                              label: getTranslation("global.description"),
                              value: (
                                <span>
                                  <div>{sensor.parameters[0].description}</div>
                                </span>
                              ),
                            },
                            {
                              label: getTranslation(
                                "polyhouse.polyhouseDetails.sensorDetails.currentValues"
                              ),
                              value: (
                                <span>
                                  <div>
                                    {sensor.parameters[0].currentValue}{" "}
                                    {getSensorUnit(sensor.parameters[0].unit)}
                                  </div>
                                </span>
                              ),
                            },

                            {
                              label: getTranslation(
                                "polyhouse.polyhouseDetails.sensorDetails.defaultValue"
                              ),
                              value: (
                                <span>
                                  <div>
                                    {sensor.parameters[0].defaultValue}{" "}
                                    {getSensorUnit(sensor.parameters[0].unit)}
                                  </div>
                                </span>
                              ),
                            },

                            {
                              label: getTranslation("global.createdDate"),
                              value: (
                                <span>
                                  <div>
                                    {moment(
                                      new Date(sensor.createdDate)
                                    ).format("DD-MM-YYYY")}
                                  </div>
                                </span>
                              ),
                            },

                            {
                              label: getTranslation("global.updatedDate"),
                              value: (
                                <span>
                                  <div>
                                    {moment(
                                      new Date(sensor.updatedDate)
                                    ).format("DD-MM-YYYY")}
                                  </div>
                                </span>
                              ),
                            },
                          ]}
                        />
                      </div>
                    </div>
                  )}

                  {sensorDetails && sensor.parameters[0].isSchedule && (
                    <div className="sensor-schedule">
                      {deleteScheduleError && (
                        <FullAlertError error={deleteScheduleError} />
                      )}
                      <div>
                        <div
                          style={{
                            display: "flex",
                            justifyContent: "space-between",
                          }}
                        >
                          <span
                            className="heading3"
                            style={{ fontWeight: 600 }}
                          >
                            {getTranslation(
                              "polyhouse.polyhouseDetails.sensorDetails.schedule"
                            )}
                          </span>
                          <div>
                            <AddSchedule
                              schedule={sensor.parameters[0].schedule}
                              sensorId={sensor.sensorId}
                              parameterId={sensor.parameters[0].parameterId}
                            />
                          </div>
                        </div>
                        <div>
                          <div
                            style={{
                              fontWeight: 600,
                              marginTop: "10px",
                              display: "grid",
                              gridTemplateColumns: "1fr 1fr 1fr 0.5fr",
                              gap: "5px",
                            }}
                          >
                            <div>
                              {getTranslation(
                                "polyhouse.polyhouseDetails.sensorDetails.startTime"
                              )}
                            </div>
                            <div>
                              {getTranslation(
                                "polyhouse.polyhouseDetails.sensorDetails.stopTime"
                              )}
                            </div>
                            <div>
                              {getTranslation(
                                "polyhouse.polyhouseDetails.sensorDetails.duration"
                              )}
                            </div>
                            <div>
                              {getTranslation(
                                "polyhouse.polyhouseDetails.sensorDetails.active"
                              )}
                            </div>
                          </div>
                          {sensor.parameters &&
                            sensor.parameters[0].schedule &&
                            sensor?.parameters[0].schedule.map(
                              (sch: Schedule) => (
                                <div
                                  style={{
                                    display: "grid",
                                    gridTemplateColumns: "1fr 1fr 1fr 0.5fr",
                                    position: "relative",

                                    marginTop: "5px",
                                  }}
                                >
                                  <div>
                                    <EditableScheduleField
                                      fieldName="startTime"
                                      value={convertBackendTime(sch.startTime)}
                                      type="time"
                                      schedule={sch}
                                      sensorId={sensor.sensorId}
                                      parameterId={
                                        sensor.parameters[0].parameterId
                                      }
                                      sensorName={sensorName}
                                    >
                                      {convertBackendTime(sch.startTime).format(
                                        "h:mm A"
                                      )}
                                    </EditableScheduleField>
                                  </div>
                                  <div>
                                    <EditableScheduleField
                                      fieldName="stopTime"
                                      value={convertBackendTime(sch.stopTime)}
                                      type="time"
                                      schedule={sch}
                                      sensorId={sensor.sensorId}
                                      parameterId={
                                        sensor.parameters[0].parameterId
                                      }
                                      sensorName={sensorName}
                                    >
                                      {convertBackendTime(sch.stopTime).format(
                                        "h:mm A"
                                      )}
                                    </EditableScheduleField>
                                  </div>
                                  <div>{sch.duration || "-"}</div>
                                  <div>
                                    <DeleteOutlined
                                      style={{ color: "red" }}
                                      className="cursor_pointer"
                                      onClick={() =>
                                        dispatch(
                                          PolyhouseActions.deleteSchedule(
                                            sensor.sensorId,
                                            sensor.parameters[0].parameterId,
                                            sch.id
                                          )
                                        )
                                      }
                                    />
                                  </div>
                                </div>
                              )
                            )}
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </Card>
        ))}
    </div>
  );
};

export default SensorDetails;
