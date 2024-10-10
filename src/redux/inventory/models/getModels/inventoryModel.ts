import { BaseModel } from "sjs-base-model";

export default class InventoryModel extends BaseModel {
  inventoryId = null;
  productId = null;
  name = null;
  farmId = null;
  description = null;
  provider = null;
  quantity = null;
  unit = null;
  used = null;
  wastage = null;
  createdBy = null;
  updatedBy = null;
  createdDate = null;
  updatedDate = null;

  constructor(data: Partial<InventoryModel>) {
    super();
    this.update(data);
  }
}
