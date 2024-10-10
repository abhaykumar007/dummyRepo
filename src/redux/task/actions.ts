import { createAction } from "@/utilities/actionUtility";
import { DraggableLocation } from "react-beautiful-dnd";
import {CreateTask, PatchTask, Task} from "@/pages/tasks/types";

const TaskActions = {
  FETCH_TASKS: "tasks/FTECH_TASKS",
  FETCH_TASKS_FINISHED: "tasks/FETCH_TASKS_FINISHED",
  UPDATE_TASKS_BY_STATUS: "tasks/UPDATE_TASKS_BY_STATUS",
  CREATE_TASK: "tasks/CREATE_TASK",
  CREATE_TASK_FINISHED: "tasks/CREATE_TASK_FINISHED",
  PATCH_TASK: "tasks/PATCH_TASK",
  PATCH_TASK_FINISHED: "tasks/PATCH_TASK_FINISHED",
  ADD_COMMENT: "tasks/ADD_COMMENT",
  ADD_COMMENT_FINISHED: "tasks/ADD_COMMENT_FINISHED",
  UPDATE_TASK_STATUS: "tasks/UPDATE_STATUS",
  UPDATE_TASK_STATUS_FINISHED: "tasks/UPDATE_STATUS_FINISHED",
  UPDATE_TASK_STATUS_LOCALLY: "tasks/UPDATE_STATUS_LOCALLY",
  SELECT_TASK: "tasks/SELECT_TASK",
  SET_FILTERS: "tasks/SET_FILTERS",

  createTask(task: CreateTask) {
    return createAction(this.CREATE_TASK, task);
  },

  fetchTasks(filter?: Record<string, string>, scope?: string, loadMore?: boolean) {
    return createAction(this.FETCH_TASKS, filter, false, { scope, loadMore });
  },

  patchTask(payload:{id:string, data: PatchTask},scope:string){
    return createAction(this.PATCH_TASK, payload, false, { scope }  );
  },

  addComment(taskId: string, comment: string) {
    return createAction(this.ADD_COMMENT, { taskId, comment });
  },

  updateTaskStatusLocally(
    taskId: string,
    destination: DraggableLocation,
    source: DraggableLocation
  ) {
    return createAction(this.UPDATE_TASK_STATUS_LOCALLY, {
      taskId,
      destination,
      source,
    });
  },

  updateTaskStatus(
    taskId: string,
    destination: DraggableLocation,
    source: DraggableLocation,
    scope?: string
  ) {
    return createAction(this.UPDATE_TASK_STATUS, {
      taskId,
      destination,
      source,
    }, false, { scope });
  },

  selectTask(task:Task | null) {
    return createAction(this.SELECT_TASK, task);
  },
  setFilters(filters: Record<string, string | null>) {
    return createAction(this.SET_FILTERS, filters);
  },
};

export default TaskActions;
