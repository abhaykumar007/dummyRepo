import api from "@/utilities/api";
import {
  delToModel,
  getToModel,
  postToModel,
  putToModel,
} from "@/utilities/effectUtility";
import FarmModel from "./models/farmModel";
import PolyhouseModel from "../polyhouse/models/polyhouseModel";
import CurrentWeatherModel from "./models/currentWeatherModel";
import ThreeHourlyForecastModel from "./models/threeHourForecastModel";
import DailyWeatherForecastModel from "./models/dailyForecastModel";

export default class FarmsEffects {
  static getFarms() {
    return getToModel(FarmModel, api.FARMS);
  }

  static addFarm(payload: FarmModel) {
    return postToModel(FarmModel, api.FARMS, payload);
  }

  static updateFarm(farmId: string, payload: FarmModel) {
    return putToModel(FarmModel, api.FARM.replace(":farmId", farmId), payload);
  }

  static deleteFarm(farmId: string) {
    return delToModel(FarmModel, api.FARM.replace(":farmId", farmId));
  }

  static addPolyhouseToFarm(farmId: string, payload: PolyhouseModel) {
    return postToModel(
      PolyhouseModel,
      api.POLYHOUSES.replace(":farmId", farmId),
      payload
    );
  }

  static getFarmCurrentWeather(farmId: string, type: string) {
    return getToModel(
      CurrentWeatherModel,
      api.FARM_WEATHER.replace(":farmId", farmId),
      { type }
    );
  }

  static getFarmThreeHourlyForecast(farmId: string, type: string) {
    return getToModel(
      ThreeHourlyForecastModel,
      api.FARM_WEATHER.replace(":farmId", farmId),
      { type }
    );
  }

  static getFarmDailyForecast(farmId: string, type: string) {
    return getToModel(
      DailyWeatherForecastModel,
      api.FARM_WEATHER.replace(":farmId", farmId),
      { type }
    );
  }
}
