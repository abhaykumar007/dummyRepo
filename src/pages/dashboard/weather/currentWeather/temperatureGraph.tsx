/* eslint-disable @typescript-eslint/no-explicit-any */

import Chart from "react-apexcharts";

interface TemperatureGraphProps {
  data: number[];
  categories: string[];
}
const TemperatureGraph = ({ data, categories }: TemperatureGraphProps) => {
  return (
    <div data-testid="line-graph">
      {data && (
        <Chart
          width="100%"
          height={250}
          type="area"
          series={[
            {
              name: "Temperature",
              data: data,
            },
          ]}
          options={{
            title: {
              text: "Temperature in °C",
              align: "left",
              style: {
                fontWeight: "500",
                fontSize: "16px",
                color: "grey",
              },
            },
            chart: {
              height: 350,
              type: "area",
              toolbar: {
                show: false,
              },
            },
            dataLabels: {
              enabled: false,
            },
            stroke: {
              curve: "smooth",
            },
            xaxis: {
              categories: categories,
              labels: {
                formatter: function (value: any) {
                  return new Date(value).toLocaleTimeString("en-US", {
                    hour: "2-digit",
                    minute: "2-digit",
                  });
                },
              },
            },
            tooltip: {
              x: {
                format: "dd/MM/yy HH:mm",
              },
            },
            grid: {
              show: false,
            },
            yaxis: {
              show: false,
            },
          }}
        />
      )}
    </div>
  );
};

export default TemperatureGraph;
