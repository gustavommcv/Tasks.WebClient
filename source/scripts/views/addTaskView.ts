import View from "./View";

class AddTaskView extends View {
    private form = document.querySelector('.form');
    private blurContainer = document.querySelector('.blur');
    private closeFormBtn = document.querySelector('.close-button');

    protected generateMarkup(element: any): string {
        throw new Error("Method not implemented.");
    }

    public renderForm() {
        this.form?.classList.toggle('hidden');
        this.blurContainer?.classList.toggle('hidden');
    }

    public addEventHandlers(handler) {
        // Add task button
        const button = document.querySelector('.data-container__button');
        button?.addEventListener('click', handler);

        // Loading close form events
        this.closeFormEvents();
    }

    private closeFormEvents() {
        this.blurContainer?.addEventListener('click', () => {
            this.toggleForm();
        });

        document.addEventListener('keydown', (event) => {
            if (event.key === 'Escape' && !this.form?.classList.contains('hidden')) {
                this.toggleForm();
            }
        });

        this.closeFormBtn?.addEventListener('click', (e) => {
            e.preventDefault();

            this.toggleForm();
        });
    }

    private toggleForm() {
        this.form?.classList.toggle('hidden');
        this.blurContainer?.classList.toggle('hidden');
    }
}

export default new AddTaskView();
