import { TIMEOUT_SEC } from "../config";
import { timeout } from './timeout';

export const getJSON = async function(url) {
    try {
        // Grabbing the response from the API
        // Race (timeout)
        const result = await Promise.race([fetch(url), timeout(TIMEOUT_SEC)]);

        if (!(result instanceof Response)) throw new Error('Request timed out or failed');

        const response: Response = result;

        
        // JSON parse
        const data = await response.json();

        if (!response.ok) throw new Error(`${response.status}`);

        return data;

    } catch (error) {
        throw error;
    }
}