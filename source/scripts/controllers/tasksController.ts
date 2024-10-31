import taskView from '../views/taskView';
import addTaskView from '../views/addTaskView';

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

const controlAddTask = async function() {
    try {
        // 1) Rendering form
        addTaskView.renderForm();

        // 2) Get form params

        // 3) Send post request to the api

    } catch (error) {
        console.error("Error loading tasks: ", error);
    }
}

export const init = async function() {
    // Rendering tasks on page load
    controlTasks();

    // Rendering quests from button events
    taskView.addHandlerRender(controlTasks);

    // Rendering form from button event
    addTaskView.addEventHandlers(controlAddTask);
}
