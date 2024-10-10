import { BaseModel } from "sjs-base-model";
import ChartOptionModel from "./chartOptionModel";
import TimeLineModel from "./timeLineModel";

class HarvestedBreakupModel extends BaseModel {
  chartOption = ChartOptionModel;

  timeline = TimeLineModel;

  graphData = null;

  constructor(data: Partial<HarvestedBreakupModel>) {
    super();
    this.update(data);
  }
}

export default HarvestedBreakupModel;
