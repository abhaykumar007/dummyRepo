import { BaseModel } from "sjs-base-model";
import { ProductModel } from "./productModel";

export class SubCategoryModel extends BaseModel {
  productCategoryId = null;
  subCategoryId = null;
  name = null;
  units = [];
  products = [ProductModel];
  createdBy = null;
  updatedBy = null;
  createdDate = null;
  updatedDate = null;

  constructor(data: Partial<SubCategoryModel>) {
    super();
    this.update(data);
  }
}
