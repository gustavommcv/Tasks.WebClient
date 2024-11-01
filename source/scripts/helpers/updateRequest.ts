import { API_URL } from "../config";

export const updateRequest = async (taskData: any): Promise<void> => {
    const response = await fetch(`${API_URL}/${taskData.id}`, {
        method: 'PUT',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(taskData),
    });

    if (!response.ok) {
        const errorMessage = await response.text();
        throw new Error(`Error adding task: ${errorMessage}`);
    }

    const data = await response.json();
    console.log('Task edit success:', data);
};
