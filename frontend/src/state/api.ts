import {Customer} from "../types";

const API_BASE = process.env.REACT_APP_API_URL || "http://localhost:8080";
const API_URL = API_BASE + "/api/customers";

const doFetch = (requestUrl: string, requestParams: {
    method: string;
    headers: { "Content-Type": string };
    body: string
} | undefined, onError: (error: (string | null)) => void, onDispatch: (value: Customer[]) => void, onLoading: (loading: boolean) => void) => {
    console.log("API URL:", process.env.REACT_APP_API_URL);
    fetch(requestUrl, requestParams)
        .catch(reason => {
            onError(reason);
        })
        .then(response => {
            if (!response) {
                onError(null);
                return;
            }
            if (!response.ok) {
                response.json()
                    .catch(reason => {
                        onError(reason);
                    }).then((errorText) => {
                    onError(errorText);
                })
                return;
            }
            response.json()
                .catch(_ => {})
                .then((jsonResponse) => {
                    onDispatch(jsonResponse);
                });
        })
        .finally(() => {
            onLoading(false);
        })
};

export const fetchCustomerList = async (
    onLoading: (loading: boolean) => void,
    onError: (error: string | null) => void,
    onSuccess: (customers: Customer[]) => void) => {
    onLoading(true);
    doFetch(API_URL, undefined, onError, (customerList) => onSuccess(customerList as Customer[]), onLoading);
};

export const createCustomer = async (
    customer: Customer,
    onLoading: (loading: boolean) => void,
    onError: (error: string | null) => void,
    onSuccess: () => void) => {
    onLoading(true);
    doFetch(API_URL, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify(customer),
    }, onError, onSuccess, onLoading);
};

export const updateCustomer = async (
    customer: Customer,
    onLoading: (loading: boolean) => void,
    onError: (error: string | null) => void,
    onSuccess: () => void) => {
    onLoading(true);
    doFetch(`${API_URL}/${customer.id}`, {
        method: "PUT",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify(customer),
    }, onError, onSuccess, onLoading);
};

export const deleteCustomer = async (
    customer: Customer,
    onLoading: (loading: boolean) => void,
    onError: (error: string | null) => void,
    onSuccess: () => void) => {
    onLoading(true);
    doFetch(`${API_URL}/${customer.id}`, {
        method: "DELETE",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify(customer),
    }, onError, onSuccess, onLoading);
};