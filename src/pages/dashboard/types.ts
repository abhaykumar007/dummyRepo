export interface MortalityRate {
  name: string;
  percent: number;
}


export interface Coord {
  lon: number;
  lat: number;
}

export interface WeatherDescription {
  id: number;
  main: string;
  description: string;
  icon: string;
}

export interface MainWeather {
  temp: number;
  feels_like: number;
  temp_min: number;
  temp_max: number;
  pressure: number;
  humidity: number;
  sea_level: number;
  grnd_level: number;
}

export interface Wind {
  speed: number;
  deg: number;
  gust: number;
}

export interface Clouds {
  all: number;
}

export interface Sys {
  type: number;
  id: number;
  country: string;
  sunrise: number;
  sunset: number;
}

export interface CurrentWeather {
  coord: Coord;
  weather: WeatherDescription[];
  base: string;
  main: MainWeather;
  visibility: number;
  wind: Wind;
  clouds: Clouds;
  dt: number;
  sys: Sys;
  timezone: number;
  id: number;
  name: string;
  cod: number;
}

export interface Options {
  lat: number;
  lon: number;
  units?: string;
}

export interface City {
  id: number;
  name: string;
  coord: Coord;
  country: string;
  population: number;
  timezone: number;
  sunrise: number;
  sunset: number;
}

export interface ThreeHourlyForecast {
  cod: string;
  message: number;
  cnt: number;
  list: CurrentWeather[];
  city: City;
}

export interface Weather {
  id: number;
  main: string;
  description: string;
  icon: string;
}

export interface Temperature {
  day: number;
  min: number;
  max: number;
  night: number;
  eve: number;
  morn: number;
}

export interface FeelsLike {
  day: number;
  night: number;
  eve: number;
  morn: number;
}

export interface DailyWeather {
  dt: number;
  sunrise: number;
  sunset: number;
  moonrise: number;
  moonset: number;
  moon_phase: number;
  summary: string;
  temp: Temperature;
  feels_like: FeelsLike;
  pressure: number;
  humidity: number;
  dew_point: number;
  wind_speed: number;
  wind_deg: number;
  wind_gust: number;
  weather: Weather[];
  clouds: number;
  pop: number;
  uvi: number;
  rain?: number; // optional because not all days have rain
}

export interface DailyWeatherForecast {
  lat: number;
  lon: number;
  timezone: string;
  timezone_offset: number;
  daily: DailyWeather[];
}

export interface ChartOptionType {
  type: string;
  isLegend: boolean;
}

export interface TimelineType {
  lastQuarter: string;
  runningMonths: string[];
}

export interface BatchType {
  batchName: string;
  harvest: number;
}

export interface GraphDataType {
  name: string;
  harvest: number;
  batches: BatchType[];
}

export interface StackedBarGraphType {
  name: string;
  totalHarvest: number;
  unit: string;
  data: GraphDataType[];
}

export interface DonutGraphType {
  name: string;
  total: number;
}

export interface DonutType {
  chartOption: ChartOptionType;
  timeline: TimelineType;
  graphData: DonutGraphType[];
}

export interface StackedType {
  chartOption: ChartOptionType;
  timeline: TimelineType;
  graphData: StackedBarGraphType[];
}
