import { BaseModel } from "sjs-base-model";

class GrowingAreaModel extends BaseModel {
  wateringType = null;
  wateringSchedule = null;
  area = null;
  rowCount = null;
  plantCountPerRow = null;
  rowSpacing = null;
  plantSpacing = null;

  constructor(data: Partial<GrowingAreaModel>) {
    super();
    this.update(data);
  }
}

export class ZoneModel extends BaseModel {
  name = null;
  zoneId = null;
  systemType = null;
  area = null;
  growingArea = GrowingAreaModel;
  createdBy = null;
  updatedBy = null;
  createdDate = null;
  updatedDate = null;

  constructor(data: Partial<ZoneModel>) {
    super();
    this.update(data);
  }
}

export class NurseryModel extends BaseModel {
  nurseryId = null;
  name = null;
  type = null;
  wateringType = null;
  wateringSchedule = null;
  germinationType = null;
  area = null;
  seedCount = null;
  germinationArea = null;
  createdBy = null;
  updatedBy = null;
  createdDate = null;
  updatedDate = null;

  constructor(data: Partial<NurseryModel>) {
    super();
    this.update(data);
  }
}

class PolyhouseModel extends BaseModel {
  polyhouseId = null;
  name = null;
  structureExpectedLife = null;
  plasticExpectedLife = null;
  zones = [ZoneModel];
  nurseries = [NurseryModel];
  createdBy = null;
  updatedBy = null;
  createdDate = null;
  updatedDate = null;

  constructor(data: Partial<PolyhouseModel>) {
    super();
    this.update(data);
  }
}

export default PolyhouseModel;
