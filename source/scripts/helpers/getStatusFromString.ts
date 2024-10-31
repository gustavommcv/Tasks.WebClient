import { Status } from "../models/enums/enum";

export const getStatusFromString = (statusString: string): Status => {
    switch (statusString) {
        case 'Pending':
            return Status.Pending;
        case 'Completed':
            return Status.Completed;
        default:
            throw new Error(`Invalid status: ${statusString}`);
    }
};
