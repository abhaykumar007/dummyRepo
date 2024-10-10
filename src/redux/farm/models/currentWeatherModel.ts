import { BaseModel } from "sjs-base-model";
class MainModel extends BaseModel {
    temp = null;
    feels_like = null;
    temp_min = null;
    temp_max = null;
    pressure = null;
    sea_level = null;
    grnd_level = null;
    humidity = null;
    temp_kf = null;
  
    constructor(data: Partial<MainModel>) {
      super();
      this.update(data);
    }
  }
  
  class WeatherModel extends BaseModel {
    id = null;
    main = null;
    description = null;
    icon = null;
  
    constructor(data: Partial<WeatherModel>) {
      super();
      this.update(data);
    }
  }
  
  class CloudsModel extends BaseModel {
    all = null;
  
    constructor(data: Partial<CloudsModel>) {
      super();
      this.update(data);
    }
  }
  
  class WindModel extends BaseModel {
    speed = null;
    deg = null;
    gust = null;
  
    constructor(data: Partial<WindModel>) {
      super();
      this.update(data);
    }
  }
  
  class SysModel extends BaseModel {
    pod = null;
  
    constructor(data: Partial<SysModel>) {
      super();
      this.update(data);
    }
  }
  
  class RainModel extends BaseModel {
    '3h' = null;
  
    constructor(data: Partial<RainModel>) {
      super();
      this.update(data);
    }
  }

  class coordModel extends BaseModel {
    lat = null;
    lon = null;
  
    constructor(data: Partial<coordModel>) {
      super();
      this.update(data);
    }
  }
  
  class CurrentWeatherModel extends BaseModel {
    coord: coordModel = new coordModel({});
    dt = null;
    main: MainModel = new MainModel({});
    weather: WeatherModel[] = [];
    clouds: CloudsModel = new CloudsModel({});
    wind: WindModel = new WindModel({});
    visibility = null;
    pop = null;
    sys: SysModel = new SysModel({});
    dt_txt = null;
    rain: RainModel = new RainModel({});
    name = null;
    timezone = null;
    id = null;
    cod = null;
    constructor(data: Partial<CurrentWeatherModel>) {
      super();
      this.update(data);
      this.main = new MainModel(data.main || {});
      this.weather = (data.weather || []).map(item => new WeatherModel(item));
      this.clouds = new CloudsModel(data.clouds || {});
      this.wind = new WindModel(data.wind || {});
      this.sys = new SysModel(data.sys || {});
      this.rain = new RainModel(data.rain || {});
    }
  }
  
export default CurrentWeatherModel;