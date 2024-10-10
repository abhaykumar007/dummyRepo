import { BaseModel } from "sjs-base-model";



class SensorModel extends BaseModel {
  id = null;

  sensorId = null;

  deviceId = null;

  sensorComponent = null;

  version = null;

  iotDeviceVersion = null;

  provider = null;

  category = null;

  zoneId = null;

  createdBy = null;

  updatedBy = null;

  createdDate = null;

  updatedDate = null;

  parameters = null;
  
    constructor(data: Partial<SensorModel>) {
      super();
      this.update(data);
    }
  }
  
  export default SensorModel;