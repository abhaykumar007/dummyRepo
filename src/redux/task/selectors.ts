import { Task } from "@/pages/tasks/types";
import { RootState } from "../store";

class TaskSelectors {

    public static selectTasksByStatus(state:RootState, status: string) {
        return state.tasks.tasks[status]?.tasks
    }

    public static selectFilteredTasksByStatus(state:RootState, status: string){
        const filters = state.tasks.filters
        let tasks = [...state.tasks.tasks[status].tasks]
        if(filters.search){
            tasks= tasks.filter((task:Task) => JSON.stringify(task).toLowerCase().includes(filters.search))
        }
        
        if(filters.user){
            tasks= tasks.filter((task:Task) => task.createdFor === filters.user)
        }
        return tasks
    }
    public static selectTasksTotalByStatus(state:RootState, status: string){
        return state.tasks.tasks[status].total
    }

    public static selectTasks(state:RootState){
        return state.tasks.tasks
    }

    public static selectSelectedTask(state:RootState){
        return state.tasks.selectedTask
    }

    public static selectTaskFilters(state:RootState){
        return state.tasks.filters
    }
}

export default TaskSelectors;