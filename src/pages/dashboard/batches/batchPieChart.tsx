import { ApexOptions } from "apexcharts";
import Chart from "react-apexcharts";
import { StackedType } from "../types";
import { useAppSelector } from "@/hooks/redux";
import DashboardSelectors from "@/redux/dashboard/dashboardSelector";

const BatchePieChart = () => {
  const batchHarvest: StackedType = useAppSelector(
    DashboardSelectors.SelectBatchHarvest
  );

  const categories = batchHarvest.graphData.map((crop) => crop.name);

  const plotData = batchHarvest.graphData.flatMap((crop) => {
    const index = categories.indexOf(crop.name);

    return crop.data.flatMap((lifeCycle) =>
      lifeCycle.batches
        .filter((batch) => batch.harvest !== 0)
        .map((batch) => ({
          name: batch.batchName,
          data: categories.map((_, i) => (i === index ? batch.harvest : 0)),
        }))
    );
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
          const cropData = batchHarvest.graphData.find(
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
        const cropData = batchHarvest.graphData.find(
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
      {batchHarvest && (
        <Chart
          width="100%"
          height={400}
          series={plotData}
          options={chartOptions}
          type="bar"
        />
      )}
    </div>
  );
};

export default BatchePieChart;
