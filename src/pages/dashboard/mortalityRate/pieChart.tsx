import { useAppSelector } from "@/hooks/redux";
import DashboardSelectors from "@/redux/dashboard/dashboardSelector";
import { ApexOptions } from "apexcharts";
import Chart from "react-apexcharts";
import { DonutType } from "../types";
import { Empty } from "antd";

const PieChart = () => {
  const mortalityRate: DonutType = useAppSelector(
    DashboardSelectors.SelectMortalityRate
  );

  const chartOptions: ApexOptions = {
    labels: mortalityRate.graphData.map((stage) => stage.name),
    legend: {
      show: true,
      position: "right",
      offsetY: 200,
    },
    fill: {
      type: "gradient",
    },
  };

  const series =
    mortalityRate && mortalityRate.graphData.map((stage) => stage.total);

  const isSeriesAllZero =
    mortalityRate &&
    series.filter((element) => element === 0).length === series.length;

  return (
    <div data-testid="line-graph">
      {mortalityRate && !isSeriesAllZero && (
        <Chart
          width="100%"
          height={400}
          type="donut"
          series={series}
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

export default PieChart;
