import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {
    faCircleCheck,
    faCircleExclamation,
    faCircleInfo,
    faMessage,
    faTriangleExclamation,
    faXmark
} from "@fortawesome/free-solid-svg-icons";

import moment from "moment";
import styles from "./NotifiactionItem.module.scss"
import {useDispatch, useSelector} from "react-redux";
import {removeNotification, removePopupNotification} from "../../../store/slices/NotificationSlice";
import LoadingBar from "../../Loading/LoadingBar/LoadingBar";
import {useEffect, useState} from "react";
import UserAvatar from "../../Images/UserAvatar/UserAvatar";
import {selectChatId} from "../../../store/slices/ActiveChatSlice";
import {Link, useLocation, useNavigate} from "react-router-dom";
import {selectUserData} from "../../../store/slices/UserDataSlice";

function NotificationItem(props) {
    const dispatch = useDispatch();
    const {text, type, title, index, notificationType, createdAt, isPopup} = props;

    const location = useLocation();

    const activeChatId = useSelector(selectChatId);
    const ownerId = useSelector(selectUserData)._id;


    const {user, message, chatId} = props;


    if (type === "message") {
        if (location.pathname === `/users/${ownerId}/chats` || activeChatId === chatId) {
            dispatch(removeNotification({field: notificationType, value: index}))
            if (isPopup) {
                dispatch(removePopupNotification({field: "popupNotifications", value: index}))
            }
        }
    }


    const showedText = type === "message" ?
        message.text.length > 30 ?
        message.text.substring(0, 30) + "..." : message.text
        : text;

    const totalDuration = type === "message" ? 10000 : 5000;

    moment.updateLocale('en', {
        calendar: {
            lastDay: '[Yesterday at] HH:mm',
            sameDay: '[Today at] HH:mm',
            nextDay: '[Tomorrow at] LT',
            lastWeek: '[last] dddd  LT',
            nextWeek: 'dddd [at] LT',
            sameElse: 'L'
        }
    });

    const currentDate = moment(type === "message" ? message.timestamp : createdAt).calendar() || null;

    const [progress, setProgress] = useState(0);

    useEffect(() => {
        if (isPopup) {
            const step = (100 / totalDuration) * 100;
            const interval = setInterval(() => {
                if (progress < 100) {
                    setProgress(progress + step);
                    return;
                }
                clearInterval(interval);
                dispatch(removePopupNotification({value: index}))
            }, totalDuration / 100);

            return () => {

                clearInterval(interval);
            };
        }

    }, [progress]);


    const icons = {
        startMessage: {
            icon: faMessage,
            bg: "text-blue-500",
        },
        warning: {
            icon: faTriangleExclamation,
            bg: "text-yellow-500"
        },
        done: {
            icon: faCircleCheck,
            bg: "text-green-500",
        },
        inform: {
            icon: faCircleInfo,
            bg: "text-blue-500"
        },
        error: {
            icon: faCircleExclamation,
            bg: "text-red-500"
        },
    }

    const handleRemoveClick = (event) => {
        dispatch(removeNotification({field: notificationType, value: index}));
        if (isPopup) {
            dispatch(removePopupNotification({field: "popupNotifications", value: index}))
        }
    }


    return (
        <div className={`${styles.notificationItem} ${isPopup && styles.popup}`}>
            <div className={"right-0 top-0 w-full flex justify-end"}>
                <FontAwesomeIcon icon={faXmark} className={`${styles.closeButton} ${isPopup && styles.popupButton}`}
                                 onClick={handleRemoveClick}/>
            </div>
            <div className={'flex flex-col justify-between pb-5 px-4'}>
                <div className={"w-full flex justify-center"}>
                    {type === "message" ?
                        <div className={"flex flex-col items-center"}>
                            <UserAvatar image={user.userAvatar} isImageNeedDecoding={true} className={"h-12"}/>
                            <span className={"text-slate-600 text-lg"}>{`${user.firstname} ${user.lastname}`}</span>
                        </div>
                        :
                        <>
                            <span className={"text-xl font-bold mr-2"}>{title}</span>
                            <FontAwesomeIcon icon={icons[type].icon} className={`h-7 ${icons[type].bg}`}/>
                        </>
                    }
                </div>

                {showedText &&
                    <p className={"mt-3 text-center pb-3 break-words"}>{showedText}</p>
                }

                {type === "message" &&
                    <>
                        {type === "message" &&
                            <div className={"flex w-full justify-center mb-2"}>
                                <Link to={`/users/${ownerId}/chats`} className={"bg-blue-500 py-2 px-4 text-white text-center transition-colors hover:bg-blue-600 rounded-lg"}
                                      state={{
                                          isChatSelect: true,
                                          user: user
                                      }}>
                                    Show
                                </Link>
                            </div>
                        }
                    </>
                }

                {currentDate && !isPopup &&
                    <span className={"w-full text-right text-gray-400"}>{currentDate}</span>
                }

            </div>
            {isPopup &&
                <LoadingBar progress={progress}/>
            }

        </div>
    );
}

export default NotificationItem;