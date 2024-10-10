import { BaseModel } from "sjs-base-model";

export class ProductModel extends BaseModel {
    subCategoryId = null;
    name = null;
    unit = null;

    constructor(data: Partial<ProductModel>) {
      super();
      this.update(data);
    }
  }