import Card from "@/components/ui/card";
import routePaths from "@/config/routePaths";
import { Zone } from "@/pages/farm/types";
import PolyhouseActions from "@/redux/polyhouse/action";
import PolyhouseSelectors from "@/redux/polyhouse/polyhouseSelectors";
import Fields from "@/utilities/fields/field";
import { IoClose } from "react-icons/io5";
import { useNavigate, useParams } from "react-router-dom";
import AddZone from "./addZone";
import { useEffect } from "react";
import FarmSelectors from "@/redux/farm/farmSelectors";
import requestingSelector from "@/redux/requesting/requestingSelector";
import FarmActions from "@/redux/farm/action";
import { makeSelectErrorModel } from "@/redux/error/errorSelector";
import { LoadingOutlined } from "@ant-design/icons";
import FullAlertError from "@/components/common/error/FullAlertError";
import { Spin } from "antd";
import { getTranslation } from "@/translation/i18n";
import { useAppDispatch, useAppSelector } from "@/hooks/redux";
import ScrollWrapper from "@/components/common/ScrollWrapper";
import { Polyhouse } from "@/pages/polyhouse/types";

const selectError = makeSelectErrorModel();

const Zones = () => {
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

  const handleOnClick = (zone: Zone) => {
    dispatch(PolyhouseActions.setSelectedZone(zone));
    if (zone.zoneId)
      navigate(
        routePaths.zoneDetails
          .replace(":polyhouseId", selectedPolyhouse.polyhouseId)
          .replace(":zoneId", zone.zoneId)
      );
  };

  const handleClose = () => {
    if (param.polyhouseId)
      navigate(
        routePaths.polyhouseDetails.replace(":polyhouseId", param.polyhouseId)
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
            title={getTranslation("polyhouse.polyhouseDetails.zones.zones")}
            className="shadow-box"
            extra={
              <div
                style={{ display: "flex", gap: "10px", alignItems: "center" }}
              >
                <AddZone />
                <IoClose
                  className="close-icon"
                  data-testid="zone-close-icon"
                  onClick={handleClose}
                />
              </div>
            }
          >
            {!loading &&
              !error &&
              selectedPolyhouse &&
              selectedPolyhouse.zones.length === 0 && (
                <span
                  style={{
                    color: "gray",
                    display: "flex",
                    justifyContent: "center",
                  }}
                >
                  {getTranslation("zone.noZones")}
                </span>
              )}
            <div className="grid-container">
              {selectedPolyhouse &&
                selectedPolyhouse.zones.map((zone: Zone) => (
                  <div key={zone.zoneId} className="grid-item">
                    <Card
                      title={zone.name}
                      className="shadow-box cursor_pointer"
                      onClick={() => handleOnClick(zone)}
                    >
                      <Fields
                        info={[
                          {
                            label: getTranslation(
                              "polyhouse.polyhouseDetails.zones.zoneArea"
                            ),
                            value: (
                              <div style={{ display: "flex", gap: "5px" }}>
                                <div>{zone?.area}</div>
                                <div>{getTranslation("global.sqMeter")}</div>
                              </div>
                            ),
                          },
                          {
                            label: getTranslation(
                              "polyhouse.polyhouseDetails.zones.growingArea"
                            ),
                            value: (
                              <div style={{ display: "flex", gap: "5px" }}>
                                <div> {zone?.growingArea?.area}</div>
                                <div>{getTranslation("global.sqMeter")}</div>
                              </div>
                            ),
                          },
                          {
                            label: getTranslation(
                              "polyhouse.polyhouseDetails.zones.systemType"
                            ),
                            value: (
                              <span>
                                <div>{zone?.systemType}</div>
                              </span>
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

export default Zones;
