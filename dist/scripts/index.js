(() => {
  // source/scripts/config.ts
  var API_URL = "https://localhost:7244/api/tasks";
  var TIMEOUT_SEC = 10;

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

  // source/scripts/models/task.ts
  var Task = class {
    constructor(id, title, description, status) {
      this.id = id;
      this.title = title;
      this.description = description;
      this.status = status;
    }
  };
  var state = {
    tasks: []
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

  // source/scripts/controllers/tasksController.ts
  var controlTasks = async function(status = "") {
    try {
      taskView_default.renderSpinner();
      taskView_default.render(getTasks(status));
    } catch (error) {
      console.error("Error loading tasks:", error);
    }
  };
  var init = async function() {
    if (state.tasks.length < 1) await loadTasks();
    controlTasks();
    taskView_default.addHandlerRender(controlTasks);
  };

  // source/scripts/index.ts
  document.addEventListener("DOMContentLoaded", () => {
    init();
  });
})();
//# sourceMappingURL=index.js.map