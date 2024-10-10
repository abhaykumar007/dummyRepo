import { BaseModel } from "sjs-base-model";
import TaskModel from "./taskModel";

export default class TaskResponseModel extends BaseModel {
    total = 0;
    tasks = [TaskModel];

    constructor(data: Partial<TaskResponseModel>) {
      super();
      this.update(data);
    }
  }