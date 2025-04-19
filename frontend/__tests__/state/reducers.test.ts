import {customerReducer} from "../../src/state/reducers";
import {Customer, CustomerAction} from "../../src/types";

describe('customerReducer', () => {
    test('should return the initial state', () => {
        const initialState: Customer[] = [];
        const action: CustomerAction = { type: undefined };
        const newState = customerReducer(initialState, action);
        expect(newState).toEqual(initialState);
    });

    test('should handle Set action', () => {
        const initialState: Customer[] = [];
        const action: CustomerAction = {
            type: "Set",
            customers: [
                { id: '1', firstName: 'John', lastName: 'Doe', vatId: '123' },
                { id: '2', firstName: 'Jane', lastName: 'Doe', vatId: '456' }
            ]
        };
        const newState = customerReducer(initialState, action);
        expect(newState).toEqual([
            { id: '1', firstName: 'John', lastName: 'Doe', vatId: '123' },
            { id: '2', firstName: 'Jane', lastName: 'Doe', vatId: '456' }
        ]);
    });

    test('should handle Add action', () => {
        const initialState: Customer[] = [
            { id: '1', firstName: 'John', lastName: 'Doe', vatId: '123' },
            { id: '2', firstName: 'Jane', lastName: 'Doe', vatId: '456' }
        ];
        const action: CustomerAction = {
            type: "Add",
            customer: { id: '3', firstName: 'Jim', lastName: 'Beam', vatId: '789' }
        };
        const newState = customerReducer(initialState, action);
        expect(newState).toEqual([
            { id: '1', firstName: 'John', lastName: 'Doe', vatId: '123' },
            { id: '2', firstName: 'Jane', lastName: 'Doe', vatId: '456' },
            { id: '3', firstName: 'Jim', lastName: 'Beam', vatId: '789' }
        ]);
    });

    test('should handle Update action', () => {
        const initialState: Customer[] = [
            { id: '1', firstName: 'John', lastName: 'Doe', vatId: '123' },
            { id: '2', firstName: 'Jane', lastName: 'Doe', vatId: '456' }
        ];
        const action: CustomerAction = {
            type: "Update",
            customer: { id: '1', firstName: 'John', lastName: 'Smith', vatId: '123' }
        };
        const newState = customerReducer(initialState, action);
        expect(newState).toEqual([
            { id: '1', firstName: 'John', lastName: 'Smith', vatId: '123' },
            { id: '2', firstName: 'Jane', lastName: 'Doe', vatId: '456' }
        ]);
    });

    test('should handle Delete action', () => {
        const initialState: Customer[] = [
            { id: '1', firstName: 'John', lastName: 'Doe', vatId: '123' },
            { id: '2', firstName: 'Jane', lastName: 'Doe', vatId: '456' }
        ];
        const action: CustomerAction = {
            type: "Delete",
            customer: {
                id: '1',
                firstName: "",
                lastName: "",
                vatId: ""
            }
        };
        const newState = customerReducer(initialState, action);
        expect(newState).toEqual([
            { id: '2', firstName: 'Jane', lastName: 'Doe', vatId: '456' }
        ]);
    })
});