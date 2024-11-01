import { state } from "../data/state";
import View from "./View";

class DeleteViewTask extends View {
    private deleteConfirmationMenu: HTMLElement;
    private blurContainer: HTMLElement;

    protected generateMarkup(element: any): string {
        throw new Error("Method not implemented.");
    }

    public addEventHandlers(handler: Function): void {
        this.cacheDOMElements();
        this.bindEvents(handler);
    }

    private cacheDOMElements(): void {
        this.deleteConfirmationMenu = document.querySelector('.delete-confirmation') as HTMLElement;
        this.blurContainer = document.querySelector('.blur-delete') as HTMLElement;
    }

    private bindEvents(handler: Function): void {
        const deleteButtons = document.querySelectorAll('.delete');
    
        deleteButtons.forEach(button => {
            const deleteButton = button as HTMLElement; // Casting para HTMLElement
    
            deleteButton.addEventListener('click', () => { 
                const id = deleteButton.dataset.id;
                const task = state.tasks.filter(t => t.id === id)[0];
                
                this.renderMenu(task.id, task.title);
            });
        });
    
        this.blurContainer?.addEventListener('click', () => this.toggleMenu());
        this.addCancelButtonEvent();
        this.addEscapeKeyEvent();
    }

    private addCancelButtonEvent(): void {
        const cancelBtn = document.querySelector('.cancel') as HTMLElement;
        cancelBtn?.addEventListener('click', () => this.toggleMenu());
    }

    private addEscapeKeyEvent(): void {
        document.addEventListener('keydown', (event) => {
            if (event.key === 'Escape' && !this.deleteConfirmationMenu?.classList.contains('hidden')) {
                this.toggleMenu();
            }
        });
    }

    private renderMenu(id: string, title: string): void {
        const idElement = document.querySelector('.delete-confirmation__id') as HTMLElement;
        const titleElement = document.querySelector('.delete-confirmation__task-title') as HTMLElement;
    
        if (idElement) idElement.textContent = id;
        if (titleElement) titleElement.textContent = title;
    
        this.toggleMenu();
    }
    
    private toggleMenu(): void {
        this.deleteConfirmationMenu?.classList.toggle('hidden');
        this.blurContainer?.classList.toggle('hidden');
    }
}

export default new DeleteViewTask();
