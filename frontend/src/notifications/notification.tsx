import {createRoot} from 'react-dom/client';
import {NotificationStatus} from "../types";
import Notification, {notificationContainerId} from "../components/Notification.tsx";
import Toast, {toastContainerId} from "../components/Toast.tsx";
import {JSX} from "react";

const renderInto = (containerId: string, element: JSX.Element) => {
    let container = document.getElementById(containerId);
    if (container) container.remove();

    container = document.createElement('div');
    container.id = containerId;

    document.body.appendChild(container);
    const root = createRoot(container);
    root.render(element);
}

export const showNotification = (title: string, description: string | null | object, status: NotificationStatus = 'info') => {
    renderInto(notificationContainerId, <Notification status={status} title={title} description={description}/>);
}

export const showToast = (text: string, status: NotificationStatus = 'info') => {
    renderInto(toastContainerId, <Toast status={status} text={text}/>);

}