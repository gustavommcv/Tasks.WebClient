import { API_URL } from "../config";
import { state } from "../data/state";
import { getJSON } from "../helpers/getJSON";
import { getStatusFromString } from "../helpers/getStatusFromString";
import { postRequest } from "../helpers/postRequest";
import { deleteRequest } from "../helpers/deleteRequest";

export class Task {
    public id: string;
    public title: string;
    public description: string;
    public status: string;

    constructor(id: string, title: string, description: string, status: string) {
        this.id = id;
        this.description = description;
        this.title = title;
        this.status = status;
    }
}

export const loadTasks = async function(): Promise<void> {
    try {
        // Get data
        const data = await getJSON(`${API_URL}`);

        // Converting the response into an Task array object
        state.tasks = data.map((element: any) => new Task(
            element.id,
            element.title,
            element.description,
            element.status
        ));

    } catch (error) {
        throw error;
    }
}

export const getTasks = function(status = '') {
    if (status === 'Pending') {
        return state.tasks.filter(t => t.status === 'Pending');
    } else if (status === 'Completed') {
        return state.tasks.filter(t => t.status === 'Completed');
    }
    return state.tasks;
};

export const addTask = async function(task: Task | null) {
    if (!task) throw new Error("No task");

    const taskData = {
        title: task.title,
        description: task.description,
        status: getStatusFromString(task.status),
    };

    await postRequest(taskData);
}

export const deleteTask = async function(id: string) {
    await deleteRequest(id);
}
