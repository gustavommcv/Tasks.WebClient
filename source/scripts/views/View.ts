export default abstract class View {
    protected data: any;
    protected parentElement: Element | null = null;

    public render(data: any) {
        if (!data) return console.log('No data');

        this.data = data;
        this.clear(); // Cleans up before rendering new tasks
        
        // Render new tasks
        data.forEach(element => {
            const markup = this.generateMarkup(element);
            this.parentElement?.insertAdjacentHTML('beforeend', markup);
        });
    }

    protected clear() {
        this.clearSpinner();
        if (this.parentElement) this.parentElement.innerHTML = ''; // Clears the contents of the table
    }

    public renderSpinner() {
        const markup = `<div class="loader"></div>`;
        this.parentElement?.insertAdjacentHTML('beforebegin', markup); // Insert before parentElement
    }

    protected clearSpinner() {
        const loader = document.querySelector('.loader');
        if (loader) loader.remove(); // Remove loader
    }

    protected abstract generateMarkup(element: any): string;
}
