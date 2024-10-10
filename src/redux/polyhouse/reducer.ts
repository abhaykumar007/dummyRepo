import BaseReducer from "@/utilities/baseReducer";
import PolyhouseActions from "./action";
import { groupByUILabel, polyhouseNormalizeSchema } from "./Schema";
import { Sensor } from "@/pages/polyhouse/types";

const initialState = {
  polyhouses: null,
  selectedPolyhouse: null,
  sensorData: null,
  sensors: null,
  components : null,
  batchCount: null,
  selectedSensorName: null,
  graph: null,
  componentData: null,
  selectedNursery: null,
  nurserySensorData: null,
  nurseryComponentData: null,
  selectedZone: null,
  zoneSensorData: null,
  zoneComponentData: null,
  lifeCycles: null,
};

export default BaseReducer(initialState, {
  [PolyhouseActions.REQUEST_POLYHOUSES_FINISHED](state, action) {
    return {
      ...state,
      polyhouses: Array.isArray(action.payload)
        ? polyhouseNormalizeSchema(action.payload)
        : null,
    };
  },

  [PolyhouseActions.SET_SELECTED_POLYHOUSE](state, action) {
    return {
      ...state,
      selectedPolyhouse: action.payload,
    };
  },

  [PolyhouseActions.SET_SELECTED_NURSERY](state, action) {
    return {
      ...state,
      selectedNursery: action.payload,
    };
  },

  [PolyhouseActions.SET_SELECTED_ZONE](state, action) {
    return {
      ...state,
      selectedZone: action.payload,
    };
  },

  [PolyhouseActions.REQUEST_SENSOR_DATA_FOR_POLYHOUSE_FINISHED](state, action) {
    return {
      ...state,
      sensorData: Array.isArray(action.payload)
        ? groupByUILabel(action.payload)
        : null,
      sensors: Array.isArray(action.payload) ? action.payload : [],
    };
  },
   [PolyhouseActions.SET_SENSORS](state, action) {
    return {
      ...state,
      sensors: action.payload,
    };
   },
   [PolyhouseActions.SET_COMPONENTS](state, action) {
    return {
      ...state,
      components: action.payload,
    };
   },
  [PolyhouseActions.REQUEST_COMPONENT_DATA_FOR_POLYHOUSE_FINISHED](
    state,
    action
  ) {
    return {
      ...state,
      componentData: Array.isArray(action.payload)
        ? groupByUILabel(action.payload)
        : null,
      components: Array.isArray(action.payload) ? action.payload : [],
    };
  },

  [PolyhouseActions.REQUEST_SENSOR_DATA_FOR_NURSERY_FINISHED](state, action) {
    return {
      ...state,
      nurserySensorData: Array.isArray(action.payload)
        ? groupByUILabel(action.payload)
        : null,
        sensors: Array.isArray(action.payload) ? action.payload : [],
      
    };
  },

  [PolyhouseActions.REQUEST_COMPONENT_DATA_FOR_NURSERY_FINISHED](
    state,
    action
  ) {
    return {
      ...state,
      nurseryComponentData: Array.isArray(action.payload)
        ? groupByUILabel(action.payload)
        : null,
      components: Array.isArray(action.payload) ? action.payload : [],
    };
  },

  [PolyhouseActions.REQUEST_SENSOR_DATA_FOR_ZONE_FINISHED](state, action) {
    return {
      ...state,
      zoneSensorData: Array.isArray(action.payload)
        ? groupByUILabel(action.payload)
        : null,
        sensors: Array.isArray(action.payload) ? action.payload : [],
    };
    
  },

  [PolyhouseActions.REQUEST_COMPONENT_DATA_FOR_ZONE_FINISHED](state, action) {
    return {
      ...state,
      zoneComponentData: Array.isArray(action.payload)
        ? groupByUILabel(action.payload)
        : null,
      components: Array.isArray(action.payload) ? action.payload : [],
    };
  },

  [PolyhouseActions.REQUEST_BATCH_COUNT_FINISHED](state, action) {
    return {
      ...state,
      batchCount: action.payload?.batchCount,
    };
  },

  [PolyhouseActions.SET_SELECTED_SENSOR](state, action) {
    return {
      ...state,
      selectedSensorName: action.payload,
    };
  },

  [PolyhouseActions.SET_GRAPH_DATA_LOCALLY](state, action) {
    const graphData = { [action.payload.sensorId]: { ...action.payload } };
    return {
      ...state,
      graph: !state.graph ? { ...graphData } : { ...state.graph, ...graphData },
    };
  },

  [PolyhouseActions.REQUEST_LIFE_CYCLE_FOR_POLYHOUSE_FINISHED](state, action) {
    return {
      ...state,
      lifeCycles: Array.isArray(action.payload) ? action.payload : null,
    };
  },

  [PolyhouseActions.UPDATE_NURSERY_FINISHED](state, action) {
    return {
      ...state,
      selectedNursery: action.payload,
    };
  },

  [PolyhouseActions.UPDATE_ZONE_FINISHED](state, action) {
    return {
      ...state,
      selectedZone: action.payload,
    };
  },

  [PolyhouseActions.UPDATE_POLYHOUSE_LOCALLY](state, action) {
    return {
      ...state,
      selectedPolyhouse: action.payload.polyhouse,
      polyhouses: action.payload.polyhouses,
    };
  },

  [PolyhouseActions.REQUEST_POLYHOUSE_FINISHED](state, action) {
    return {
      ...state,
      selectedPolyhouse: action.payload,
    };
  },

  [PolyhouseActions.REQUEST_ZONE_FINISHED](state, action) {
    return {
      ...state,
      selectedZone: action.payload,
    };
  },

  [PolyhouseActions.REQUEST_NURSERY_FINISHED](state, action) {
    return {
      ...state,
      selectedNursery: action.payload,
    };
  },

  [PolyhouseActions.UPDATE_SCHEDULE_LOCALLY](state, action) {
    const { key, sensor, uiLabel } = action.payload;
    const updatedSensor = state[key]?.[uiLabel].map((sen: Sensor) => {
      if (sen.sensorId !== sensor.sensorId) return sen;
      return sensor;
    });
    return {
      ...state,
      [key]: { ...state[key], [uiLabel]: updatedSensor },
    };
  },
});
