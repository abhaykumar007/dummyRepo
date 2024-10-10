export interface Inventory {
  inventoryId: string;
  productId: string;
  name: string;
  farmId: string;
  description: string | null;
  key?:number|string|null
  provider: string;
  quantity: number;
  unit: string;
  used: number;
  wastage: number;
  createdBy: string;
  updatedBy: string;
  createdDate: string;
  updatedDate: string;
}

export interface CreateInventory {
  productId: string;
  description: string | null;
  provider: string;
  quantity: number;
  category: string;
  wastage?: number;
}

export interface PatchInventory {
  description: string | null;
  provider: string;
  quantity: number;
  wastage: number;
}

export type Product = {
  id?: string | null;
  subCategoryId: string | null;
  name: string | null;
  unit: string | null;
  properties?: string | null;
  isAdminApproved?: boolean | null;
  createdBy?: string | null;
  updatedBy?: string | null;
  createdDate?: string | null;
  updatedDate?: string | null;
};
