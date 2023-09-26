import {useSelector} from "react-redux";
import { selectPopupNotifications} from "../../../store/slices/NotificationSlice";

import styles from "./PopupNiotification.module.scss"

import NotificationItem from "../NotificationItem/NotificationItem";
import notificationItem from "../NotificationItem/NotificationItem";

function PopupNotification(props) {
    const popupNotifications = useSelector(selectPopupNotifications);

    return (
        <div className={styles.popupContainer}>
            <div className={styles.popup}>
                {popupNotifications.length > 0 && (
                    popupNotifications.map((notification, index) => (
                        <NotificationItem
                            key={index}
                            index={index}
                            notificationType={notification.notificationType}
                            text={notification.text}
                            title={notification.title}
                            message={notification.message}
                            user={notification.user}
                            type={notification.type}
                            isPopup={true}
                        />
                    )))}
            </div>

        </div>
    );
}

export default PopupNotification;