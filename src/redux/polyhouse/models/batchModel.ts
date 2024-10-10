import { BaseModel } from "sjs-base-model";

class BatchModel extends BaseModel {
    batchCount = null;

  
    constructor(data: Partial<BatchModel>) {
      super();
      this.update(data);
    }
  }
  
  export default BatchModel;