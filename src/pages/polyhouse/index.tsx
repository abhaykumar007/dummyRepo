import { useEffect } from "react";
import Button from "@/components/common/button";
import Card from "@/components/ui/card";
import { ReloadOutlined } from "@ant-design/icons";
import { getTranslation } from "@/translation/i18n";
import { Flex, Tooltip } from "antd";
import PolyhouseCard from "./polyhouseCard";
import "./style.scss";
import PolyhouseActions from "@/redux/polyhouse/action";
import FarmSelectors from "@/redux/farm/farmSelectors";
import requestingSelector from "@/redux/requesting/requestingSelector";
import routePaths from "@/config/routePaths";
import { useNavigate } from "react-router-dom";
import { useAppDispatch, useAppSelector } from "@/hooks/redux";
import ScrollWrapper from "@/components/common/ScrollWrapper";
import PolyhouseSelectors from "@/redux/polyhouse/polyhouseSelectors";
import { Polyhouse as PolyhouseType } from "./types";

const Polyhouse = () => {
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const selectedFarmId = useAppSelector(FarmSelectors.SelectSelectedFarmId);
  const selectedFarm = useAppSelector((state) =>
    FarmSelectors.SelectFarmByFarmId(state, selectedFarmId || "")
  );

  const polyhouses = useAppSelector(
    PolyhouseSelectors.SelectDenormalizePolyhouse
  );

  const onRefresh = () => {
    dispatch(PolyhouseActions.fetchPolyhouses(true));
  };
  useEffect(() => {
    if (selectedFarmId) {
      if (polyhouses.length === 0) onRefresh();
      else {
        const isPolyhousesAreOfSameFarmId =
          polyhouses &&
          selectedFarm.polyhouses.find(
            (polyhouse: PolyhouseType) =>
              polyhouse.polyhouseId === polyhouses[0].polyhouseId
          );
        if (!isPolyhousesAreOfSameFarmId) onRefresh();
      }
    }
  }, [selectedFarmId]);

  const loading = useAppSelector((state) =>
    requestingSelector(state, [PolyhouseActions.REQUEST_POLYHOUSES])
  );

  return (
    <div className="farm">
      <ScrollWrapper maxHeight={`${window.innerHeight - 100}px`}>
        <Card
          bordered={false}
          title={getTranslation("global.polyhouses")}
          style={{ borderRadius: "10px" }}
          extra={
            <Flex gap={20}>
              <Tooltip title={getTranslation("global.refresh")}>
                <Button
                  className="refreshButton"
                  onClick={onRefresh}
                  loading={loading}
                  icon={<ReloadOutlined style={{ color: "green" }} />}
                  label={""}
                  data-testid="polyhouse-refresh-button"
                  type="default"
                />
              </Tooltip>
              <Button
                label={getTranslation("polyhouse.addPolyhouse")}
                onClick={() => {
                  navigate(routePaths.polyhouseCreate);
                }}
                style={{ padding: "none" }}
                loading={false}
              />
            </Flex>
          }
        >
          <div className="tableFullHeightContainer">
            <div style={{ width: "100%" }}>
              <PolyhouseCard />
            </div>
          </div>
        </Card>
      </ScrollWrapper>
    </div>
  );
};

export default Polyhouse;
