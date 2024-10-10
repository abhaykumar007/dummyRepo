import Button from "@/components/common/button";
import Tooltip from "@/components/common/tooltip";
import Card from "@/components/ui/card";
import PolyhouseActions from "@/redux/polyhouse/action";
import PolyhouseSelectors from "@/redux/polyhouse/polyhouseSelectors";
import { getTranslation } from "@/translation/i18n";
import { Flex, Spin } from "antd";
import moment from "moment";
import { useEffect, useState } from "react";
import { ReloadOutlined, LoadingOutlined } from "@ant-design/icons";
import requestingSelector from "@/redux/requesting/requestingSelector";
import { useNavigate, useParams } from "react-router-dom";
import routePaths from "@/config/routePaths";
import { Sensor as SensorType } from "@/pages/polyhouse/types";
import ScrollWrapper from "@/components/common/ScrollWrapper";
import { useAppDispatch, useAppSelector } from "@/hooks/redux";
import { makeSelectErrorModel } from "@/redux/error/errorSelector";

const selectError = makeSelectErrorModel();

const ZoneComponent = () => {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const param = useParams();
  const [lastUpdated, setLastUpdated] = useState<null | Date>(null);
  const selectedZone = useAppSelector(PolyhouseSelectors.SelectSelectedZone);
  const sensorData = useAppSelector(PolyhouseSelectors.SelectZoneComponentData);

  const error = useAppSelector((state) =>
    selectError(
      state,
      PolyhouseActions.REQUEST_COMPONENT_DATA_FOR_ZONE_FINISHED
    )
  );

  const loading = useAppSelector((state) =>
    requestingSelector(state, [
      PolyhouseActions.REQUEST_COMPONENT_DATA_FOR_ZONE,
    ])
  );

  const requestData = () => {
    dispatch(PolyhouseActions.requestZoneComponentData(selectedZone.zoneId));
  };

  useEffect(() => {
    if (selectedZone) requestData();
  }, [selectedZone]);

  useEffect(() => {
    if (sensorData) {
      setLastUpdated(new Date());
    }
  }, [sensorData]);

  const handleOnClick = (sensorName: string) => {
    dispatch(PolyhouseActions.setSelectedSensor(sensorName));
    if (param.polyhouseId && param.zoneId)
      navigate(
        routePaths.zoneSensorDetails
          .replace(":polyhouseId", param.polyhouseId)
          .replace(":zoneId", param.zoneId)
          .replace(":sensorName", sensorName)
      );
  };

  return (
    <div>
      <Card
        className="shadow-box"
        title={
          <div className="heading1">
            {getTranslation("polyhouse.polyhouseDetails.components")}
          </div>
        }
        extra={
          <Flex gap={20}>
            <Tooltip title={getTranslation("global.refresh")}>
              <Button
                className="refreshButton"
                loading={false}
                icon={<ReloadOutlined style={{ color: "green" }} />}
                label={""}
                data-testid="refresh-button"
                type="default"
                onClick={requestData}
              />
            </Tooltip>
          </Flex>
        }
      >
        <div className="cursor_pointer">
          {loading && (
            <span style={{ display: "flex", justifyContent: "center" }}>
              <Spin indicator={<LoadingOutlined spin />} size="large" />
            </span>
          )}
          {!loading && !sensorData && !error && (
            <span
              style={{
                color: "gray",
                display: "flex",
                justifyContent: "center",
              }}
            >
              {getTranslation("polyhouse.polyhouseDetails.noComponents")}
            </span>
          )}
          {!loading && lastUpdated && (
            <div
              style={{
                display: "flex",
                flexDirection: "column",
                alignItems: "flex-end",
                fontStyle: "italic",
                marginBottom: "7px",
              }}
              className="description"
            >
              <div>
                {getTranslation("polyhouse.polyhouseDetails.lastUpdated")}:{" "}
              </div>
              <div>{moment(lastUpdated).format("DD-MM-YYYY HH:mm:ss")}</div>
            </div>
          )}
          {!loading && sensorData && (
            <div>
              <ScrollWrapper maxHeight="400px">
                {Object.keys(sensorData).map((sensorName) => (
                  <div
                    style={{
                      backgroundColor: "#FAFAFA",
                      padding: "10px",
                      marginBottom: "15px",
                      borderRadius: "10px",
                    }}
                    className="shadow-box"
                    onClick={() => handleOnClick(sensorName)}
                  >
                    <div
                      className="heading3"
                      style={{
                        marginBottom: "10px",
                        fontWeight: "600",
                        borderBottom: "1px solid #f0f0f0",
                        paddingBottom: "5px",
                      }}
                    >
                      {sensorName}
                    </div>

                    <div>
                      {sensorData[sensorName].map(
                        (sensor: SensorType, index: number) => (
                          <div
                            style={{
                              display: "flex",
                              justifyContent: "space-between",
                              fontWeight: "600",
                              flexWrap: "wrap",
                            }}
                          >
                            <div>{`${sensorName} ${index + 1}`} :</div>
                            <div>
                              {sensor.parameters[0].currentValue}{" "}
                              {sensor.parameters[0].unit}
                            </div>
                          </div>
                        )
                      )}
                    </div>
                  </div>
                ))}
              </ScrollWrapper>
            </div>
          )}
        </div>
      </Card>
    </div>
  );
};

export default ZoneComponent;
