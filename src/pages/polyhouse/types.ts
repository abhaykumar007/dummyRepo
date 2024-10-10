import { Zone, Nursery } from "../farm/types";
import { workflowStage } from "../workflow/types";

export interface Polyhouse {
  polyhouseId: string;
  name: string;
  structureExpectedLife: number;
  plasticExpectedLife: number;
  zones: Zone[] | [];
  nurseries: Nursery[] | [];
  createdBy?: string;
  updatedBy?: string;
  createdDate?: string;
  updatedDate?: string;
}

export interface Schedule {
  id: string | number;
  stopTime: number;
  startTime: number;
  duration?: string;
}

export interface Parameter {
  parameterId: string;
  uiLabel: string;
  visiblity: string;
  description: string;
  defaultValue: string;
  minValue: number | null;
  maxValue: number | null;
  currentValue: string;
  setting: any | null;
  isWriteable: boolean;
  isSchedule: boolean;
  scheduleCount: number;
  maxSchedule: number;
  schedule: Schedule[] | null;
  isGraph: boolean;
  unit: string | null;
  readDataType: string;
  writeDataType: string;
}

export interface Sensor {
  id: string;
  sensorId: string;
  deviceId: string;
  sensorComponent: string;
  version: string;
  iotDeviceVersion: string;
  provider: string;
  category: string;
  zoneId: string;
  createdBy: string;
  updatedBy: string;
  createdDate: string;
  updatedDate: string;
  parameters: Parameter[];
}

export interface Graph {
  uiLabel: string;
  unit: string | null;
  parameterId: string;
  sensorId: string;
  labels: string[];
  values: number[];
}

export interface WorkflowInstanceStepLog {
  qty: number;
  movement: number;
  date: string;
}

export interface WorkflowInstanceStep {
  name: string;
  stepId: string;
  parentId: string | null;
  description: string | null;
  sequence: number;
  duration: number;
  startDate: string;
  actualStartDate: string;
  endDate: string;
  actualEndDate: string | null;
  inboundQty: number;
  outboundQty: number;
  qty: number;
  mortalityQty: number;
  status: string | null;
  zoneId: string | null;
  nurseryId: string | null;
  workflowInstanceStepLogs: WorkflowInstanceStepLog[];
}

export interface InventoryProduct {
  id: string;
  subCategoryId: string;
  name: string;
  unit: string;
  properties: any | null;
  isAdminApproved: boolean;
  createdBy: string;
  updatedBy: string;
  createdDate: string;
  updatedDate: string;
}

export interface Inventory {
  id: string;
  productId: string;
  farmId: string;
  description: string;
  provider: string;
  quantity: number;
  used: number;
  wastage: number;
  createdBy: string;
  updatedBy: string;
  createdDate: string;
  updatedDate: string;
  product: InventoryProduct;
}

export interface Lifecycle {
  id: string;
  name: string;
  description: string;
  workflowInstanceId: string;
  inventoryId: string;
  organisationId: string;
  farmId: string;
  polyhouseId: string;
  batchPrefix: string;
  completedBy: string;
  startedBy: string;
  createdBy: string;
  updatedBy: string;
  qty: number;
  startedOn: string;
  createdDate: string;
  updatedDate: string;
  completedOn: string | null;
  workflowInstanceSteps: WorkflowInstanceStep[];
  status: string;
  isCompleted: boolean;
  unit: string;
  batches: any[];
  inventory: Inventory;
}

export interface AddSensorData {
  polyhouse: {
    id?: string;
    zoneId?: string;
    nurseryId?: string;
  };
  parameters: ParameterType[];
}

export interface ParameterType {
  parameterId: string;
  value: string;
  time: number;
}
export type SaveLifeCyclePayload = {
  name: string;
  description?: string;
  farmId: string;
  polyhouseId: string;
  workflowInstanceSteps: workflowStage[];
};

export type StartLifeCyclePayload = {
  batchPrefix: string;
  inventoryId: string;
  qty: number;
  unit: string;
  startDate: string;
};

export type MoveCropsInLifeCyclePayload = {
  mortalityQty: number;
  outboundQty: number;
  moveDate: string;
};

export type HarvestCropsInLifeCyclePayload = {
  mortalityQty: number;
  outboundQty: number;
  qty: number;
  pricePerUnit?: number;
  harvestDate: string;
};
