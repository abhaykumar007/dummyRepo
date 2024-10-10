import React, { useEffect } from "react";
import ForecastItem from "./forecastItem";
import { ForecastItems, SectionTitle } from "./styled";
import { useAppDispatch, useAppSelector } from "@/hooks/redux";
import FarmActions from "@/redux/farm/action";
import FarmSelectors from "@/redux/farm/farmSelectors";
import requestingSelector from "@/redux/requesting/requestingSelector";
import { makeSelectErrorModel } from "@/redux/error/errorSelector";
import AlertError from "@/components/common/error/AlertError";
import { LoadingOutlined } from "@ant-design/icons";
import { roundToOneDecimal } from "@/utilities/maths";
import { Flex } from "antd";
import { getTranslation } from "@/translation/i18n";
import { DailyWeather } from "../../types";
import { getDayFromTimeStamp } from "@/utilities/time";


interface ForecastProps {
  isOpen: boolean;
}

const selectError = makeSelectErrorModel();
const Forecast: React.FC<ForecastProps> = ({ isOpen }: ForecastProps) => {
  const dispatch = useAppDispatch();
  const currentFarm = useAppSelector(FarmSelectors.SelectSelectedFarmId);
  const forecast = useAppSelector(
    FarmSelectors.SelectSelectedDailyForecast
  );
  const loading = useAppSelector((state) =>
    requestingSelector(state, [FarmActions.GET_FARM_DAILY_FORECAST])
  );
  const error = useAppSelector((state) =>
    selectError(state, [FarmActions.GET_FARM_DAILY_FORECAST_FINISHED])
  );
  useEffect(() => {
    if (isOpen && currentFarm)
       dispatch(FarmActions.getFarmDailyForecast(currentFarm));
  }, [isOpen]);
  if (loading)
    return (
      <Flex justify="center" style={{ width: "100%" }}>
        <LoadingOutlined data-testid="loader" style={{ fontSize: 24 }} spin />
      </Flex>
    );
  if (error)
    return (
      <div>
        <AlertError error={error} />
      </div>
    );
  return (
    <>
      <SectionTitle>
        {getTranslation("farm.weather.extentedForecast")}
      </SectionTitle>
      <ForecastItems>
        {forecast?.daily.map((weather: DailyWeather, i: number) => {
          return (
            <ForecastItem
              key={i}
              day={getDayFromTimeStamp(weather.dt)}
              high={roundToOneDecimal(weather.temp.max)}
              low={roundToOneDecimal(weather.temp.min)}
              weatherCode={weather.weather[0].id}
              main={weather.weather[0].main}
            />
          );
        })}
      </ForecastItems>
    </>
  );
};

export default Forecast;
