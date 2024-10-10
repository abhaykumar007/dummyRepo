import { BaseModel } from "sjs-base-model";

class TimeLineModel extends BaseModel {
  lastQuarter = null;

  runningMonths = null;

  constructor(data: Partial<TimeLineModel>) {
    super();
    this.update(data);
  }
}

export default TimeLineModel;
