import { useAppSelector } from "@/hooks/redux";
import DashboardSelectors from "@/redux/dashboard/dashboardSelector";
import { ApexOptions } from "apexcharts";
import Chart from "react-apexcharts";
import { StackedType } from "../types";

const StackedBarGraph = () => {
  const harvestedBreakup: StackedType = useAppSelector(
    DashboardSelectors.SelectHarvestedBreakup
  );

  const categories = harvestedBreakup.graphData.map((crop) => crop.name);
  const plotData = harvestedBreakup.graphData.flatMap((crop) => {
    const index = categories.indexOf(crop.name);
    return crop.data
      .filter((lifeCycle) => lifeCycle.harvest !== 0)
      .map((lifeCycle) => {
        return {
          name: lifeCycle.name,
          data: categories.map((_, i) => (i === index ? lifeCycle.harvest : 0)),
        };
      });
  });

  const chartOptions: ApexOptions = {
    chart: {
      type: "bar",
      height: 350,
      stacked: true,
      zoom: {
        enabled: false,
      },
      toolbar: {
        show: false,
      },
    },
    plotOptions: {
      bar: {
        horizontal: true,
        dataLabels: {
          total: {
            enabled: true,
            offsetX: 0,
            // offsetY: -6,
            style: {
              fontSize: "12px",
              fontWeight: 700,
            },
          },
        },
      },
    },
    stroke: {
      width: 1,
      colors: ["#fff"],
    },
    xaxis: {
      categories: categories,
    },
    yaxis: {
      title: {
        text: undefined,
      },
    },
    tooltip: {
      y: {
        formatter: function (val, opts) {
          const categoryName = categories[opts.dataPointIndex];
          const cropData = harvestedBreakup.graphData.find(
            (crop) => crop.name === categoryName
          );
          const unit = cropData ? cropData.unit : "";
          return val + unit;
        },
      },
    },
    fill: {
      opacity: 1,
    },
    dataLabels: {
      enabled: true,
      formatter: function (val, opts) {
        const categoryIndex = opts.dataPointIndex;
        const categoryName = categories[categoryIndex];
        const cropData = harvestedBreakup.graphData.find(
          (crop) => crop.name === categoryName
        );
        const unit = cropData ? cropData.unit : "";
        return `${val} ${unit}`;
      },
    },
    legend: {
      show: false,
    },
  };

  return (
    <div data-testid="line-graph">
      {harvestedBreakup && (
        <Chart
          width="100%"
          height={400}
          series={plotData}
          type="bar"
          options={chartOptions}
        />
      )}
    </div>
  );
};

export default StackedBarGraph;
