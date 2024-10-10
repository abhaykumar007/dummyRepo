import "./style.scss";
import { Flex, Card } from "antd";
import { ReloadOutlined } from "@ant-design/icons";
import Button from "@/components/common/button";
import { useEffect } from "react";
import FarmSelectors from "@/redux/farm/farmSelectors";
import requestingSelector from "@/redux/requesting/requestingSelector";
import { getTranslation } from "@/translation/i18n";
import Tooltip from "@/components/common/tooltip";
import ReservoirActions from "@/redux/reservoir/action";
import ReservoirCard from "./reservoirCard";
import routePaths from "@/config/routePaths";
import { useNavigate } from "react-router-dom";
import ReservoirSideBar from "./Sidebar";
import { useAppDispatch, useAppSelector } from "@/hooks/redux";
import ScrollWrapper from "@/components/common/ScrollWrapper";

const Reservoirs = () => {
  const navigate = useNavigate();
  const dispatch = useAppDispatch();

  const selectedFarmId = useAppSelector(FarmSelectors.SelectSelectedFarmId);

  useEffect(() => {
    if (selectedFarmId) {
      dispatch(ReservoirActions.fetchReservoir());
    }
  }, [selectedFarmId]);

  const onRefresh = () => {
    dispatch(ReservoirActions.fetchReservoir());
  };

  const loading = useAppSelector((state) =>
    requestingSelector(state, [ReservoirActions.REQUEST_RESERVOIR])
  );

  return (
    <div>
      <ScrollWrapper maxHeight={`${window.innerHeight - 100}px`}>
        <Card
          bordered={false}
          title={getTranslation("global.reservoirs")}
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
                  data-testid="reservoir-refresh-button"
                  type="default"
                />
              </Tooltip>
              <Button
                label={getTranslation("farm.createFarm.addFarm.addReservoir")}
                onClick={() => {
                  navigate(routePaths.reservoirCreate);
                }}
                style={{ padding: "none" }}
                loading={false}
              />
            </Flex>
          }
        >
          <div className="tableFullHeightContainer">
            <div
              style={{
                transition: "all 0.4s",
                width: "100%",
              }}
            >
              <ReservoirCard />
            </div>
            <ReservoirSideBar />
          </div>
        </Card>
      </ScrollWrapper>
    </div>
  );
};

export default Reservoirs;
