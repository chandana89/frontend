import { useContext } from "react";
import { NotificationContext } from "../../App";

export const NotificationsPage = () => {
    const context = useContext(NotificationContext);
    if (!context) return null;

    return (
        <div onClick={context.markAllAsRead}>
            <ul style={{ listStyle: 'none', padding: 0 }}>
                {context.notifications.map((notif, index) => (
                    <li key={index} style={{ borderBottom: '1px solid #eee', padding: '5px' }}>
                        <strong>{notif.title}</strong>
                        <p style={{ fontSize: '0.8rem' }}>{notif.body}</p>
                    </li>
                ))}
            </ul>
        </div>

    );
}
