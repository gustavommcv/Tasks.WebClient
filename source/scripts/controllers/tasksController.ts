import taskView from '../views/taskView';
import addTaskView from '../views/addTaskView';
import deleteTaskView from '../views/deleteTaskView';

import { state } from '../data/state';
import * as task from '../models/task';
import editTaskView from '../views/editTaskView';

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
        // 1) Get form params
        const data = addTaskView.getFormData();

        // 2) Send post request to the api
        await task.addTask(data);

        // 3) Update UI with new task
        await updateUI();

    } catch (error) {
        console.error("Error loading tasks: ", error);
    }
}

const controlEditTask = async function(updatedTask) {
    try {
        // 1) Send edit request
        console.log(updatedTask);
        await task.editTask(updatedTask);

        // 2) Update UI
        await updateUI();

    } catch (error) {
        console.error("Error loading tasks: ", error);
    }
}

const controlDeleteTask = async function(id: string) {
    try {
        // 1) Send delete reqeust
        await task.deleteTask(id);
        
        // 2) Update UI
        await updateUI();

    } catch (error) {
        console.error("Error loading tasks: ", error);
    }
}

const updateUI = async function() {
    await task.loadTasks();
    await controlTasks();
}

export const init = async function() {
    // Rendering tasks on page load
    await controlTasks();

    // Rendering tasks from button events
    taskView.addHandlerRender(controlTasks);

    // Rendering form from button event
    addTaskView.addEventHandlers(controlAddTask);

    // Edit
    editTaskView.addEventHandlers(controlEditTask);

    // Delete
    deleteTaskView.addEventHandlers(controlDeleteTask);
}
