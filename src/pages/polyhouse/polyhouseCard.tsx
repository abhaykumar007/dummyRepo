import { Card, Spin } from "antd";
import Fields from "@/utilities/fields/field";
import { LoadingOutlined } from "@ant-design/icons";
import PolyhouseSelectors from "@/redux/polyhouse/polyhouseSelectors";
import requestingSelector from "@/redux/requesting/requestingSelector";
import PolyhouseActions from "@/redux/polyhouse/action";
import { makeSelectErrorModel } from "@/redux/error/errorSelector";
import FullAlertError from "@/components/common/error/FullAlertError";
import FarmActions from "@/redux/farm/action";
import { useNavigate } from "react-router-dom";
import routePaths from "@/config/routePaths";
import { Polyhouse } from "./types";
import { getTranslation } from "@/translation/i18n";
import { useEffect } from "react";
import { useAppDispatch, useAppSelector } from "@/hooks/redux";

const selectError = makeSelectErrorModel();

const PolyhouseCard = () => {
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const polyhouses = useAppSelector(
    PolyhouseSelectors.SelectDenormalizePolyhouse
  );

  const loading = useAppSelector((state) =>
    requestingSelector(state, [
      PolyhouseActions.REQUEST_POLYHOUSES,
      FarmActions.REQUEST_FARMS,
    ])
  );

  const error = useAppSelector((state) =>
    selectError(state, PolyhouseActions.REQUEST_POLYHOUSES_FINISHED)
  );

  const handleOnClick = (polyhouse: Polyhouse) => {
    dispatch(PolyhouseActions.requestBatchCount(polyhouse.polyhouseId));
    dispatch(PolyhouseActions.setSelectedPolyhouse(polyhouse));
    navigate(
      routePaths.polyhouseDetails.replace(":polyhouseId", polyhouse.polyhouseId)
    );
  };

  useEffect(() => {
    dispatch(PolyhouseActions.setSelectedPolyhouse(null));
  }, []);

  return (
    <div>
      {loading && (
        <span style={{ display: "flex", justifyContent: "center" }}>
          <Spin indicator={<LoadingOutlined spin />} size="large" />
        </span>
      )}

      {error && <FullAlertError error={error} />}

      {!loading && !error && polyhouses.length === 0 && (
        <span
          style={{ color: "gray", display: "flex", justifyContent: "center" }}
        >
          {getTranslation("polyhouse.noPolyhouse")}
        </span>
      )}

      <div className="grid-container">
        {!loading &&
          polyhouses.map((polyhouse: Polyhouse, i: number) => (
            <div key={i} className="grid-item">
              <Card
                title={polyhouse?.name}
                bordered={false}
                className="cursor_pointer shadow-box"
                onClick={() => handleOnClick(polyhouse)}
              >
                <div>
                  <Fields
                    info={[
                      {
                        label: getTranslation(
                          "polyhouse.structureExpectedLife"
                        ),

                        value: (
                          <div style={{ display: "flex", gap: "5px" }}>
                            <div>{polyhouse?.structureExpectedLife}</div>
                            <div>{getTranslation("global.year")}</div>
                          </div>
                        ),
                      },
                      {
                        label: getTranslation("polyhouse.plasticExpectedLife"),
                        value: (
                          <span style={{ display: "flex", gap: "5px" }}>
                            <div>{polyhouse?.plasticExpectedLife}</div>
                            <div>{getTranslation("global.year")}</div>
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
    </div>
  );
};

export default PolyhouseCard;
