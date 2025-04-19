import CustomerProvider from "./state/CustomerProvider.tsx";
import CustomerList from "./components/CustomerList.tsx";

const App = () => (
    <CustomerProvider>
        <CustomerList />
    </CustomerProvider>
);

export default App
