import { BaseModel } from "sjs-base-model";
import CurrentWeatherModel from "./currentWeatherModel";

class CityModel extends BaseModel {
    id = null;
    name = null;
    coord = { lat: null, lon: null };
    country = null;
    population = null;
    timezone = null;
    sunrise = null;
    sunset = null;
  
    constructor(data: Partial<CityModel>) {
      super();
      this.update(data);
    }
  }

class ThreeHourlyForecastModel extends BaseModel {
  cod = null;
  message = null;
  cnt = null;
  list: CurrentWeatherModel[] = [];
  city: CityModel = new CityModel({});

  constructor(data: Partial<ThreeHourlyForecastModel>) {
    super();
    this.update(data);
    this.list = (data.list || []).map(item => new CurrentWeatherModel(item));
    this.city = new CityModel(data.city || {});
  }
}

export default ThreeHourlyForecastModel;
