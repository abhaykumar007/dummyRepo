import { BaseModel } from "sjs-base-model";
import TaskHistoryModel from "./taskHistory";

export default class TaskModel extends BaseModel {
    taskId = null;
    farmId = null;
    polyhouseId = null;
    nurseryId = null;
    zoneId = null;
    cropLifeCycleId = null;
    severity = null;
    taskName = null;
    category = null;
    dueDate = null;
    startTime = null;
    endTime = null;
    description = null;
    itemName = null;
    qty = null;
    status = null;
    createdBy = null;
    createdFor = null;
    updatedBy = null;
    createdByName = null;
    updatedByName = null;
    createdForName = null;
    createdDate = null;
    updatedDate = null;
    isWhatsAppMsgSent = null;
    tasksHistory = [TaskHistoryModel];
  
    constructor(data: Partial<TaskModel>) {
      super();
      this.update(data);
    }
  }