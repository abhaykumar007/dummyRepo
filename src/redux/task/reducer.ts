import BaseReducer from "@/utilities/baseReducer";
import TaskActions from "./actions";
import {
  taskStatusKeyToValue,
  taskStatusValueTokey,
} from "@/pages/tasks/utils";
import { produce } from "immer";

const initailState = {
  tasks: {
    all: {
      tasks: [],
      total: 0,
    },
    open: {
      tasks: [],
      total: 0,
    },
    inProgress: {
      tasks: [],
      total: 0,
    },
    inReview: {
      tasks: [],
      total: 0,
    },
    closed: {
      tasks: [],
      total: 0,
    },
    cancelled: {
      tasks: [],
      total: 0,
    },
  },
  selectedTask: null,
  filters: {
    user: null,
    search: null,
  },
};
export default BaseReducer(initailState, {
  [TaskActions.UPDATE_TASKS_BY_STATUS](state, action) {
    const tasksStatusKey = taskStatusValueTokey[action.payload.status];
    return {
      ...state,
      tasks: produce(state.tasks, (draft: any) => {
        draft[tasksStatusKey].tasks = action.payload.tasks;
        draft[tasksStatusKey].total = action.payload.total;
      }),
    };
  },
  [TaskActions.CREATE_TASK_FINISHED](state, action) {
    return {
      ...state,
      tasks: {
        ...state.tasks,
        open: {
          tasks: [action.payload, ...state.tasks.open.tasks],
          total: state.tasks.open.total + 1,
        },
      },
    };
  },
  [TaskActions.UPDATE_TASK_STATUS_LOCALLY](state, action) {
    const { taskId, destination, source } = action.payload;
    const sourceTasks = [...state.tasks[source.droppableId].tasks];
    const task = { ...sourceTasks.find((task: any) => task.taskId === taskId) };
    if (!task) {
      return state;
    }
    if (source.droppableId === destination.droppableId) {
      sourceTasks.splice(source.index, 1);
      sourceTasks.splice(destination.index, 0, task);

      return {
        ...state,
        tasks: {
          ...state.tasks,
          [source.droppableId]: {
            tasks: sourceTasks,
            total: state.tasks[source.droppableId].total,
          },
        },
      };
    }
    task.status = taskStatusKeyToValue[destination.droppableId];
    const destinationTasks = [...state.tasks[destination.droppableId].tasks];
    destinationTasks.splice(destination.index, 0, task);
    sourceTasks.splice(source.index, 1);
    return {
      ...state,
      tasks: {
        ...state.tasks,
        [source.droppableId]: {
          tasks: sourceTasks,
          total: state.tasks[source.droppableId].total,
        },
        [destination.droppableId]: {
          tasks: destinationTasks,
          total: state.tasks[destination.droppableId].total,
        },
      },
    };
  },
  [TaskActions.SELECT_TASK](state, action) {
    return {
      ...state,
      selectedTask: action.payload,
    };
  },
  [TaskActions.SET_FILTERS](state, action) {
    return {
      ...state,
      filters: { ...state.filters, ...action.payload },
    };
  },
  [TaskActions.PATCH_TASK_FINISHED](state, action) {
    const updatedTask = action.payload;
    const tasksList = [
      ...state.tasks[taskStatusValueTokey[updatedTask.status]].tasks,
    ];
    const index = tasksList.findIndex(
      (task: any) => task.taskId === updatedTask.taskId
    );
    tasksList[index] = updatedTask;
    return {
      ...state,
      tasks: {
        ...state.tasks,
        [taskStatusValueTokey[updatedTask.status]]: {
          tasks: tasksList,
          total: state.tasks[taskStatusValueTokey[updatedTask.status]].total,
        },
      },
      selectedTask: updatedTask,
    };
  },
  [TaskActions.ADD_COMMENT_FINISHED](state, action) {
    const selectedTask = state.selectedTask;
    if (!selectedTask) {
      return state;
    }
    const updatedTask = { ...selectedTask };
    updatedTask.tasksHistory = [action.payload, ...updatedTask.tasksHistory];
    const tasksList = [
      ...state.tasks[taskStatusValueTokey[updatedTask.status]].tasks,
    ];
    const index = tasksList.findIndex(
      (task: any) => task.taskId === updatedTask.taskId
    );
    tasksList[index] = updatedTask;
    return {
      ...state,
      tasks: {
        ...state.tasks,
        [taskStatusValueTokey[updatedTask.status]]: {
          tasks: tasksList,
          total: state.tasks[taskStatusValueTokey[updatedTask.status]].total,
        },
      },
      selectedTask: updatedTask,
    };
  },
});
