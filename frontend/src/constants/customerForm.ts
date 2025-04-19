import {Customer} from "../types";

export const labels: Record<keyof Customer, string> = {
    id: "ID",
    firstName: "Vorname *",
    lastName: "Nachname *",
    address: "Straße Nr.",
    postalCode: "PLZ",
    city: "Ort",
    details: "Details",
    vatId: "USt-IdNr.",
}

const validateRequired = (value: string, onError: (error: (string | null)) => void) => {
    if (!value.trim()) {
        onError("Dieses Feld ist ein Pflichtfeld");
        return false;
    }
    onError(null);
    return true;
};

const skip = () => true;

export const validators: Record<keyof Customer, ((value: string, onError: (error: string | null) => void) => boolean)> = {
    id: skip,
    firstName: validateRequired,
    lastName: validateRequired,
    address: skip,
    postalCode: skip,
    city: skip,
    details: (value: string, onError: (error: string | null) => void) => {
        if (value.length > 100) {
            onError(`${labels.details} dürfen maximal 100 Zeichen lang sein`);
            return false;
        }
        onError(null);
        return true;
    },
    vatId: (value: string, onError: (error: string | null) => void) => {
        if (value.length > 0 && !/^[A-Z]{2}/.test(value)) {
            onError(`Die ${labels.vatId} muss mit dem ISO-Ländercode beginnen`);
            return false;
        }
        if (value.length >= 2 && !/^(?:DE|AT|FR|GB|DK|NL)/.test(value)) {
            onError(`Es werden aktuell nur ${labels.vatId} aus Deutschland, Österreich, Frankreich, Großbritannien, Dänemark und den Niederlanden unterstützt`);
            return false;
        }
        if (value.length > 0 && !/^(?:DE\d{9}|ATU\d{8}|FR[A-Z0-9]{2}\d{9}|GB\d{9}|GB\d{12}|GB(GD|HA)[A-Z0-9]{3}\d{12}|DK\d{8}|NL\d{9}B\d{2})$/.test(value)) {
            onError(`${labels.vatId} ist ungültig`);
            return false;
        }
        onError(null);
        return true;
    },
}

export const customerKeys: Array<keyof Customer> = Object.keys({
    id: undefined,
    firstName: "",
    lastName: "",
    address: undefined,
    postalCode: undefined,
    city: undefined,
    details: undefined,
    vatId: ""
}).filter(key => key !== "id") as Array<keyof Customer>;

export const validateFieldValue = (
    fieldName: keyof Customer,
    dirtyValue: string,
    onError: (error: (string | null)) => void,
    setErrors: (value: (((prevState: Partial<Customer>) => Partial<Customer>) | Partial<Customer>)) => void) => {
    return validators[fieldName](dirtyValue, (error) => {
        onError(error);
        if (error) {
            setErrors((prevErrors) => ({
                ...prevErrors,
                [fieldName]: error
            }));
        } else {
            setErrors((prevErrors) => {
                const {[fieldName]: _, ...rest} = prevErrors;
                return rest;
            });
        }
    });
}