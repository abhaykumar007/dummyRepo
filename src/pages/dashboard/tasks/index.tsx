import Card from "@/components/ui/card";
import { useAppDispatch, useAppSelector } from "@/hooks/redux";
import DashboardActions from "@/redux/dashboard/action";
import FarmSelectors from "@/redux/farm/farmSelectors";
import { Flex, Spin } from "antd";
import Tooltip from "@/components/common/tooltip";
import { getTranslation } from "@/translation/i18n";
import Button from "@/components/common/button";
import requestingSelector from "@/redux/requesting/requestingSelector";
import { ReloadOutlined, LoadingOutlined } from "@ant-design/icons";
import TaskPieChart from "./taskPieChart";
import DashboardSelectors from "@/redux/dashboard/dashboardSelector";
import { makeSelectErrorModel } from "@/redux/error/errorSelector";
import FullAlertError from "@/components/common/error/FullAlertError";

const selectError = makeSelectErrorModel();

const TasksGraph = () => {
  const dispatch = useAppDispatch();
  const selectedFarmId = useAppSelector(FarmSelectors.SelectSelectedFarmId);

  const dashboardTasks = useAppSelector(
    DashboardSelectors.SelectDashBoardTasks
  );

  const onRefresh = () => {
    dispatch(DashboardActions.requestDashboardTasks(selectedFarmId));
  };

  const loading = useAppSelector((state) =>
    requestingSelector(state, [DashboardActions.REQUEST_DASHBOARD_TASKS])
  );

  const error = useAppSelector((state) =>
    selectError(state, DashboardActions.REQUEST_DASHBOARD_TASKS_FINISHED)
  );

  return (
    <div>
      <Card
        className="hideCardHeaderDivider cardHeight"
        bordered={false}
        title={getTranslation("global.tasks")}
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
                data-testid="mortalityRate-refresh-button"
                type="default"
              />
            </Tooltip>
          </Flex>
        }
      >
        {loading && (
          <span style={{ display: "flex", justifyContent: "center" }}>
            <Spin indicator={<LoadingOutlined spin />} size="large" />
          </span>
        )}

        {error && !loading && <FullAlertError error={error} />}

        {!loading && dashboardTasks && <TaskPieChart />}
      </Card>
    </div>
  );
};

export default TasksGraph;
