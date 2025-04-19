import {NotificationStatus} from "../types";

type ToastProps = {
    status: NotificationStatus;
    title: string;
    description: string | null | object;
};

export const notificationContainerId = 'notification-container';

const Notification = ({ status, title, description }: ToastProps) => {
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

    const onClose = () => {
        const container = document.getElementById(notificationContainerId);
        container?.remove();
    };

    return (
        <div
            className="fixed top-4 right-4 bg-white shadow-lg rounded-xl p-4 z-50 max-w-96 cursor-pointer"
            onClick={onClose}
        >
            <h3 className={"font-semibold flex items-center gap-2"}><a className={`text-${status}-500 text-2xl fas ${iconClass}`} />{title}</h3>
            {description && <p className={"mt-2"}>{JSON.stringify(description)}</p>}
        </div>
    );
};

export default Notification;