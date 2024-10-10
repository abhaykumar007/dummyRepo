import Button from "@/components/common/button";
import Card from "@/components/ui/card";
import { getTranslation } from "@/translation/i18n";
import { Collapse, Divider, Flex, Tooltip } from "antd";
import { ReloadOutlined } from "@ant-design/icons";
import CurrentWeather from "./currentWeather/currentWeather";
import Forecast from "./foreCast/forecast";
import { CollapseProps } from "antd/lib";
import "./style.scss";
import { useState } from "react";
import { useAppDispatch, useAppSelector } from "@/hooks/redux";
import FarmActions from "@/redux/farm/action";
import FarmSelectors from "@/redux/farm/farmSelectors";
import requestingSelector from "@/redux/requesting/requestingSelector";

const Weather = () => {
  const dispatch = useAppDispatch();
  const [isForecatOpen, setIsForecastOpen] = useState(false);
  const currentFarm = useAppSelector(FarmSelectors.SelectSelectedFarmId);
  const isCurrentWeatherLoading = useAppSelector((state) =>
    requestingSelector(state, [FarmActions.GET_FARM_CURRENT_WEATHER])
  );
  const items: CollapseProps["items"] = [
    {
      key: "1",
      label: "See weather forecast",
      children: <Forecast isOpen={isForecatOpen} />,
      onClick: () => {
        setIsForecastOpen(!isForecatOpen);
      },
    },
  ];

  const onRefresh = () => {
    dispatch(FarmActions.getCurretFarmWeather(currentFarm));
  };
  return (
    <div>
      <Card
        className="hideCardHeaderDivider"
        bordered={false}
        title={"Weather"}
        style={{ borderRadius: "10px" }}
        extra={
          <Flex gap={20}>
            <Tooltip title={getTranslation("global.refresh")}>
              <Button
                className="refreshButton"
                onClick={onRefresh}
                loading={isCurrentWeatherLoading}
                icon={<ReloadOutlined style={{ color: "green" }} />}
                label={""}
                data-testid="mortalityRate-refresh-button"
                type="default"
              />
            </Tooltip>
          </Flex>
        }
      >
        <CurrentWeather />
        <Divider style={{ margin: "15px 0" }} />
        <Collapse className="weather-collapse" items={items} ghost />
      </Card>
    </div>
  );
};

export default Weather;
