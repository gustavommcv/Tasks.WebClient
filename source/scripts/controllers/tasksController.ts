import * as taskModel from '../models/task';
import taskView from '../views/taskView';

const controlTasks = async function(status = '') {
    try {
        taskView.renderSpinner();

        // 1) Rendering tasks based on the status
        taskView.render(taskModel.getTasks(status));

    } catch (error) {
        console.error("Error loading tasks:", error);
    }
}

export const init = async function() {
    //Load tasks if state is not loaded
    if (taskModel.state.tasks.length < 1) await taskModel.loadTasks();

    // Rendering tasks on page load
    controlTasks();

    // Rendering quests from button events
    taskView.addHandlerRender(controlTasks);
}
