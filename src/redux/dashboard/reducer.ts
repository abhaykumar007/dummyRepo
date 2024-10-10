import BaseReducer from "@/utilities/baseReducer";
import DashboardActions from "./action";

const initialState = {
  harvestedBreakup: null,
  batchHarvest: null,
  farmUtilizationBasedOnCrops: null,
  farmUtilizationBasedOnStages: null,
  mortalityRate: null,
  dashboardTasks: null,
  farmMetrics: null,
};

export default BaseReducer(initialState, {
  [DashboardActions.REQUEST_HARVESTED_BREAKUP_FINISHED](state, action) {
    return {
      ...state,
      harvestedBreakup: action.payload,
    };
  },

  [DashboardActions.REQUEST_FARM_METRICS_FINISHED](state, action) {
    return {
      ...state,
      farmMetrics: action.payload,
    };
  },

  [DashboardActions.REQUEST_BATCH_HARVEST_FINISHED](state, action) {
    return {
      ...state,
      batchHarvest: action.payload,
    };
  },

  [DashboardActions.REQUEST_FARM_UTILIZATION_ON_CROPS_FINISHED](state, action) {
    return {
      ...state,
      farmUtilizationBasedOnCrops: action.payload,
    };
  },

  [DashboardActions.REQUEST_FARM_UTILIZATION_ON_STAGES_FINISHED](
    state,
    action
  ) {
    return {
      ...state,
      farmUtilizationBasedOnStages: action.payload,
    };
  },

  [DashboardActions.REQUEST_MORTALITY_RATE_FINISHED](state, action) {
    return {
      ...state,
      mortalityRate: action.payload,
    };
  },

  [DashboardActions.REQUEST_DASHBOARD_TASKS_FINISHED](state, action) {
    return {
      ...state,
      dashboardTasks: action.payload,
    };
  },
});
