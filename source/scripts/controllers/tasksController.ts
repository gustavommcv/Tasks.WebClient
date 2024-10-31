import taskView from '../views/taskView';
import { state } from '../data/state';
import * as task from '../models/task';

const controlTasks = async function(status = '') {
    try {
        taskView.renderSpinner();

        // Load tasks if state is not loaded
        if (state.tasks.length < 1) await task.loadTasks();

        // 1) Rendering tasks based on the status
        taskView.render(task.getTasks(status));

    } catch (error) {
        console.error("Error loading tasks: ", error);
    }
}

export const init = async function() {
    // Rendering tasks on page load
    controlTasks();

    // Rendering quests from button events
    taskView.addHandlerRender(controlTasks);
}
