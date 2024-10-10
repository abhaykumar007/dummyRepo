import React from "react";
import { ForecastItemContainer } from "./styled";
import WeatherIcon from "../currentWeather/weatherIcon";

interface IForecastItemProps {
  day: string;
  weatherCode: number;
  high: number;
  low: number;
  main: string;
}
const ForecastItem: React.FC<IForecastItemProps> = (props) => {
  return (
    <ForecastItemContainer>
      <h6>{props.day}</h6>
      <WeatherIcon code={props.weatherCode} />
      <p>{props.main}</p>
      <span>
        {props.high}
        <sup>&deg;</sup>
        <small>/</small>
        {props.low}
        <sup>&deg;</sup>
      </span>
    </ForecastItemContainer>
  );
};

export default ForecastItem;
