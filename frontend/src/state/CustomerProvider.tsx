import React, {useReducer} from 'react';
import {customerReducer} from "./reducers.ts";
import CustomerContext from "./CustomerContext.tsx";
import {Customer} from "../types";

type CustomerProviderProps = {
    children: React.ReactNode;
};
const CustomerProvider: React.FC<CustomerProviderProps> = ({children}) => {
    const [state, dispatch] = useReducer(customerReducer, [] as Customer[]);
    return (
        <CustomerContext.Provider value={{state, dispatch}}>
            {children}
        </CustomerContext.Provider>
    );
};

export default CustomerProvider;