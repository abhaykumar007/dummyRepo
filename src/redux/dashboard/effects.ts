import api from "@/utilities/api";
import { getToModel } from "@/utilities/effectUtility";
import HarvestedBreakupModel from "./models/harvestedBreakupModel";
import FarmUtilizationBasedOnCropsModel from "./models/farmUtilizationBasedOnCropsModel";
import FarmUtilizationBasedOnStagesModel from "./models/farmUtilizationBasedOnStagesModel";
import MortalityRateModel from "./models/mortalityRateModel";
import DashboardTasksModal from "./models/dashboardTasks";
import BatchHarvestModel from "./models/batchHarvestModel";
import FarmMetricsModel from "./models/farmMetricsModel";

export default class DashboardEffects {
  static getHarvestedBreakup(farmId: string) {
    return getToModel(
      HarvestedBreakupModel,
      api.HARVESTED_BREAKUP.replace(":farmId", farmId)
    );
  }

  static getBatchHarvest(farmId: string) {
    return getToModel(
      BatchHarvestModel,
      api.BATCH_HARVESTED.replace(":farmId", farmId)
    );
  }

  static getFarmMetrics(farmId: string) {
    return getToModel(
      FarmMetricsModel,
      api.FARM_METRICS.replace(":farmId", farmId)
    );
  }

  static getFarmUtilizationBasedOnCrops(farmId: string) {
    return getToModel(
      FarmUtilizationBasedOnCropsModel,
      api.FARM_UTILIZATION_ON_CROPS.replace(":farmId", farmId)
    );
  }

  static getFarmUtilizationBasedOnStages(farmId: string) {
    return getToModel(
      FarmUtilizationBasedOnStagesModel,
      api.FARM_UTILIZATION_ON_STAGES.replace(":farmId", farmId)
    );
  }

  static getMortalityRate(farmId: string) {
    return getToModel(
      MortalityRateModel,
      api.MORTALITY_RATE.replace(":farmId", farmId)
    );
  }

  static getDashboardTasks(farmId: string) {
    return getToModel(
      DashboardTasksModal,
      api.DASHBOARD_TASKS.replace(":farmId", farmId)
    );
  }
}
