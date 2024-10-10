import FarmCard from "./farmCard";
import "./style.scss";
import { Flex, Card } from "antd";
import { ReloadOutlined } from "@ant-design/icons";
import Button from "@/components/common/button";
import { useNavigate } from "react-router-dom";
import routePaths from "@/config/routePaths";
import { useEffect } from "react";
import FarmActions from "@/redux/farm/action";
import FarmSideBar from "./SideBar";
import requestingSelector from "@/redux/requesting/requestingSelector";
import { getTranslation } from "@/translation/i18n";
import Tooltip from "@/components/common/tooltip";
import { makeSelectErrorModel } from "@/redux/error/errorSelector";
import { useAppDispatch, useAppSelector } from "@/hooks/redux";
import ScrollWrapper from "@/components/common/ScrollWrapper";

const selectError = makeSelectErrorModel();

const Farm = () => {
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const error = useAppSelector((state) =>
    selectError(state, FarmActions.REQUEST_FARMS_FINISHED)
  );

  useEffect(() => {
    if (!error) dispatch(FarmActions.fetchFarms());
  }, []);

  const onRefresh = () => {
    dispatch(FarmActions.fetchFarms(true));
    dispatch(FarmActions.setSelectedFarm(null));
  };
  const loading = useAppSelector((state) =>
    requestingSelector(state, [FarmActions.REQUEST_FARMS])
  );

  return (
    <div className="farm">
      <ScrollWrapper maxHeight={`${window.innerHeight - 100}px`}>
        <Card
          bordered={false}
          title={getTranslation("global.farm")}
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
                  data-testid="refresh-button"
                  type="default"
                />
              </Tooltip>
              <Button
                label={getTranslation("farm.addFarm")}
                onClick={() => {
                  navigate(routePaths.farmCreate);
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
              <FarmCard />
            </div>

            <FarmSideBar />
          </div>
        </Card>
      </ScrollWrapper>
    </div>
  );
};

export default Farm;
