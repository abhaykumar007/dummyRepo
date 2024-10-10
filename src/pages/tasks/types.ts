export interface Task {
  taskId: string | null;
  farmId: string | null;
  polyhouseId: string | null;
  nurseryId: string | null;
  zoneId: string | null;
  cropLifeCycleId: string | null;
  severity: number | null;
  taskName: string | null;
  category: string | null;
  dueDate: string | null;
  startTime: string | null;
  endTime: string | null;
  description: string | null;
  itemName: string | null;
  qty: number | null;
  status: string | null;
  createdBy: string | null;
  createdFor: string | null;
  updatedBy: string | null;
  createdByName: string | null;
  updatedByName: string | null;
  createdForName: string | null;
  createdDate: string | null;
  updatedDate: string | null;
  isWhatsAppMsgSent: boolean | null;
  tasksHistory: TaskHistory[] | null;
}

export interface CreateTask {
  farmId: string;
  zoneId?: string;
  cropLifeCycleId?: string|null;
  severity: number;
  taskName: string;
  category: string;
  dueDate: any;
  description: string;
  inventoryId: string;
  itemName: string;
  qty: number;
  createdFor: string;
}

export interface PatchTask {
  farmId: string;
  taskId?: string;
  severity: number;
  taskName: string;
  category: string;
  dueDate: any;
  description: string;
  inventoryId?: string|null;
  itemName?: string|null;
  qty?: number|null;
  createdFor?: string;
  zoneId?: string|null;
  cropLifeCycleId?: string|null;
}

export interface TaskHistory {
  tasksHistoryId: string | null;
  taskId: string | null;
  userId: string | null;
  comment: string;
  createdBy: string | null;
  updatedBy: string | null;
  createdDate: string | null;
  updatedDate: string | null;
  images: string[] | null;
  video: string | null;
  createdByName: string | null;
  updatedByName: string | null;
}

export type TaskResponseModelType = {
  total: number;
  tasks: Task[];
};