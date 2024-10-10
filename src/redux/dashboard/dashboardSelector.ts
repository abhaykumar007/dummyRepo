import { RootState } from "../store";

export default class DashboardSelectors {
  static SelectHarvestedBreakup = (state: RootState) =>
    state?.dashboard?.harvestedBreakup;

  static SelectBatchHarvest = (state: RootState) =>
    state?.dashboard?.batchHarvest;

  static SelectFarmMetrics = (state: RootState) =>
    state?.dashboard?.farmMetrics;

  static SelectFarmUtilizationBasedOnCrops = (state: RootState) =>
    state?.dashboard?.farmUtilizationBasedOnCrops;

  static SelectFarmUtilizationBasedOnStages = (state: RootState) =>
    state?.dashboard?.farmUtilizationBasedOnStages;

  static SelectMortalityRate = (state: RootState) =>
    state?.dashboard?.mortalityRate;

  static SelectDashBoardTasks = (state: RootState) =>
    state?.dashboard?.dashboardTasks;
}
