import BaseReducer from "@/utilities/baseReducer";
import FarmActions from "./action";
import { addFarmNormalizedSchema, farmNormalizeSchema } from "./Schema";

const initialState = {
  farms: {},
  selectedFarm: null,
  selectedFarmId: null,
  selectedFarmWeather: {
    current: null,
    forecast: {
      threeHourly: null,
      daily: null,
    },
  },
};

export default BaseReducer(initialState, {
  [FarmActions.REQUEST_FARMS_FINISHED](state, action) {
    console.log(action.payload);
    return {
      ...state,
      farms:
        Array.isArray(action.payload) && action.payload.length > 0
          ? farmNormalizeSchema(action.payload)
          : {},
    };
  },
  [FarmActions.ADD_FARM_FINISHED](state, action) {
    return {
      ...state,
      farms: addFarmNormalizedSchema(state?.farms, action.payload),
      selectedFarm: action.payload,
    };
  },
  [FarmActions.SET_SELECTED_FARM](state, action) {
    return {
      ...state,
      selectedFarm: action.payload,
    };
  },
  [FarmActions.UPDATE_FARM_LOCALLY](state, action) {
    return {
      ...state,
      selectedFarm: action.payload.selectedFarm,
      farms: action.payload.farms,
    };
  },
  [FarmActions.GET_FARM_FROM_STORAGE_FINISHED](state, action) {
    return {
      ...state,
      selectedFarmId: action.payload,
    };
  },
  [FarmActions.GET_FARM_CURRENT_WEATHER_FINISHED](state, action) {
    return {
      ...state,
      selectedFarmWeather: {
        ...state.selectedFarmWeather,
        current: action.payload,
      },
    };
  },
  [FarmActions.GET_FARM_THREE_HOURLY_FORECAST_FINISHED](state, action) {
    return {
      ...state,
      selectedFarmWeather: {
        ...state.selectedFarmWeather,
        forecast: {
          ...state.selectedFarmWeather.forecast,
          threeHourly: action.payload,
        },
      },
    };
  },
  [FarmActions.GET_FARM_DAILY_FORECAST_FINISHED](state, action) {
    return {
      ...state,
      selectedFarmWeather: {
        ...state.selectedFarmWeather,
        forecast: {
          ...state.selectedFarmWeather.forecast,
          daily: action.payload,
        },
      },
    };
  },
});
