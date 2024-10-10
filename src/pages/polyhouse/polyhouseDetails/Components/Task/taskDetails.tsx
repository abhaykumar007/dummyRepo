import Table from "@/components/ui/table";
import columns from "./column";
import Card from "@/components/ui/card";
import { Flex } from "antd";
import { getTranslation } from "@/translation/i18n";
import Button from "@/components/common/button";
import Tooltip from "@/components/common/tooltip";
import { ReloadOutlined } from "@ant-design/icons";
import TaskSelectors from "@/redux/task/selectors";
import { useEffect } from "react";
import TaskActions from "@/redux/task/actions";
import TaskDetailsModal from "@/pages/tasks/taskDetails/taskDetailsModal";
import { useNavigate } from "react-router-dom";
import routePaths from "@/config/routePaths";
import { RootState } from "@/redux/store";
import { useAppDispatch, useAppSelector } from "@/hooks/redux";

const TaskDetails = () => {
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const tasks = useAppSelector((state: RootState) =>
    TaskSelectors.selectFilteredTasksByStatus(state, "all")
  );
  useEffect(() => {
    if (tasks?.length === 0) {
      dispatch(TaskActions.fetchTasks());
    }
  }, []);
  const onRow = (record: any) => {
    return {
      onClick: () => {
        dispatch(TaskActions.selectTask(record));
      },
    };
  };

  const showMore = () => {
    navigate(routePaths.tasks);
  };

  return (
    <div className="task-detail">
      <Card
        className="shadow-box"
        title={<div className="heading1">{getTranslation("global.tasks")}</div>}
        extra={
          <Tooltip title={getTranslation("global.refresh")}>
            <Button
              className="refreshButton"
              loading={false}
              icon={<ReloadOutlined style={{ color: "green" }} />}
              label={""}
              data-testid="refresh-button"
              type="default"
            />
          </Tooltip>
        }
      >
        <Table
          columns={columns}
          dataSource={tasks}
          className="ant-border-space"
          onRow={onRow}
          pagination={false}
          footer={() => (
            <Flex justify="flex-end" style={{ backgroundColor: "#fff" }}>
              <Button
                style={{ width: "30%" }}
                type="link"
                label="Show more"
                onClick={showMore}
              />
            </Flex>
          )}
        />
        <TaskDetailsModal />
      </Card>
    </div>
  );
};

export default TaskDetails;
