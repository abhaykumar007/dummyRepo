import { useAppDispatch, useAppSelector } from "@/hooks/redux";
import DashboardActions from "@/redux/dashboard/action";
import FarmSelectors from "@/redux/farm/farmSelectors";
import { useEffect } from "react";
import MortalityRate from "./mortalityRate";
import HarvestedBreakup from "./harvestedBreakup";
import TasksGraph from "./tasks";
import BatchesGraph from "./batches";
import DashboardHeader from "./dashboardHeader";
import "./style.scss";
import Weather from "./weather";

const Dashboard = () => {
  const dispatch = useAppDispatch();
  const selectedFarmId = useAppSelector(FarmSelectors.SelectSelectedFarmId);

  useEffect(() => {
    if (selectedFarmId) {
      dispatch(DashboardActions.requestFarmMetrics(selectedFarmId));
      dispatch(DashboardActions.requestHarvestedBreakup(selectedFarmId));
      dispatch(DashboardActions.requestMortalityRate(selectedFarmId));
      dispatch(DashboardActions.requestDashboardTasks(selectedFarmId));
      dispatch(DashboardActions.requestBatchHarvest(selectedFarmId));
    }
  }, [selectedFarmId]);

  return (
    <div className="dashboardMain">
      <DashboardHeader />
      <Weather />
      <div className="dashboardCard">
        <MortalityRate />
        <HarvestedBreakup />
        <TasksGraph />
        <BatchesGraph />
      </div>
    </div>
  );
};

export default Dashboard;
