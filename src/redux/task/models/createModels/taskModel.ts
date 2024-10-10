import { BaseModel } from "sjs-base-model";

export default class TaskModel extends BaseModel {
    category = null;
    createdFor = null;
    description = null;
    dueDate = null;
    farmId = null;
    inventoryId = null;
    itemName = null;
    qty = null;
    severity = null;
    taskName = null;

    constructor(data: Partial<TaskModel>) {
        super();
        this.update(data);
    }
}