import { BaseModel } from "sjs-base-model";

class GraphModel extends BaseModel {
    uiLabel = null;

    unit = null;

    parameterId = null;

    sensorId = null;

    labels = null;

    values = null;
  
    constructor(data: Partial<GraphModel>) {
      super();
      this.update(data);
    }
  }
  
  export default GraphModel;