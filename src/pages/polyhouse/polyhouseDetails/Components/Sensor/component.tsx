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
import { useNavigate } from "react-router-dom";
import routePaths from "@/config/routePaths";
import { Sensor as SensorType } from "@/pages/polyhouse/types";
import ScrollWrapper from "@/components/common/ScrollWrapper";
import "./style.scss";
import { useAppDispatch, useAppSelector } from "@/hooks/redux";
import { makeSelectErrorModel } from "@/redux/error/errorSelector";

const selectError = makeSelectErrorModel();

const ComponentData = () => {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const [lastUpdated, setLastUpdated] = useState<null | Date>(null);
  const selectedPolyhouse = useAppSelector(
    PolyhouseSelectors.SelectSelectedPolyhouse
  );

  const componentData = useAppSelector(PolyhouseSelectors.SelectComponentData);

  const error = useAppSelector((state) =>
    selectError(
      state,
      PolyhouseActions.REQUEST_COMPONENT_DATA_FOR_POLYHOUSE_FINISHED
    )
  );

  const loading = useAppSelector((state) =>
    requestingSelector(state, [
      PolyhouseActions.REQUEST_COMPONENT_DATA_FOR_POLYHOUSE,
    ])
  );

  const requestData = () => {
    dispatch(
      PolyhouseActions.requestComponentData(selectedPolyhouse.polyhouseId)
    );
  };

  useEffect(() => {
    if (selectedPolyhouse) requestData();
  }, [selectedPolyhouse]);

  useEffect(() => {
    if (componentData) {
      setLastUpdated(new Date());
    }
  }, [componentData]);

  const handleOnClick = (sensorName: string) => {
    dispatch(PolyhouseActions.setSelectedSensor(sensorName));
    navigate(
      routePaths.polyhouseSensorDetails
        .replace(":polyhouseId", selectedPolyhouse.polyhouseId)
        .replace(":sensorName", sensorName)
    );
  };

  return (
    <div>
      <Card
        className={`shadow-box ${error ? "error-border" : ""} `}
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
          {!loading && !componentData && !error && (
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
          {!loading && componentData && (
            <div>
              <ScrollWrapper maxHeight="400px">
                {Object.keys(componentData).map((sensorName) => (
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
                      {componentData[sensorName].map(
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

export default ComponentData;
