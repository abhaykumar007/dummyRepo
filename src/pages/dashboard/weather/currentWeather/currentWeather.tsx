import { getTranslation } from "@/translation/i18n";
import { Col, Flex, Row } from "antd";
import React, { useEffect } from "react";
import WeatherIcon from "./weatherIcon";
import { FaLongArrowAltUp, FaLongArrowAltDown } from "react-icons/fa";
import { WiCloudyWindy } from "react-icons/wi";
import { MdCompress } from "react-icons/md";
import { FaDroplet } from "react-icons/fa6";
import {
  CurrentWeatherInfo,
  FeelsLike,
  HighLowContainer,
  InfoRow,
  WeatherDegree,
} from "./styled";
import { useAppDispatch, useAppSelector } from "@/hooks/redux";
import FarmActions from "@/redux/farm/action";
import FarmSelectors from "@/redux/farm/farmSelectors";
import { roundToOneDecimal } from "@/utilities/maths";
import requestingSelector from "@/redux/requesting/requestingSelector";
import { makeSelectErrorModel } from "@/redux/error/errorSelector";
import AlertError from "@/components/common/error/AlertError";
import { LoadingOutlined } from "@ant-design/icons";
import TemperatureGraph from "./temperatureGraph";

const selectError = makeSelectErrorModel();
const CurrentWeather: React.FC = () => {
  const dispatch = useAppDispatch();
  const selectedFarmId = useAppSelector(FarmSelectors.SelectSelectedFarmId);
  const selectedFarm = useAppSelector((state) =>
    FarmSelectors.SelectFarmByFarmId(state, selectedFarmId)
  );
  const currentWeather = useAppSelector(
    FarmSelectors.SelectSelectedFarmCurrentWeather
  );
  const foreCast = useAppSelector(
    FarmSelectors.SelectSelectedThreeHourlyForecast
  );
  const data: number[] = [];
  const categories: string[] = [];
  foreCast?.list?.forEach((ele: any) => {
    data.push(ele.main.temp);
    categories.push(ele.dt_txt);
  });
  const loading = useAppSelector((state) =>
    requestingSelector(state, [FarmActions.GET_FARM_CURRENT_WEATHER])
  );
  const error = useAppSelector((state) =>
    selectError(state, [FarmActions.GET_FARM_CURRENT_WEATHER_FINISHED])
  );
  const { main, wind } = currentWeather || {};
  useEffect(() => {
    if (selectedFarmId) {
      dispatch(FarmActions.getCurretFarmWeather(selectedFarmId));
      dispatch(FarmActions.getFarmThreeHourlyForecast(selectedFarmId));
    }
  }, [selectedFarmId]);

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

  if (!currentWeather) {
    return null;
  }

  return (
    <div>
      <div style={{ fontWeight: "500", fontSize: "1.125rem", color: "grey" }}>
        {getTranslation("farm.weather.currentWeather")}
      </div>
      <Row>
        <Col
          xs={24}
          sm={8}
          style={{ padding: "10px 0px 0px 20px", height: "100%" }}
        >
          <div
            style={{
              fontWeight: "700",
              fontSize: "1.125rem",
              color: "#396bae",
            }}
          >
            {selectedFarm?.location?.address || "Pune"}
          </div>
          <div style={{ height: "90%" }}>
            <Flex gap={20} style={{ overflow: "wrap" }}>
              <div>
                <WeatherIcon code={currentWeather?.cod} />
              </div>
              <div>
                <div style={{ fontSize: "280%", color: "#396bae" }}>
                  {roundToOneDecimal(main?.temp)}°C
                </div>
              </div>
            </Flex>
            <div
              style={{
                fontWeight: "700",
                fontSize: "1.125rem",
                color: "#396bae",
              }}
            >
              {currentWeather?.weather[0].description}
            </div>
          </div>
        </Col>
        <Col xs={24} sm={6}>
          <CurrentWeatherInfo>
            <FeelsLike>
              {getTranslation("farm.weather.feelsLike")} {main?.feels_like}
              <sup>&deg;</sup> C
            </FeelsLike>
            <HighLowContainer>
              <WeatherDegree>
                <FaLongArrowAltUp />
                {main?.temp_max}
                <sup>&deg;</sup>C
              </WeatherDegree>
              <WeatherDegree>
                <FaLongArrowAltDown />
                {main?.temp_min}C<sup>&deg;</sup>
              </WeatherDegree>
            </HighLowContainer>
            <InfoRow>
              <div>
                <FaDroplet />
                {getTranslation("farm.weather.humidity")}
              </div>
              <span>{main?.humidity}%</span>
            </InfoRow>
            <InfoRow>
              <div>
                <WiCloudyWindy />
                {getTranslation("farm.weather.wind")}
              </div>
              <span>{`${wind?.speed} kph`}</span>
            </InfoRow>
            <InfoRow>
              <div>
                <MdCompress />
                {getTranslation("farm.weather.rain")}
              </div>
              <span>{`${main?.pressure} hPa`}</span>
            </InfoRow>
          </CurrentWeatherInfo>
        </Col>

        <Col xs={24} sm={10}>
          <TemperatureGraph data={data} categories={categories} />
        </Col>
      </Row>
    </div>
  );
};

export default CurrentWeather;
