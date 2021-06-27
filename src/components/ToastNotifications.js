import React, { useEffect, useState } from 'react';
import './ToastNotifications.scss';
import { useGlobalState } from 'state-pool';
import { Toast } from 'react-bootstrap';


function ToastNotifications(props) {
    const [show, setShow] = useState(false);
    const [notifications, updateNotifications] = useGlobalState("notifications");

    useEffect(() => {
        setShow(true);
    }, [notifications])

    let deleteNotification = (notification) => {
        return (e) => {
            setShow(false);
            updateNotifications( (notifications) => {
                return notifications.filter((n) => n !== notification)
            })
        }
    }

    return (
        <div class="toast-notifications">
            {notifications.map((notification) =>
                <Toast className="toast text-center" onClose={deleteNotification(notification)} show={show} delay={3000} autohide>
                    <Toast.Body>{notification}</Toast.Body>
                </Toast>
            )}
        </div>
    );
}

export { ToastNotifications }