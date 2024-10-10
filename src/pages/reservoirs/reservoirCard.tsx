import { Spin, Card } from "antd";
import Fields from "@/utilities/fields/field";
import { getTranslation } from "@/translation/i18n";
import requestingSelector from "@/redux/requesting/requestingSelector";
import { LoadingOutlined } from "@ant-design/icons";
import { makeSelectErrorModel } from "@/redux/error/errorSelector";
import FullAlertError from "@/components/common/error/FullAlertError";
import ReservoirActions from "@/redux/reservoir/action";
import ReservoirSelectors from "@/redux/reservoir/reservoirSelectors";
import { Reservoir } from "./types";
import { useAppDispatch, useAppSelector } from "@/hooks/redux";

const selectError = makeSelectErrorModel();

const ReservoirCard = () => {
  const dispatch = useAppDispatch();
  const selectedReservoir = useAppSelector(
    ReservoirSelectors.SelectSelectedReservoir
  );
  const reservoirs = useAppSelector(
    ReservoirSelectors.SelectDenormalizeReservoir
  );

  const loading = useAppSelector((state) =>
    requestingSelector(state, [ReservoirActions.REQUEST_RESERVOIR])
  );

  const error = useAppSelector((state) =>
    selectError(state, ReservoirActions.REQUEST_RESERVOIR_FINISHED)
  );

  return (
    <div>
      {loading && (
        <span style={{ display: "flex", justifyContent: "center" }}>
          <Spin indicator={<LoadingOutlined spin />} size="large" />
        </span>
      )}

      {error && <FullAlertError error={error} />}

      {!loading && !error && reservoirs.length === 0 && (
        <span
          style={{ color: "gray", display: "flex", justifyContent: "center" }}
        >
          {getTranslation("reservoir.noReservoir")}
        </span>
      )}
      {!loading && reservoirs && (
        <div className="grid-container">
          {reservoirs.map((card: Reservoir, i: string) => (
            <div key={i} className="grid-item">
              <Card
                title={card?.name}
                bordered={false}
                className={`cursor_pointer shadow-box ${
                  selectedReservoir?.reservoirId === card.reservoirId &&
                  "cardHighlight"
                }`}
                onClick={() =>
                  dispatch(ReservoirActions.setSelectedReservoir(card))
                }
              >
                <div>
                  <Fields
                    info={[
                      {
                        label: `${getTranslation(
                          "reservoir.reservoirCapacity"
                        )}`,
                        value: (
                          <span style={{ display: "flex", gap: "5px" }}>
                            {card?.reservoirCapacity}
                            <div>{getTranslation("global.litre")}</div>
                          </span>
                        ),
                      },
                      {
                        label: `${getTranslation(
                          "reservoir.nutrientWaterReservoirCapacity"
                        )}`,
                        value: (
                          <span style={{ display: "flex", gap: "5px" }}>
                            {card?.nutrientWaterReservoirCapacity}
                            <div>{getTranslation("global.litre")}</div>
                          </span>
                        ),
                      },
                    ]}
                  />
                </div>
              </Card>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default ReservoirCard;
