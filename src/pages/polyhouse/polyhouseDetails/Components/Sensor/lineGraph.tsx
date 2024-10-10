import theme from "@/theme";
import moment from "moment";
import React from "react";
import Chart from "react-apexcharts";
import { ApexOptions } from "apexcharts";

interface LineGraphProps {
  labels: string[];
  values: number[];
}

const LineGraph: React.FC<LineGraphProps> = ({ labels, values }) => {
  const timestamps = labels.map((label) =>
    moment(label, "DD-MM-YYYY HH:mm:ss").format("YYYY-MM-DDTHH:mm:ss")
  );

  const chartOptions: ApexOptions = {
    chart: {
      type: "line",
      dropShadow: {
        enabled: true,
        color: "#000",
        top: 18,
        left: 7,
        blur: 10,
        opacity: 0.2,
      },
      zoom: {
        enabled: false,
      },
      toolbar: {
        show: false,
      },
    },
    dataLabels: {
      enabled: false,
    },
    stroke: {
      curve: "straight",
      colors: [theme.token.colorPrimary],
    },
    grid: {
      borderColor: "#e7e7e7",
      row: {
        colors: ["#f3f3f3", "transparent"],
        opacity: 0.3,
      },
    },

    colors: [theme.token.colorPrimary],

    xaxis: {
      type: "datetime",
      categories: timestamps,
      labels: {
        datetimeFormatter: {
          year: "yyyy",
          month: "MMM 'yy",
          day: "dd MMM",
          hour: "HH:mm",
        },
        formatter: (value: string) => moment(value).format("DD-MM HH:mm"),
      },
    },

    tooltip: {
      x: {
        formatter: (value: number) =>
          moment(value).format("DD-MM-YYYY HH:mm:ss"),
      },
    },
  };

  const chartSeries = [
    {
      name: "value",
      data: values,
    },
  ];

  return (
    <div data-testid="line-graph">
      <Chart
        options={chartOptions}
        series={chartSeries}
        type="line"
        width="100%"
        height={500}
        data-testid="chart"
      />
    </div>
  );
};

export default LineGraph;
