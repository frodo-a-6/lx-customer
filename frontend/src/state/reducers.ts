import {Customer, CustomerAction} from "../types";

export const customerReducer = (state: Customer[], action: CustomerAction): Customer[] => {
    switch (action.type) {
        case "Set":
            return action.customers
                ? action.customers?.map(customer => ({...customer, type: undefined}))
                : state;
        case "Add":
            return action.customer
                ? [...state, action.customer]
                : state;
        case "Update":
            return state.map(customer =>
                customer.id === action.customer?.id
                    ? {...customer, ...action.customer}
                    : customer);
        case "Delete":
            return state.filter(customer => customer.id !== action.customer?.id);
        default:
            return state || [];
    }
}