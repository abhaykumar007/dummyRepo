import PolyhouseSelectors from "@/redux/polyhouse/polyhouseSelectors";
import NurseryDetailsHeader from "./nurseryDetailsHeader";
import NurserySensor from "./nurserySensor";
import NurseryComponent from "./nurseryComponentData";
import TaskDetails from "../Task/taskDetails";
import { useNavigate, useParams } from "react-router-dom";
import FarmSelectors from "@/redux/farm/farmSelectors";
import requestingSelector from "@/redux/requesting/requestingSelector";
import PolyhouseActions from "@/redux/polyhouse/action";
import FarmActions from "@/redux/farm/action";
import { useEffect } from "react";
import { makeSelectErrorModel } from "@/redux/error/errorSelector";
import { LoadingOutlined } from "@ant-design/icons";
import { Spin } from "antd";
import FullAlertError from "@/components/common/error/FullAlertError";
import { useAppDispatch, useAppSelector } from "@/hooks/redux";
import ScrollWrapper from "@/components/common/ScrollWrapper";
import { Polyhouse } from "@/pages/farm/types";
import routePaths from "@/config/routePaths";

const selectError = makeSelectErrorModel();

const NurseryDetails = () => {
  const navigate = useNavigate();
  const selectedNursery = useAppSelector(
    PolyhouseSelectors.SelectSelectedNursery
  );
  const dispatch = useAppDispatch();
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
      PolyhouseActions.REQUEST_ZONE,
    ])
  );

  const error = useAppSelector((state) =>
    selectError(state, PolyhouseActions.REQUEST_NURSERY_FINISHED)
  );

  const sensorError = useAppSelector((state) =>
    selectError(
      state,
      PolyhouseActions.REQUEST_SENSOR_DATA_FOR_NURSERY_FINISHED
    )
  );

  const componentError = useAppSelector((state) =>
    selectError(
      state,
      PolyhouseActions.REQUEST_COMPONENT_DATA_FOR_NURSERY_FINISHED
    )
  );

  useEffect(() => {
    if (
      !selectedNursery &&
      param.polyhouseId &&
      selectedFarmId &&
      param.nurseryId
    ) {
      dispatch(PolyhouseActions.requestPolyhouse(param.polyhouseId));
      dispatch(
        PolyhouseActions.requestNursery(param.polyhouseId, param.nurseryId)
      );
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
      <div>
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
        {selectedNursery && (
          <div>
            <NurseryDetailsHeader />
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
                <NurserySensor />
              </div>
              <div className="component-data">
                <NurseryComponent />
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

export default NurseryDetails;
