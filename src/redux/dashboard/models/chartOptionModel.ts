import { BaseModel } from "sjs-base-model";

class ChartOptionModel extends BaseModel {
  type = null;

  isLegend = null;

  constructor(data: Partial<ChartOptionModel>) {
    super();
    this.update(data);
  }
}

export default ChartOptionModel;
