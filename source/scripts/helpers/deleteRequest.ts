import { API_URL } from "../config";

export const deleteRequest = async (id: string): Promise<void> => {
    const response = await fetch(`${API_URL}/${id}`, {
        method: 'DELETE',
        headers: {
            'Content-Type': 'application/json',
        },
    });

    if (!response.ok) {
        const errorMessage = await response.text();
        throw new Error(`Error adding task: ${errorMessage}`);
    }
};
