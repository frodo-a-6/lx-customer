import {useEffect} from "react";
import {NotificationStatus} from "../types";

type ToastProps = {
    status: NotificationStatus;
    text: string;
};

export const toastContainerId = 'toast-container';

const Toast = ({ status, text }: ToastProps) => {
    let iconClass ;
    switch (status) {
        case 'success':
            iconClass = "fa-circle-check text-green-500";
            break;
        case 'error':
            iconClass = "fa-circle-xmark text-red-500";
            break;
        default:
            iconClass = "fa-circle-info text-blue-500";
    }

    useEffect(() => {
        const timer = setTimeout(() => {
            const container = document.getElementById(toastContainerId);
            container?.remove();
        }, 5000);
        return () => clearTimeout(timer);
    }, []);

    return (
        <div
            className="fixed top-4 left-1/2 transform -translate-x-1/2 bg-white shadow-lg rounded-xl p-4 flex items-center gap-2 z-50"
        >
            <a className={`text-${status}-500 text-2xl fas ${iconClass}`} />
            <span>{text}</span>
        </div>
    );
};

export default Toast;