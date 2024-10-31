import { API_URL } from '../config';
import { getJSON } from '../helpers/getJSON';

class Task {
    constructor(
        public id: string,
        public title: string,
        public description: string,
        public status: string
    ) {}
}

// Interface that defines the state of the application
interface State {
    tasks: Task[];
}

// Inicializing the state with an empty array of tasks
export const state: State = {
    tasks: []
};

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
