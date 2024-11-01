(() => {
  // source/scripts/views/View.ts
  var View = class {
    data;
    parentElement = null;
    render(data) {
      if (!data) return console.log("No data");
      this.data = data;
      this.clear();
      data.forEach((element) => {
        const markup = this.generateMarkup(element);
        this.parentElement?.insertAdjacentHTML("beforeend", markup);
      });
    }
    clear() {
      this.clearSpinner();
      if (this.parentElement) this.parentElement.innerHTML = "";
    }
    renderSpinner() {
      const markup = `<div class="loader"></div>`;
      this.parentElement?.insertAdjacentHTML("beforebegin", markup);
    }
    clearSpinner() {
      const loader = document.querySelector(".loader");
      if (loader) loader.remove();
    }
  };

  // source/scripts/views/taskView.ts
  var TaskView = class extends View {
    parentElement = document.querySelector(".tbody");
    generateMarkup(element) {
      return `
            <tr>
                <td data-label="Title">${element.title}</td>
                <td data-label="Status">${element.status}</td>
                <td data-label="Description">${element.description}</td>
                <td data-label="Action">
                    <button data-id="${element.id}" class="action-button button edit">\u270F\uFE0F</button>
                    <button data-id="${element.id}" class="action-button button delete">\u{1F5D1}\uFE0F</button>
                </td>
            </tr>
        `;
    }
    renderSpinner() {
      const markup = `
            <div class="loader"></div>
        `;
      document.querySelector(".task-table")?.insertAdjacentHTML("afterend", markup);
    }
    addHandlerRender(handler) {
      const buttons = document.querySelectorAll(".aside__button");
      buttons.forEach((button) => {
        button.addEventListener("click", function() {
          const status = this.dataset.status;
          handler(status);
        });
      });
    }
  };
  var taskView_default = new TaskView();

  // source/scripts/config.ts
  var API_URL = "https://localhost:7244/api/tasks";
  var TIMEOUT_SEC = 10;

  // source/scripts/data/state.ts
  var state = {
    tasks: []
  };

  // source/scripts/helpers/timeout.ts
  var timeout = function(s) {
    return new Promise(function(_, reject) {
      setTimeout(function() {
        reject(new Error(`Request took too long! Timeout after ${s} seconds`));
      }, s * 1e3);
    });
  };

  // source/scripts/helpers/getJSON.ts
  var getJSON = async function(url) {
    try {
      const result = await Promise.race([fetch(url), timeout(TIMEOUT_SEC)]);
      if (!(result instanceof Response)) throw new Error("Request timed out or failed");
      const response = result;
      const data = await response.json();
      if (!response.ok) throw new Error(`${response.status}`);
      return data;
    } catch (error) {
      throw error;
    }
  };

  // source/scripts/helpers/getStatusFromString.ts
  var getStatusFromString = (statusString) => {
    switch (statusString) {
      case "Pending":
        return 0 /* Pending */;
      case "Completed":
        return 1 /* Completed */;
      default:
        throw new Error(`Invalid status: ${statusString}`);
    }
  };

  // source/scripts/helpers/postRequest.ts
  var postRequest = async (taskData) => {
    const response = await fetch(`${API_URL}`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify(taskData)
    });
    if (!response.ok) {
      const errorMessage = await response.text();
      throw new Error(`Error adding task: ${errorMessage}`);
    }
    const data = await response.json();
    console.log("Task added successfully:", data);
  };

  // source/scripts/models/task.ts
  var Task = class {
    id;
    title;
    description;
    status;
    constructor(id, title, description, status) {
      this.id = id;
      this.description = description;
      this.title = title;
      this.status = status;
    }
  };
  var loadTasks = async function() {
    try {
      const data = await getJSON(`${API_URL}`);
      state.tasks = data.map((element) => new Task(
        element.id,
        element.title,
        element.description,
        element.status
      ));
    } catch (error) {
      throw error;
    }
  };
  var getTasks = function(status = "") {
    if (status === "Pending") {
      return state.tasks.filter((t) => t.status === "Pending");
    } else if (status === "Completed") {
      return state.tasks.filter((t) => t.status === "Completed");
    }
    return state.tasks;
  };
  var addTask = async function(task) {
    if (!task) throw new Error("No task");
    const taskData = {
      title: task.title,
      description: task.description,
      status: getStatusFromString(task.status)
    };
    await postRequest(taskData);
  };

  // source/scripts/views/addTaskView.ts
  var AddTaskView = class extends View {
    form = document.querySelector(".form");
    blurContainer = document.querySelector(".blur");
    closeFormBtn = document.querySelector(".close-button");
    generateMarkup(element) {
      throw new Error("Method not implemented.");
    }
    renderForm() {
      this.form?.classList.toggle("hidden");
      this.blurContainer?.classList.toggle("hidden");
    }
    addEventHandlers(submitHandler) {
      const button = document.querySelector(".data-container__button");
      button?.addEventListener("click", () => {
        this.renderForm();
      });
      this.closeFormEvents();
      this.form?.addEventListener("submit", (e) => {
        e.preventDefault();
        const data = this.getFormData();
        if (data) {
          submitHandler(data);
          this.clearFormFields();
        }
        this.toggleForm();
      });
    }
    closeFormEvents() {
      this.blurContainer?.addEventListener("click", () => {
        this.toggleForm();
      });
      document.addEventListener("keydown", (event) => {
        if (event.key === "Escape" && !this.form?.classList.contains("hidden")) {
          this.toggleForm();
        }
      });
      this.closeFormBtn?.addEventListener("click", (e) => {
        e.preventDefault();
        this.toggleForm();
      });
    }
    clearFormFields() {
      if (!this.form) return;
      const titleInput = document.getElementById("title");
      const descriptionInput = document.getElementById("description");
      const statusInput = document.getElementById("status");
      if (titleInput) titleInput.value = "";
      if (descriptionInput) descriptionInput.value = "";
      if (statusInput) statusInput.selectedIndex = 0;
    }
    toggleForm() {
      this.form?.classList.toggle("hidden");
      this.blurContainer?.classList.toggle("hidden");
    }
    getFormData() {
      if (!this.form) return null;
      const titleInput = document.getElementById("title");
      const descriptionInput = document.getElementById("description");
      const statusInput = document.getElementById("status");
      const title = titleInput ? titleInput.value : "";
      const description = descriptionInput ? descriptionInput.value : "";
      const status = statusInput ? statusInput.value : "";
      return new Task("", title, description, status);
    }
  };
  var addTaskView_default = new AddTaskView();

  // source/scripts/views/deleteTaskView.ts
  var DeleteViewTask = class extends View {
    deleteConfirmationMenu;
    blurContainer;
    generateMarkup(element) {
      throw new Error("Method not implemented.");
    }
    addEventHandlers(handler) {
      this.cacheDOMElements();
      this.bindEvents(handler);
    }
    cacheDOMElements() {
      this.deleteConfirmationMenu = document.querySelector(".delete-confirmation");
      this.blurContainer = document.querySelector(".blur-delete");
    }
    bindEvents(handler) {
      const deleteButtons = document.querySelectorAll(".delete");
      deleteButtons.forEach((button) => {
        const deleteButton = button;
        deleteButton.addEventListener("click", () => {
          const id = deleteButton.dataset.id;
          const task = state.tasks.filter((t) => t.id === id)[0];
          this.renderMenu(task.id, task.title);
        });
      });
      this.blurContainer?.addEventListener("click", () => this.toggleMenu());
      this.addCancelButtonEvent();
      this.addEscapeKeyEvent();
    }
    addCancelButtonEvent() {
      const cancelBtn = document.querySelector(".cancel");
      cancelBtn?.addEventListener("click", () => this.toggleMenu());
    }
    addEscapeKeyEvent() {
      document.addEventListener("keydown", (event) => {
        if (event.key === "Escape" && !this.deleteConfirmationMenu?.classList.contains("hidden")) {
          this.toggleMenu();
        }
      });
    }
    renderMenu(id, title) {
      const idElement = document.querySelector(".delete-confirmation__id");
      const titleElement = document.querySelector(".delete-confirmation__task-title");
      if (idElement) idElement.textContent = id;
      if (titleElement) titleElement.textContent = title;
      this.toggleMenu();
    }
    toggleMenu() {
      this.deleteConfirmationMenu?.classList.toggle("hidden");
      this.blurContainer?.classList.toggle("hidden");
    }
  };
  var deleteTaskView_default = new DeleteViewTask();

  // source/scripts/controllers/tasksController.ts
  var controlTasks = async function(status = "") {
    try {
      taskView_default.renderSpinner();
      if (state.tasks.length < 1) await loadTasks();
      taskView_default.render(getTasks(status));
    } catch (error) {
      console.error("Error loading tasks: ", error);
    }
  };
  var controlAddTask = async function() {
    try {
      const data = addTaskView_default.getFormData();
      await addTask(data);
      await loadTasks();
      controlTasks();
    } catch (error) {
      console.error("Error loading tasks: ", error);
    }
  };
  var controlDeleteTask = async function() {
    try {
    } catch (error) {
      console.error("Error loading tasks: ", error);
    }
  };
  var init = async function() {
    await controlTasks();
    taskView_default.addHandlerRender(controlTasks);
    addTaskView_default.addEventHandlers(controlAddTask);
    deleteTaskView_default.addEventHandlers(controlDeleteTask);
  };

  // source/scripts/index.ts
  document.addEventListener("DOMContentLoaded", () => {
    init();
  });
})();
//# sourceMappingURL=index.js.map
