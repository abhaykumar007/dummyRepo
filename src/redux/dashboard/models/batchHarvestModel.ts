import { BaseModel } from "sjs-base-model";
import ChartOptionModel from "./chartOptionModel";
import TimeLineModel from "./timeLineModel";

class BatchHarvestModel extends BaseModel {
  chartOption = ChartOptionModel;

  timeline = TimeLineModel;

  graphData = null;

  constructor(data: Partial<BatchHarvestModel>) {
    super();
    this.update(data);
  }
}

export default BatchHarvestModel;
