import View from "./View";

class TaskView extends View {
    protected parentElement = document.querySelector('.tbody');

    protected generateMarkup(element): string {
        return `
            <tr>
                <td data-label="Title">${element.title}</td>
                <td data-label="Status">${element.status}</td>
                <td data-label="Description">${element.description}</td>
                <td data-label="Action">
                    <button data-id="${element.id}" class="action-button button edit">✏️</button>
                    <button data-id="${element.id}" class="action-button button delete">🗑️</button>
                </td>
            </tr>
        `;
    }

    public override renderSpinner() {
        const markup = `
            <div class="loader"></div>
        `;

        document.querySelector('.task-table')?.insertAdjacentHTML('afterend', markup);
    }

    public addHandlerRender(handler) {
        const buttons = document.querySelectorAll('.aside__button');

        buttons.forEach(button => {
            button.addEventListener('click', function() {
                const status = this.dataset.status;
                handler(status);
            });
        });
    }

}

export default new TaskView();
