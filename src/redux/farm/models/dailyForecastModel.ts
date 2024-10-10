import { BaseModel } from "sjs-base-model";

export class WeatherModel extends BaseModel {
    id = null;
    main = null;
    description = null;
    icon = null;
  
    constructor(data: Partial<WeatherModel>) {
      super();
      this.update(data);
    }
  }
  
  export class TemperatureModel extends BaseModel {
    day = null;
    min = null;
    max = null;
    night = null;
    eve = null;
    morn = null;
  
    constructor(data: Partial<TemperatureModel>) {
      super();
      this.update(data);
    }
  }
  
  export class FeelsLikeModel extends BaseModel {
    day = null;
    night = null;
    eve = null;
    morn = null;
  
    constructor(data: Partial<FeelsLikeModel>) {
      super();
      this.update(data);
    }
  }

  export class DailyWeatherModel extends BaseModel {
    dt = null;
    sunrise = null;
    sunset = null;
    moonrise = null;
    moonset = null;
    moon_phase = null;
    summary = null;
    temp: TemperatureModel = new TemperatureModel({});
    feels_like: FeelsLikeModel = new FeelsLikeModel({});
    pressure = null;
    humidity = null;
    dew_point = null;
    wind_speed = null;
    wind_deg = null;
    wind_gust = null;
    weather: WeatherModel[] = [];
    clouds = null;
    pop = null;
    uvi = null;
    rain = null;
  
    constructor(data: Partial<DailyWeatherModel>) {
      super();
      this.update(data);
    }
  }
class DailyWeatherForecastModel extends BaseModel {
  
    lat = null;
    lon = null;
    timezone = null;
    timezone_offset = null;
    daily: DailyWeatherModel[] = [];
  
    constructor(data: Partial<DailyWeatherForecastModel>) {
      super();
      this.update(data);
    }
}


export default DailyWeatherForecastModel;