import {useCallback, useContext, useEffect, useState} from "react";

import CustomerContext from "../state/CustomerContext.tsx";
import {deleteCustomer, fetchCustomerList} from "../state/api.ts";
import {setCustomers} from "../state/actions.ts";
import {showNotification} from "../notifications/notification.tsx";
import {Customer} from "../types";
import {customerKeys, labels} from "../constants/customerForm.ts";
import CustomerEditor from "./CustomerEditor.tsx";
import Button from "./Button.tsx";

const onError = (error: string | null) => {
    showNotification("Fehler beim Laden der Kundendaten", error, "error");
};

const CustomerList = () => {
    const [loading, setLoading] = useState<boolean>(true);
    const [selectedCustomer, setSelectedCustomer] = useState<Customer | null>(null);
    const {state: customers, dispatch} = useContext(CustomerContext);
    const fetchCustomersCallback = useCallback(() => {
        fetchCustomerList(setLoading, onError, (customerList) => dispatch(setCustomers(customerList)))
    }, [dispatch]);

    useEffect(() => {
        fetchCustomersCallback();

        return () => dispatch(setCustomers([]));
    }, [dispatch]);
    return (
        <div className={"p-4"}>
            <h1 className={"font-bold text-[#333] text-[28px] mt-5 mb-4"}>Kunden</h1>
            <div className={"flex flex-row-reverse mb-4"}>
                <Button primary={true} onClick={() => {
                    setSelectedCustomer({
                        firstName: "",
                        lastName: "",
                    } as Customer);
                }}>
                    <i className={"fas fa-plus"}/> Neuer Kunde
                </Button>
            </div>
            <div className={"overflow-x-auto max-w-full"}>
                {!loading && customers.length === 0 && (<div>Bisher gibt es keine Kunden</div>)}
                {loading && (<div>Lade Kunden...</div>)}
                {!loading && customers.length > 0 && (
                    <table className={"table-auto w-full max-w-full text-sm text-left text-[#888]"}>
                        <thead className={"border-t-neutral-400 border-t"}>
                        <tr>
                            {customerKeys.map(fieldName => (
                                <th key={fieldName}
                                    className={"font-bold p-2 text-ellipsis overflow-x-hidden whitespace-nowrap"}>{labels[fieldName]?.replace("*", "")}</th>
                            ))}
                        </tr>
                        </thead>
                        <tbody>
                        {customers.map((customer) => (
                            <tr key={customer.id} className={"border-t-neutral-400 border-t hover:bg-white"}>
                                {customerKeys.map(fieldName => (
                                    <td key={fieldName}
                                        title={customer[fieldName]}
                                        className={"truncate p-2 text-ellipsis overflow-hidden whitespace-nowrap max-w-[12vw]"}>{customer[fieldName]}</td>
                                ))}
                                <td key={"edit"} className={"p-2"}>
                                    <Button
                                        bordered={false}
                                        onClick={() => {
                                            setSelectedCustomer(customer);
                                        }}
                                        primary={false}>
                                        <i className={"fas fa-pen"}/>
                                    </Button>
                                    <Button
                                        bordered={false}
                                        onClick={() => deleteCustomer(customer, setLoading, onError, fetchCustomersCallback)}
                                        primary={false}>
                                        <i className={"fas fa-trash"}/>
                                    </Button>
                                </td>
                            </tr>
                        ))}
                        </tbody>
                    </table>
                )}
            </div>
            <CustomerEditor customer={selectedCustomer}
                            onClose={() => setSelectedCustomer(null)}
                            onSave={() => fetchCustomerList(setLoading, onError, fetchCustomersCallback)}/>
        </div>
    );
};

export default CustomerList;