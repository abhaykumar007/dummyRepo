import { useAppSelector } from "@/hooks/redux";
import DashboardSelectors from "@/redux/dashboard/dashboardSelector";
import { ApexOptions } from "apexcharts";
import Chart from "react-apexcharts";
import { DonutType } from "../types";
import { Empty } from "antd";
import { taskStatusValueToLabel } from "@/pages/tasks/utils";
import { useNavigate } from "react-router-dom";
import routePaths from "@/config/routePaths";

const TaskPieChart = () => {
  const dashboardTasks: DonutType = useAppSelector(
    DashboardSelectors.SelectDashBoardTasks
  );
  const navigate = useNavigate();

  const chartOptions: ApexOptions = {
    labels: dashboardTasks.graphData.map(
      (task) => taskStatusValueToLabel[task.name]
    ),
    legend: {
      show: true,
      position: "right",
      offsetY: 200,
    },
    fill: {
      type: "gradient",
    },
    chart: {
      events: {
        dataPointSelection: (event, _, config) => {
          const { dataPointIndex } = config;
          const targetElement = event.target as HTMLElement;

          if (targetElement?.classList.contains("apexcharts-pie-area")) {
            const selectedTask = dashboardTasks.graphData[dataPointIndex];

            if (selectedTask) {
              navigate(routePaths.tasks);
            }
          }
        },
      },
    },
  };

  const series =
    dashboardTasks && dashboardTasks.graphData.map((stage) => stage.total);

  const isSeriesAllZero =
    dashboardTasks &&
    series.filter((element) => element === 0).length === series.length;

  return (
    <div data-testid="line-graph">
      {dashboardTasks && !isSeriesAllZero && (
        <Chart
          width="100%"
          height={400}
          type="donut"
          series={dashboardTasks.graphData.map((task) => task.total)}
          options={chartOptions}
        />
      )}
      {isSeriesAllZero && (
        <div
          style={{
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            height: "400px",
          }}
        >
          <Empty />
        </div>
      )}
    </div>
  );
};

export default TaskPieChart;
