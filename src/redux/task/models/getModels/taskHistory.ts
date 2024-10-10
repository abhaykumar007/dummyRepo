import { BaseModel } from "sjs-base-model";

export default class TaskHistoryModel extends BaseModel {
  tasksHistoryId = null;
  taskId = null;
  userId = null;
  comment = "";
  createdBy = null;
  updatedBy = null;
  createdDate = null;
  updatedDate = null;
  images = null;
  video = null;
  createdByName = null;
  updatedByName = null;

  constructor(data: Partial<TaskHistoryModel>) {
    super();
    this.update(data);
  }
}
