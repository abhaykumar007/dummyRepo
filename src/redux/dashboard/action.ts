import { createAction } from "@/utilities/actionUtility";

const DashboardActions = {
  REQUEST_HARVESTED_BREAKUP: "farms/REQUEST_HARVESTED_BREAKUP",
  REQUEST_HARVESTED_BREAKUP_FINISHED:
    "farms/REQUEST_HARVESTED_BREAKUP_FINISHED",
  REQUEST_BATCH_HARVEST: "farms/REQUEST_BATCH_HARVEST",
  REQUEST_BATCH_HARVEST_FINISHED: "farms/REQUEST_BATCH_HARVEST_FINISHED",
  REQUEST_FARM_METRICS: "farms/REQUEST_FARM_METRICS",
  REQUEST_FARM_METRICS_FINISHED: "farms/REQUEST_FARM_METRICS_FINISHED",
  REQUEST_FARM_UTILIZATION_ON_CROPS: "farms/REQUEST_FARM_UTILIZATION_ON_CROPS",
  REQUEST_FARM_UTILIZATION_ON_CROPS_FINISHED:
    "farms/REQUEST_FARM_UTILIZATION_ON_CROPS_FINISHED",
  REQUEST_FARM_UTILIZATION_ON_STAGES:
    "farms/REQUEST_FARM_UTILIZATION_ON_STAGES",
  REQUEST_FARM_UTILIZATION_ON_STAGES_FINISHED:
    "farms/REQUEST_FARM_UTILIZATION_ON_STAGES_FINISHED",
  REQUEST_MORTALITY_RATE: "farms/REQUEST_MORTALITY_RATE",
  REQUEST_MORTALITY_RATE_FINISHED: "farms/REQUEST_MORTALITY_RATE_FINISHED",

  REQUEST_DASHBOARD_TASKS: "farms/REQUEST_DASHBOARD_TASKS",
  REQUEST_DASHBOARD_TASKS_FINISHED: "farms/REQUEST_DASHBOARD_TASKS_FINISHED",

  requestMortalityRate(farmId: string) {
    return createAction(this.REQUEST_MORTALITY_RATE, farmId);
  },

  requestDashboardTasks(farmId: string) {
    return createAction(this.REQUEST_DASHBOARD_TASKS, farmId);
  },

  requestFarmUtilizationOnStages(farmId: string) {
    return createAction(this.REQUEST_FARM_UTILIZATION_ON_STAGES, farmId);
  },

  requestFarmUtilizationOnCrops(farmId: string) {
    return createAction(this.REQUEST_FARM_UTILIZATION_ON_CROPS, farmId);
  },

  requestHarvestedBreakup(farmId: string) {
    return createAction(this.REQUEST_HARVESTED_BREAKUP, farmId);
  },

  requestBatchHarvest(farmId: string) {
    return createAction(this.REQUEST_BATCH_HARVEST, farmId);
  },

  requestFarmMetrics(farmId: string) {
    return createAction(this.REQUEST_FARM_METRICS, farmId);
  },
};
export default DashboardActions;
