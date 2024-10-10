import PolyhouseSelectors from "@/redux/polyhouse/polyhouseSelectors";
import ZoneDetailsHeaders from "./zoneDetailsHeader";
import ZoneSensor from "./zoneSensor";
import ZoneComponent from "./zoneComponent";
import TaskDetails from "../Task/taskDetails";
import PolyhouseActions from "@/redux/polyhouse/action";
import { useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import FarmSelectors from "@/redux/farm/farmSelectors";
import requestingSelector from "@/redux/requesting/requestingSelector";
import FarmActions from "@/redux/farm/action";
import { makeSelectErrorModel } from "@/redux/error/errorSelector";
import { Spin } from "antd";
import FullAlertError from "@/components/common/error/FullAlertError";
import { LoadingOutlined } from "@ant-design/icons";
import { useAppDispatch, useAppSelector } from "@/hooks/redux";
import ScrollWrapper from "@/components/common/ScrollWrapper";
import { Polyhouse } from "@/pages/polyhouse/types";
import routePaths from "@/config/routePaths";

const selectError = makeSelectErrorModel();

const ZoneDetails = () => {
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const param = useParams();
  const selectedZone = useAppSelector(PolyhouseSelectors.SelectSelectedZone);
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
      PolyhouseActions.REQUEST_ZONE,
    ])
  );

  const error = useAppSelector((state) =>
    selectError(state, PolyhouseActions.REQUEST_ZONE_FINISHED)
  );

  const sensorError = useAppSelector((state) =>
    selectError(state, PolyhouseActions.REQUEST_SENSOR_DATA_FOR_ZONE_FINISHED)
  );

  const componentError = useAppSelector((state) =>
    selectError(
      state,
      PolyhouseActions.REQUEST_COMPONENT_DATA_FOR_ZONE_FINISHED
    )
  );

  useEffect(() => {
    if (!selectedZone && param.polyhouseId && selectedFarmId && param.zoneId) {
      dispatch(PolyhouseActions.requestPolyhouse(param.polyhouseId));
      dispatch(PolyhouseActions.requestZone(param.polyhouseId, param.zoneId));
    }
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
    <ScrollWrapper maxHeight={`${window.innerHeight - 100}px`}>
      <div style={{ border: "10px black solid" }}>
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

        {selectedZone && (
          <div>
            <ZoneDetailsHeaders />
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
                <ZoneSensor />
              </div>
              <div className="component-data">
                <ZoneComponent />
              </div>
              <div className="task-details">
                <TaskDetails />
              </div>
            </div>
          </div>
        )}
      </div>
    </ScrollWrapper>
  );
};

export default ZoneDetails;
