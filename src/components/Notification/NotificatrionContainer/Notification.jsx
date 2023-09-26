import styles from './NotificationContainer.module.scss'
import NotificationItem from "../NotificationItem/NotificationItem";
import {useState} from "react";
import {useDispatch, useSelector} from "react-redux";
import {
    clearAll,
    clearNotifications,
    selectAppNotifications,
    selectUsersNotifications
} from "../../../store/slices/NotificationSlice";
import Container from "../../Wrapper/Container/Container";

function Notification(props) {
    const dispatch = useDispatch();
    const [isAppActive, setIsAppActive] = useState(false);

    const appNotifications = useSelector(selectAppNotifications);
    const usersNotifications = useSelector(selectUsersNotifications);


    const notifications = isAppActive ? "appNotifications" : "usersNotifications";

    const isClearActive = isAppActive ?
        !appNotifications.length :
        !usersNotifications.length;

    const handleClearButtonClick = () =>{
        if (isClearActive){
            return;
        }
        dispatch(clearNotifications({field: notifications}))
    }

    return (
            <div className={`${styles.notifications}`}>
                <div className={"w-full flex items-center justify-around"}>
                    <button className={`${styles.button} ${!isAppActive ? styles.activeFilter : ""}`} onClick={() =>
                        setIsAppActive(false)}>
                        Users
                    </button>
                    <span className={"border-r border-slate-600 rounded-lg h-10"}>
                </span>
                    <button className={`${styles.button} ${isAppActive ? styles.activeFilter : ""}`} onClick={
                        () => setIsAppActive(true)}>
                        App
                    </button>
                </div>
                <div className={"w-full text-center py-3"}>
                    <button className={`${styles.clearButton}`}
                            disabled={isClearActive} onClick={handleClearButtonClick}>
                        Clear all
                    </button>
                </div>
                <div className={styles.notificationItems}>
                    {isAppActive ?
                        <>
                            {appNotifications.length > 0 ?
                                [...appNotifications].reverse().map((notification, index) => (
                                    <NotificationItem
                                        key={index}
                                        createdAt={notification.createdAt}
                                        notificationType={notification.notificationType}
                                        index={index}
                                        text={notification.text}
                                        title={notification.title}
                                        type={notification.type}
                                    />
                                ))
                                :
                                <p className={"text-xl text-center text-slate-200 mt-10"}>No notifications</p>
                            }
                        </>
                        :
                        <>
                            {usersNotifications.length > 0 ?
                                [...usersNotifications].reverse().map((notification, index) => (
                                    <NotificationItem
                                        key={index}
                                        index={index}
                                        notificationType={notification.notificationType}
                                        message={notification.message}
                                        text={notification.text}
                                        user={notification.user}
                                        type={notification.type}
                                    />
                                ))
                                :
                                <p className={"text-xl text-center text-slate-200 mt-10"}>No notifications</p>
                            }
                        </>
                    }
                </div>
            </div>
    );
}

export default Notification;