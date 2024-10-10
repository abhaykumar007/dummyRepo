import Button from "@/components/common/button";
import Tooltip from "@/components/common/tooltip";
import { getTranslation } from "@/translation/i18n";
import { Flex, Spin } from "antd";
import LineGraph from "./lineGraph";
import { useState } from "react";
import PolyhouseActions from "@/redux/polyhouse/action";
import { ReloadOutlined, LoadingOutlined } from "@ant-design/icons";
import { Graph, Sensor } from "@/pages/polyhouse/types";
import "./style.scss";
import { useAppDispatch } from "@/hooks/redux";

interface SensorGraphProps {
  sensor: Sensor;
  loading: boolean;
  graph: { [k: string]: Graph } | null;
}

const SensorGraph = ({ sensor, loading, graph }: SensorGraphProps) => {
  const dispatch = useAppDispatch();
  const [duration, setDuration] = useState("1");

  const handleRefresh = () => {
    dispatch(PolyhouseActions.requestGraphData([sensor], duration));
  };

  const handleChangeDuration = (changeDuration: string) => {
    if (changeDuration !== duration) {
      setDuration(changeDuration);
      dispatch(PolyhouseActions.requestGraphData([sensor], changeDuration));
    }
  };

  return (
    <div
      className="sensor-graph-container"
      data-testid="sensor-graph-container"
    >
      <div className="sensor-graph-header">
        <Button
          type="default"
          label="1Hr"
          onClick={() => handleChangeDuration("1")}
          className={` header-button-width ${
            duration === "1" ? "activeBtn" : ""
          }`}
          data-testid="graph-1Hr-button"
        />
        <Button
          type="default"
          label="4Hr"
          onClick={() => handleChangeDuration("4")}
          className={` header-button-width ${
            duration === "4" ? "activeBtn" : ""
          }`}
          data-testid="graph-4Hr-button"
        />
        <Button
          type="default"
          label="12Hr"
          onClick={() => handleChangeDuration("12")}
          className={` header-button-width ${
            duration === "12" ? "activeBtn" : ""
          }`}
          data-testid="graph-12Hr-button"
        />
        <Button
          type="default"
          label="24Hr"
          onClick={() => handleChangeDuration("24")}
          className={` header-button-width ${
            duration === "24" ? "activeBtn" : ""
          }`}
          data-testid="graph-24Hr-button"
        />
        <Button
          type="default"
          label="3D"
          onClick={() => handleChangeDuration("72")}
          className={` header-button-width ${
            duration === "72" ? "activeBtn" : ""
          }`}
          data-testid="graph-3D-button"
        />
        <Button
          type="default"
          label="1W"
          onClick={() => handleChangeDuration("168")}
          className={` header-button-width ${
            duration === "168" ? "activeBtn" : ""
          }`}
          data-testid="graph-1W-button"
        />
        <Flex gap={20}>
          <Tooltip title={getTranslation("global.refresh")}>
            <Button
              className="refreshButton"
              loading={false}
              icon={<ReloadOutlined style={{ color: "green" }} />}
              label={""}
              data-testid="graph-refresh-button"
              type="default"
              onClick={handleRefresh}
            />
          </Tooltip>
        </Flex>
      </div>
      {loading && (
        <div
          style={{
            display: "flex",
            justifyContent: "center",
            height: "500px",
            alignItems: "center",
          }}
        >
          <Spin indicator={<LoadingOutlined spin />} size="large" />
        </div>
      )}
      {!loading && graph && graph?.[sensor.sensorId] && (
        <div className="line-graph">
          <LineGraph
            labels={graph?.[sensor.sensorId].labels}
            values={graph?.[sensor.sensorId].values}
          />
        </div>
      )}
    </div>
  );
};

export default SensorGraph;
