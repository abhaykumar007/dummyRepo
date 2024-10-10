import { BaseModel } from "sjs-base-model";
import ChartOptionModel from "./chartOptionModel";
import TimeLineModel from "./timeLineModel";

class MortalityRateModel extends BaseModel {
  chartOption = ChartOptionModel;

  timeline = TimeLineModel;

  graphData = null;

  constructor(data: Partial<MortalityRateModel>) {
    super();
    this.update(data);
  }
}

export default MortalityRateModel;
