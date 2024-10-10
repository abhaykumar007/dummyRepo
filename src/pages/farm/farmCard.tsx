import { Spin, Card } from "antd";
import Fields from "@/utilities/fields/field";
import FarmSelectors from "@/redux/farm/farmSelectors";
import FarmActions from "@/redux/farm/action";
import { deviceValue } from "./utilities";
import { getTranslation } from "@/translation/i18n";
import requestingSelector from "@/redux/requesting/requestingSelector";
import { LoadingOutlined } from "@ant-design/icons";
import { Farm } from "./types";
import { makeSelectErrorModel } from "@/redux/error/errorSelector";
import FullAlertError from "@/components/common/error/FullAlertError";
import { useAppDispatch, useAppSelector } from "@/hooks/redux";

const selectError = makeSelectErrorModel();

const FarmCard = () => {
  const dispatch = useAppDispatch();
  const selectedFarm = useAppSelector(FarmSelectors.SelectSelectedFarm);
  const farms = useAppSelector(FarmSelectors.SelectDenormalizeFarm);
  const loading = useAppSelector((state) =>
    requestingSelector(state, [FarmActions.REQUEST_FARMS])
  );

  const error = useAppSelector((state) =>
    selectError(state, FarmActions.REQUEST_FARMS_FINISHED)
  );

  return (
    <div>
      {loading && (
        <span style={{ display: "flex", justifyContent: "center" }}>
          <Spin indicator={<LoadingOutlined spin />} size="large" />
        </span>
      )}

      {error && <FullAlertError error={error} />}

      {!loading && !error && farms.length === 0 && (
        <span
          style={{ color: "gray", display: "flex", justifyContent: "center" }}
        >
          {getTranslation("farm.noFarms")}
        </span>
      )}
      {!loading && farms && (
        <div className="grid-container">
          {farms.map((card: Farm, i: string) => (
            <div key={i} className="grid-item">
              <Card
                title={card?.name}
                bordered={false}
                className={`cursor_pointer shadow-box ${
                  selectedFarm?.farmId === card.farmId && "cardHighlight"
                }`}
                onClick={() => dispatch(FarmActions.setSelectedFarm(card))}
              >
                <div>
                  <Fields
                    info={[
                      {
                        label: `${getTranslation("farm.farmArea")}`,
                        value: (
                          <span style={{ display: "flex", gap: "5px" }}>
                            {card?.area}
                            <div>{getTranslation("global.sqMeter")}</div>
                          </span>
                        ),
                      },
                      {
                        label: `${getTranslation("farm.cultivableArea")}`,
                        value: (
                          <span style={{ display: "flex", gap: "5px" }}>
                            {card?.cultivableArea}
                            <div>{getTranslation("global.sqMeter")}</div>
                          </span>
                        ),
                      },
                      {
                        label: `${getTranslation("farm.deviceStatus")}`,
                        value: (
                          <span style={{ flexWrap: "wrap" }}>
                            {deviceValue(card.device)}
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

export default FarmCard;
