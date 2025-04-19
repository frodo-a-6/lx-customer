import React, {useState} from 'react';
import {Customer} from "../types";
import {labels} from "../constants/customerForm.ts";

type CustomerFieldProps = {
    fieldName: keyof Customer;
    customer: Customer | null;
    onChange: (value: string, fieldName: keyof Customer, onError: (error: string | null) => void) => void;
};
const CustomerField: React.FC<CustomerFieldProps> = ({
                                                         fieldName,
                                                         customer,
                                                         onChange
                                                     }) => {
    const [error, setError] = useState<string | null>(null);
    const onValueChange = (e: { target: { value: string; }; }) => onChange(e.target.value, fieldName, setError);
    return (
        <div className={"mb-4 tracking-wide overflow-x-hidden max-w-[50vw] w-[50vw] "}>
            <div
                className={`relative py-2 mt-2  items-center border rounded-md 
                ${error ? 'border-red-600' : 'border-neutral-400'}
                `}>
                <label
                    htmlFor={fieldName}
                    className={`absolute -top-3 left-0 text-md scale-75 ${error ? 'text-red-600' : 'text-neutral-400'} bg-white px-2`}
                >{labels[fieldName]}</label>
                <input
                    id={fieldName}
                    type="text"
                    defaultValue={customer?.[fieldName]}
                    onChange={onValueChange}
                    className={`w-full px-4 my-1 bg-transparent focus-visible:border-none focus-visible:outline-none text-md`}
                />
            </div>
            <div className={`mt-1 ${error ? 'text-red-600 text-xs' : 'hidden'}`}>{error}</div>
        </div>
    );
};

export default CustomerField;