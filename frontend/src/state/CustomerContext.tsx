import {createContext, Dispatch} from "react";
import {Customer, CustomerAction, CustomerContextType} from "../types";

const CustomerContext = createContext<CustomerContextType>({
    state: [] as Customer[],
    dispatch: (() => {}) as Dispatch<CustomerAction>,
});

export default CustomerContext;