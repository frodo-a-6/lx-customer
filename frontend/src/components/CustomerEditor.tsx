import React, {useEffect, useState} from 'react';
import {Customer} from "../types";
import CustomerField from "./CustomerField.tsx";
import {customerKeys, validateFieldValue} from "../constants/customerForm.ts";
import {createCustomer, updateCustomer} from "../state/api.ts";
import {showNotification, showToast} from "../notifications/notification.tsx";
import Button from "./Button.tsx";

type CustomerEditorProps = {
    customer: Customer | null;
    onClose: () => void;
    onSave: () => void;
};

const CustomerEditor: React.FC<CustomerEditorProps> = ({customer, onClose, onSave}: CustomerEditorProps) => {
    const [dirtyCustomer, setDirtyCustomer] = useState<Customer | null>(null);
    const [errors, setErrors] = useState<Partial<Record<keyof Customer, string>>>({});
    const [loading, setLoading] = useState<boolean>(false);
    const [savable, setSavable] = useState<boolean>(false);

    useEffect(() => {
        const noErrors = Object.keys(errors).length === 0;
        const hasFirstName = !!dirtyCustomer?.firstName?.trim();
        const hasLastName = !!dirtyCustomer?.lastName?.trim();
        setSavable(noErrors && hasFirstName && hasLastName);
    }, [errors, dirtyCustomer]);


    const onValueChange = (
        value: string,
        fieldName: keyof Customer,
        onError: (error: (string | null)
        ) => void) => {
        if (!validateFieldValue(fieldName, value, onError, setErrors)) {
            return;
        }
        setDirtyCustomer(
            (prev) => ({
                ...customer,
                ...prev,
                [fieldName]: value.trim()
            }) as Customer);
    };
    const hasErrors = errors && Object.keys(errors).length > 0;
    return customer && (
        <div className={"flex-1 fixed inset-0 flex items-center justify-center bg-black/50 z-50"}>
            <div className={"bg-white p-6 rounded-md shadow-lg"}>
                <h2 className={"text-xl font-semibold mb-4"}>
                    {customer?.id ? "Kunde bearbeiten" : "Neuer Kunde"}
                </h2>
                {(customerKeys).map(fieldName => (
                    <CustomerField
                        key={fieldName}
                        fieldName={fieldName}
                        customer={customer}
                        onChange={onValueChange}/>))}
                {hasErrors && (
                    <div className="text-red-600">
                        Bitte überprüfen Sie die Eingabefelder.
                    </div>
                )}
                <div className={"flex flex-row gap-4 justify-between"}>
                    <Button
                        primary={false}
                        bordered={true}
                        onClick={() => {
                            setDirtyCustomer(null);
                            setErrors({});
                            onClose();
                        }}
                    >
                        Abbrechen
                    </Button>
                    <Button
                        primary={true}
                        bordered={true}
                        disabled={!savable || loading}
                        onClick={async () => {
                            if (dirtyCustomer) {
                                const apiAction = dirtyCustomer?.id
                                    ? updateCustomer
                                    : createCustomer;
                                await apiAction(
                                    dirtyCustomer,
                                    setLoading,
                                    (error) => {
                                        showNotification("Fehler beim Speichern", error, "error");
                                    },
                                    () => {
                                        showToast("Erfolgreich gespeichert", "success");
                                        setDirtyCustomer(null);
                                        setErrors({});
                                        onClose();
                                        onSave();
                                    }
                                )
                            }
                        }}
                    >
                        <><i className="fa-solid fa-check fa-xl mr-2"/>Speichern</>
                    </Button>
                </div>
            </div>
        </div>
    );
};

export default CustomerEditor;