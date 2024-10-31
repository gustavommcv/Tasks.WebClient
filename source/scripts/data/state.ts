import { Task } from "../models/task";

// Interface that defines the state of the application
interface State {
    tasks: Task[];
}

// Inicializing the state with an empty array of tasks
export const state: State = {
    tasks: []
};
