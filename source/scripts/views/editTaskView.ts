import { state } from "../data/state";
import View from "./View";

class EditViewTask extends View {
    private editFormMenu: HTMLElement;
    private blurEditContainer: HTMLElement;

    protected generateMarkup(element: any): string {
        throw new Error("Method not implemented.");
    }

    public addEventHandlers(handler: Function): void {
        this.cacheDOMElements();
        this.bindEvents(handler);
    }

    private cacheDOMElements(): void {
        this.editFormMenu = document.querySelector('.form-edit') as HTMLElement;
        this.blurEditContainer = document.querySelector('.blur-edit') as HTMLElement;
    }

    private bindEvents(handler: Function): void {
        const tbody = document.querySelector('.tbody');
        let id: string;

        // Event delegation for the edit buttons
        tbody?.addEventListener('click', (event) => {
            const target = event.target as HTMLElement;
            if (target.classList.contains('edit')) {
                id = target.dataset.id!;
                const task = state.tasks.find(t => t.id === id);

                if (task) {
                    this.renderEditMenu(task);
                }
            }
        });

        document.querySelector('.edit-submit-button')?.addEventListener('click', (e) => {
            e.preventDefault();
        
            const titleInput = (document.querySelector('#edit-title') as HTMLInputElement);
            const descriptionInput = (document.querySelector('#edit-description') as HTMLTextAreaElement);
            const statusSelect = (document.querySelector('#edit-status') as HTMLSelectElement);
        
            // Check if the title is empty
            if (titleInput.value.trim() === '') {
                alert('Title must have at least one character.');
                return; // Prevents the form from being sent
            }
        
            // Captures the updated form values
            const updatedTask = {
                id,
                title: titleInput.value,
                description: descriptionInput.value,
                status: statusSelect.value,
            };
        
            // Passes the updated object to the handler
            handler(updatedTask);
        
            this.toggleEditMenu();
        });
        

        this.blurEditContainer?.addEventListener('click', () => this.toggleEditMenu());
        this.addCloseButtonEvent();
        this.addEscapeKeyEvent();
    }

    private addCloseButtonEvent(): void {
        const closeBtn = document.querySelector('.form-edit .close-button') as HTMLElement;
        closeBtn?.addEventListener('click', () => this.toggleEditMenu());
    }

    private addEscapeKeyEvent(): void {
        document.addEventListener('keydown', (event) => {
            if (event.key === 'Escape' && !this.editFormMenu?.classList.contains('hidden')) {
                this.toggleEditMenu();
            }
        });
    }

    private renderEditMenu(task: { id: string; title: string; description: string; status: string }): void {
        const titleInput = document.querySelector('#edit-title') as HTMLInputElement;
        const descriptionInput = document.querySelector('#edit-description') as HTMLTextAreaElement;
        const statusSelect = document.querySelector('#edit-status') as HTMLSelectElement;

        if (titleInput) titleInput.value = task.title;
        if (descriptionInput) descriptionInput.value = task.description;
        if (statusSelect) statusSelect.value = task.status;

        this.toggleEditMenu();
    }

    private toggleEditMenu(): void {
        this.editFormMenu?.classList.toggle('hidden');
        this.blurEditContainer?.classList.toggle('hidden');
    }
}

export default new EditViewTask();
