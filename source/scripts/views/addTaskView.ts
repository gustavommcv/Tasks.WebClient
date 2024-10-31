import { Task } from "../models/task";
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

    public addEventHandlers(submitHandler: (data: Task) => void) {
        // Add task button
        const button = document.querySelector('.data-container__button');
        button?.addEventListener('click', () => {
            this.renderForm(); // Show the form when the button is clicked
        });
    
        // Loading close form events
        this.closeFormEvents();
    
        // Handling form submission
        this.form?.addEventListener('submit', (e) => {
            e.preventDefault();
            const data = this.getFormData();
    
            // Checks that the data has been obtained correctly before calling the handler
            if (data) {
                submitHandler(data); // Calls the submitHandler with the form data
            }
    
            this.toggleForm(); // Close the form after sending
        });
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

    public getFormData() {
        if (!this.form) return null;
    
        const titleInput = document.getElementById('title') as HTMLInputElement | null;
        const descriptionInput = document.getElementById('description') as HTMLTextAreaElement | null;
        const statusInput = document.getElementById('status') as HTMLSelectElement | null;
    
        // Obtaining the input values
        const title = titleInput ? titleInput.value : '';
        const description = descriptionInput ? descriptionInput.value : '';
        const status = statusInput ? statusInput.value : '';
    
        return new Task('', title, description, status);
    }
}

export default new AddTaskView();
