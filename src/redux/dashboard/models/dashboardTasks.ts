import { BaseModel } from "sjs-base-model";
import ChartOptionModel from "./chartOptionModel";
import TimeLineModel from "./timeLineModel";

class DashboardTasksModal extends BaseModel {
  chartOption = ChartOptionModel;

  timeline = TimeLineModel;

  graphData = null;

  constructor(data: Partial<DashboardTasksModal>) {
    super();
    this.update(data);
  }
}

export default DashboardTasksModal;
