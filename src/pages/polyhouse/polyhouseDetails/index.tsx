// import ScrollWrapper from "@/components/common/ScrollWrapper";
import ComponentData from "./Components/Sensor/component";
import Sensor from "./Components/Sensor/sensor";
import TaskDetails from "./Components/Task/taskDetails";
import PolyhouseHeader from "./polyhouseHeader";
import "./style.scss";
import PolyhouseSelectors from "@/redux/polyhouse/polyhouseSelectors";
import { useEffect } from "react";
import PolyhouseActions from "@/redux/polyhouse/action";
import requestingSelector from "@/redux/requesting/requestingSelector";
import { makeSelectErrorModel } from "@/redux/error/errorSelector";
import FullAlertError from "@/components/common/error/FullAlertError";
import { Spin } from "antd";
import { LoadingOutlined } from "@ant-design/icons";
import { useNavigate, useParams } from "react-router-dom";
import FarmSelectors from "@/redux/farm/farmSelectors";
import FarmActions from "@/redux/farm/action";
import { useAppDispatch, useAppSelector } from "@/hooks/redux";
import ScrollWrapper from "@/components/common/ScrollWrapper";
import routePaths from "@/config/routePaths";
import { Polyhouse } from "../types";

const selectError = makeSelectErrorModel();

const PolyhouseDetails = () => {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const param = useParams();
  const selectedPolyhouse = useAppSelector(
    PolyhouseSelectors.SelectSelectedPolyhouse
  );

  const selectedFarmId = useAppSelector(FarmSelectors.SelectSelectedFarmId);
  const selectedFarm = useAppSelector((state) =>
    FarmSelectors.SelectFarmByFarmId(state, selectedFarmId || "")
  );

  const loading = useAppSelector((state) =>
    requestingSelector(state, [
      PolyhouseActions.REQUEST_POLYHOUSE,
      FarmActions.REQUEST_FARMS,
    ])
  );

  const error = useAppSelector((state) =>
    selectError(state, PolyhouseActions.REQUEST_POLYHOUSE_FINISHED)
  );
  const sensorError = useAppSelector((state) =>
    selectError(
      state,
      PolyhouseActions.REQUEST_SENSOR_DATA_FOR_POLYHOUSE_FINISHED
    )
  );

  const componentError = useAppSelector((state) =>
    selectError(
      state,
      PolyhouseActions.REQUEST_COMPONENT_DATA_FOR_POLYHOUSE_FINISHED
    )
  );

  useEffect(() => {
    if (selectedPolyhouse) {
      const isPolyhousesAreOfSameFarmId = selectedFarm.polyhouses.find(
        (polyhouse: Polyhouse) =>
          polyhouse.polyhouseId === selectedPolyhouse.polyhouseId
      );
      if (!isPolyhousesAreOfSameFarmId) navigate(routePaths.polyhouse);
    }
  }, [selectedPolyhouse, selectedFarm]);

  useEffect(() => {
    if (!selectedPolyhouse && param.polyhouseId && selectedFarmId)
      dispatch(PolyhouseActions.requestPolyhouse(param.polyhouseId));
  }, [selectedFarmId]);

  return (
    <>
      {loading && (
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
      {error && <FullAlertError error={error} />}
      {!error && !loading && selectedPolyhouse && (
        <>
          <ScrollWrapper maxHeight={`${window.innerHeight - 100}px`}>
            <div>
              <PolyhouseHeader />
            </div>
            {sensorError && (
              <div style={{ paddingTop: "15px" }}>
                <FullAlertError error={sensorError} />
              </div>
            )}
            {componentError && (
              <div style={{ paddingTop: "15px" }}>
                <FullAlertError error={componentError} />
              </div>
            )}
            <div className="middleContainer">
              <div className="sensor">
                <Sensor />
              </div>
              <div className="component-data">
                <ComponentData />
              </div>
              <div className="task-details">
                <TaskDetails />
              </div>
            </div>
          </ScrollWrapper>
        </>
      )}
    </>
  );
};

export default PolyhouseDetails;
