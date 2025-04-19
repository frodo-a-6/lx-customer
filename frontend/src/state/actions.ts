import {Customer, CustomerAction} from "../types";

export const setCustomers = (customers: Customer[]): CustomerAction => ({
    type: "Set",
    customers,
});