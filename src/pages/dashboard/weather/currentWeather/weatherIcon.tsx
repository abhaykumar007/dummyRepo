import React from 'react';
import  CloudyIcon  from '@/assets/images/weather/cloudy.svg';
import  HazeIcon from '@/assets/images/weather/haze.svg';
import  HeavyRainIcon from '@/assets/images/weather/heavy-rain.svg';
import PartlyCloudyIcon from '@/assets/images/weather/partly-cloudy.svg';
import RainIcon  from '@/assets/images/weather/rain.svg';
import SleetIcon  from '@/assets/images/weather/sleet.svg';
import SnowIcon  from '@/assets/images/weather/snow.svg';
import SunnyIcon  from '@/assets/images/weather/sunny.svg';
import ThunderstormIcon  from '@/assets/images/weather/thunderstorm.svg';

interface IWeatherIconProps {
  code: number;
  big?: boolean;
}

const WeatherIcon: React.FC<IWeatherIconProps> = (props) => {
  let Icon: string

  switch (props.code) {
    // Clear
    case 800:
      Icon = SunnyIcon;
      break;

    // Cloud
    case 801:
    case 802:
      Icon = PartlyCloudyIcon;
      break;
    case 803:
    case 804:
      Icon = CloudyIcon;
      break;

    // Rain
    case 500:
    case 501:
    case 520:
    case 521:
    case 511:
      Icon = RainIcon;
      break;
    case 502:
    case 503:
    case 504:
    case 522:
    case 531:
      Icon = HeavyRainIcon;
      break;

    // Drizzle
    case 300:
    case 301:
    case 302:
    case 310:
    case 311:
    case 312:
    case 313:
    case 314:
    case 321:
      Icon = RainIcon;
      break;

    // Thunderstorm
    case 200:
    case 201:
    case 202:
    case 210:
    case 211:
    case 212:
    case 221:
    case 230:
    case 231:
    case 232:
      Icon = ThunderstormIcon;
      break;

    // Snow
    case 600:
    case 601:
    case 602:
    case 612:
    case 613:
    case 615:
    case 616:
    case 620:
    case 621:
    case 622:
      Icon = SnowIcon;
      break;
    case 611:
      Icon = SleetIcon;
      break;

    // Atmosphere
    case 701:
    case 711:
    case 721:
    case 731:
    case 741:
    case 751:
    case 761:
    case 762:
    case 771:
    case 781:
      Icon = HazeIcon;
      break;

    default:
      Icon = SunnyIcon;
  }
  return props.big ? <img style={{ width: '100px', height: '100px' }} src={Icon}/> : <img src={Icon}/>;
};

export default WeatherIcon;
