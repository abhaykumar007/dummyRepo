import {
  getToModel,
  patchToModel,
  postToModel,
  putToModel,
} from "@/utilities/effectUtility";
import api from "@/utilities/api";

import FarmSelectors from "../farm/farmSelectors";
import { store } from "../store";
import TaskResponseModel from "./models/getModels/taskResponseModel";
import TaskModel from "./models/getModels/taskModel";
import TaskHistoryModel from "./models/getModels/taskHistory";
export class TaskEffects {
  static getTasks(filter: Record<string, string>) {
    if(filter.status === "all") delete filter.status;
    const selectedFarmId = FarmSelectors.SelectSelectedFarmId(store.getState());
    const url = `${api.TASKS}/${selectedFarmId}`;
    return getToModel(TaskResponseModel, url, filter);
  }

  static createTask(task: Record<string, string>) {
    const url = `${api.TASKS}`;
    return postToModel(TaskModel, url, task);
  }

  static patchTask(taskId: string, task: Record<string, string>) {
    const url = api.TASK.replace(":taskId", taskId);
    if (task.comment) {
      return postToModel(TaskHistoryModel, `${url}/task-history`, {
        comment: task.comment,
      });
    }
    return putToModel(TaskModel, url, task);
  }

  static updateTaskStatus(payload: Record<string, string>) {
    const url = api.TASK.replace(":taskId", payload.taskId);
    return patchToModel(TaskModel, `${url}/${payload.status}`);
  }
}
