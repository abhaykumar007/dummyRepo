import ScrollWrapper from "@/components/common/ScrollWrapper";
import Button from "@/components/common/button";
import FullAlertError from "@/components/common/error/FullAlertError";
import Card from "@/components/ui/card";
import { LIFECYCLE_STATUS } from "@/config/consts";
import routePaths from "@/config/routePaths";
import { useAppDispatch, useAppSelector } from "@/hooks/redux";
import { Lifecycle, Polyhouse } from "@/pages/polyhouse/types";
import { makeSelectErrorModel } from "@/redux/error/errorSelector";
import FarmActions from "@/redux/farm/action";
import FarmSelectors from "@/redux/farm/farmSelectors";
import PolyhouseActions from "@/redux/polyhouse/action";
import PolyhouseSelectors from "@/redux/polyhouse/polyhouseSelectors";
import requestingSelector from "@/redux/requesting/requestingSelector";
import { getTranslation } from "@/translation/i18n";
import Fields from "@/utilities/fields/field";
import { LoadingOutlined } from "@ant-design/icons";
import { Spin } from "antd";
import { useEffect } from "react";
import { IoClose } from "react-icons/io5";
import { useNavigate, useParams } from "react-router-dom";
import "../../../style.scss";
import LifecycleStatus from "./LifecycleStatus";
import { findCurrentStepIndex } from "./startLifeCycle";

const selectError = makeSelectErrorModel();

const LifeCycle = () => {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();

  const param = useParams();

  const selectedPolyhouse = useAppSelector(
    PolyhouseSelectors.SelectSelectedPolyhouse
  );

  const selectedLifeCycles = useAppSelector(
    PolyhouseSelectors.SelectLifeCycles
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

  useEffect(() => {
    if (selectedPolyhouse)
      dispatch(
        PolyhouseActions.requestLifeCycleForPolyhouse(
          selectedPolyhouse.polyhouseId
        )
      );
  }, [selectedPolyhouse]);

  const handleClose = () => {
    if (param.polyhouseId)
      navigate(
        routePaths.polyhouseDetails.replace(":polyhouseId", param.polyhouseId)
      );
  };
  const handleRedirectToAddLifeCycle = () => {
    if (param.polyhouseId)
      navigate(
        routePaths.addLifeCycle.replace(":polyhouseId", param.polyhouseId)
      );
  };

  const handleRedirect = (lifeCycle: Lifecycle) => {
    const redirectPath =
      lifeCycle.status === "DRAFT"
        ? routePaths.updateLifeCycle
        : routePaths.startLifeCycle;

    navigate(
      redirectPath
        .replace(":lifeCycleId", lifeCycle.workflowInstanceId)
        .replace(":polyhouseId", lifeCycle.polyhouseId)
    );
  };

  useEffect(() => {
    if (!selectedPolyhouse && param.polyhouseId && selectedFarmId)
      dispatch(PolyhouseActions.requestPolyhouse(param.polyhouseId));
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
        {selectedPolyhouse && (
          <Card
            title={getTranslation("polyhouse.polyhouseDetails.lifeCycle")}
            className="shadow-box"
            extra={
              <div
                style={{ display: "flex", alignItems: "center", gap: "10px" }}
              >
                <Button
                  onClick={handleRedirectToAddLifeCycle}
                  label={getTranslation(
                    "polyhouse.polyhouseDetails.lifecycle.addLifeCycle"
                  )}
                  style={{ padding: "0 10px", fontSize: "14px" }}
                />

                <IoClose
                  size={28}
                  data-testid="lifeCycle-close-icon"
                  onClick={handleClose}
                />
              </div>
            }
          >
            {selectedLifeCycles && selectedLifeCycles.length === 0 && (
              <span
                style={{
                  color: "gray",
                  display: "flex",
                  justifyContent: "center",
                }}
              >
                {getTranslation(
                  "polyhouse.polyhouseDetails.lifecycle.noLifeCycle"
                )}
              </span>
            )}
            <div className="grid-container">
              {selectedLifeCycles &&
                selectedLifeCycles.map((lifeCycle: Lifecycle) => (
                  <div key={lifeCycle.id} className="grid-item">
                    <Card
                      title={lifeCycle.name}
                      className="shadow-box cursor_pointer"
                      onClick={() => handleRedirect(lifeCycle)}
                    >
                      <Fields
                        info={[
                          {
                            label: getTranslation(
                              "polyhouse.polyhouseDetails.lifecycle.crop"
                            ),
                            value: (
                              <span>
                                {lifeCycle?.inventory?.product?.name ?? "-"}
                              </span>
                            ),
                          },
                          {
                            label: getTranslation(
                              "polyhouse.polyhouseDetails.lifecycle.quantity"
                            ),
                            value: <span>{lifeCycle?.qty ?? "-"}</span>,
                          },
                          {
                            label: getTranslation(
                              "polyhouse.polyhouseDetails.lifecycle.currentStep"
                            ),
                            value: (
                              <>
                                {lifeCycle?.status === LIFECYCLE_STATUS.DRAFT &&
                                  getTranslation(
                                    "polyhouse.polyhouseDetails.lifecycle.notYetStarted"
                                  )}

                                {(lifeCycle?.status ===
                                  LIFECYCLE_STATUS.RUNNING &&
                                  lifeCycle?.workflowInstanceSteps[
                                    findCurrentStepIndex(
                                      lifeCycle?.workflowInstanceSteps
                                    )
                                  ]?.name) ??
                                  "-"}

                                {lifeCycle?.status ===
                                  LIFECYCLE_STATUS.COMPLETED &&
                                  getTranslation(
                                    "polyhouse.polyhouseDetails.lifecycle.completed"
                                  )}
                              </>
                            ),
                          },
                          {
                            label: getTranslation(
                              "polyhouse.polyhouseDetails.lifecycle.status"
                            ),
                            value: (
                              <LifecycleStatus status={lifeCycle?.status} />
                            ),
                          },
                        ]}
                      />
                    </Card>
                  </div>
                ))}
            </div>
          </Card>
        )}
      </div>
    </ScrollWrapper>
  );
};

export default LifeCycle;
