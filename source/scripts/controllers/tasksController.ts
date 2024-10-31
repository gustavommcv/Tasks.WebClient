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

const controlAddTask = async function(data: task.Task) {
    try {
        // 1) Get form params
        const data = addTaskView.getFormData();
        console.log(data);

        // 2) Send post request to the api
        // task.addTask();

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
