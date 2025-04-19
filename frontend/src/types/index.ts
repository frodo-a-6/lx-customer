import {Dispatch} from "react";

export type Customer = {
    id?: string;
    firstName: string;
    lastName: string;
    address?: string;
    postalCode?: string;
    city?: string;
    details?: string;
    vatId: string;
}
export type CustomerAction = {
    type: "Set" | "Add" | "Update" | "Delete";
    customers?: Customer[];
    customer?: Customer;
}
export type CustomerContextType = {
    state: Customer[];
    dispatch: Dispatch<CustomerAction>;
};

export type NotificationStatus = "success" | "error" | "info";