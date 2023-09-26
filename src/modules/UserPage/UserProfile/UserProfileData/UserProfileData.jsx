import UserAvatar from "../../../../components/Images/UserAvatar/UserAvatar";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {faCircle, faEllipsisVertical, faGear, faLocationDot} from "@fortawesome/free-solid-svg-icons";
import {Link, NavLink} from "react-router-dom";
import LogoutButton from "../../../../components/Buttons/LogoutButton/LogoutButton";
import moment from "moment";
import styles from "./UserProfile.module.scss"
import RatingButtons from "../../../../components/Buttons/RatingButton/RatingButtons";
import {useEffect, useState} from "react";
import ProfileOptions from "../ProfileOptions/ProfileOptions";
import {convertObjectToString} from "../../../../utils/SomeFunctions";
import {isDisabled} from "@testing-library/user-event/dist/utils";

function UserProfileData(props) {
    const [showProfileOptions, setShowProfileOptions] = useState(false);
    const {user, owner, isOwner, isAuth, isBlocked, setIsBlocked} = props;

    const [data, setData] =
        useState({user, owner, isOwner, isAuth, isBlocked, setIsBlocked});


    useEffect(() => {
        setShowProfileOptions(false);
    }, []);

    useEffect(() => {
        setData({user, owner, isOwner, isAuth, isBlocked, setIsBlocked})
    }, [user, owner, isOwner, isAuth, isBlocked, setIsBlocked])

    const handleShowOptionsClick = () => {
        setShowProfileOptions(!showProfileOptions);
    }

    const handleProfileOptionsOnMouseLeave = () => {
        setShowProfileOptions(false);
    }

    const city = data.user.city ? data.user.city : "";
    const country = city ? ", " + data.user.country : data.user.country;

    const location = city || country ? city + country : "Not indicated.";

    const isOnline = isOwner ? true : !!data.user.isOnline;

    const productsType = data?.user?.productsType || {};

    const sells = Object.keys(productsType).length > 0 ?
        convertObjectToString(productsType) : "None"

    moment.updateLocale('en', {
        calendar: {
            lastDay: '[Yesterday at] HH:mm',
            sameDay: 'HH:mm',
            nextDay: '[Tomorrow at] LT',
            lastWeek: '[last] dddd  LT',
            nextWeek: 'dddd [at] LT',
            sameElse: 'L'
        }
    });

    const lastOnline = isOnline ? "Now" : moment(data.user.lastOnline).calendar();


    return (
        <div className={styles.wrapper}>
            <div className={styles.leftCard}>
                <UserAvatar image={data.user.userAvatar}
                            className={styles.userAvatar}
                            isOwner={data.isOwner}
                            isImageNeedDecoding={!data.isOwner}
                />
                <div className={`${styles.userText}`} style={{minWidth: "190px"}}>
                    <span className={"text-2xl flex-1 mr-0.5"}>{data.user.firstname} {data.user.lastname}</span>
                    <div>
                        <p className={"text-lg"}>{data.user.nickname}</p>
                        <span className={"text-base"}>
                            {isOnline ? "Online" : "Offline"}
                            <FontAwesomeIcon icon={faCircle}
                                             className={`${isOnline ? "text-green-600" : "text-slate-300"} ml-2`}/>
                    </span>
                    </div>
                </div>
                <div className={styles.buttonsWrap}>
                    <div className={styles.buttons}>
                        {isOwner ?
                            <>
                                <Link to={`/users/${user._id}/setting`}
                                      className={"bg-gray-300 p-2 rounded hover:bg-gray-400 transition-colors cursor-pointer"}>
                                    Setting
                                    <FontAwesomeIcon icon={faGear} className={"ml-1"}/>
                                </Link>
                                <LogoutButton className={"p-2 ml-2"}/>
                            </>
                            :
                            <>
                                {isBlocked ?
                                    <span className={"bg-gray-200 text-gray-600 p-2 rounded-lg"}>Message</span>
                                    :
                                    <Link to={ `/users/${owner._id}/chats`}
                                          state={{
                                              isChatSelect: true,
                                              user: data.user
                                          }}
                                          className={styles.messageLink}
                                          disabled={isBlocked}>
                                        Message
                                    </Link>
                                }

                                <FontAwesomeIcon icon={faEllipsisVertical}
                                                 className={`h-6 hover:text-blue-600 transition-colors cursor-pointer ml-7 ${showProfileOptions ? "text-blue-600" : ''}`}
                                                 onClick={handleShowOptionsClick}
                                />
                                {showProfileOptions &&
                                    <ProfileOptions onMouseLeave={handleProfileOptionsOnMouseLeave}
                                                    isAuth={data.isAuth}
                                                    user={data.user}
                                                    owner={data.owner}
                                                    isBlocked={data.isBlocked}
                                                    setIsBlocked={data.setIsBlocked}
                                                    className={styles.profileOptions}
                                    />
                                }
                            </>
                        }
                    </div>
                </div>

            </div>

            {isBlocked ?
                <div className={`${styles.rightCard} ${styles.blocked}`}>
                    <h1 className={"text-center text-2xl"}>{data.user.firstname} is blocked.</h1>
                </div>
                :
                <div className={styles.rightCard}>
                    <div className={"w-full p-4"}>
                        <p className={"text-slate-500"}>
                            Status:
                        </p>
                        <span className={"text-lg "}>
                        {data.user.userStatus ? data.user.userStatus : "Not indicated."}
                    </span>
                    </div>
                    <div className={"w-full p-4"}>
                        <p className={"text-slate-500"}>
                            Sells:
                        </p>
                        <span className={"text-lg "}>
                        {sells}
                        </span>
                    </div>
                    <div className={"w-full p-4"}>
                        <p className={"text-slate-500"}>
                            Deals:
                        </p>
                        <span className={"text-lg "}>
                        Purchase: {data.user.deals.purchase}
                    </span>
                        <span className={"text-lg ml-4"}>
                        Purchase: {data.user.deals.sales}.
                    </span>
                    </div>
                    <div className={"w-full p-4"}>
                        <p className={"text-slate-500"}>
                            Location <FontAwesomeIcon icon={faLocationDot}/>
                        </p>
                        <span className={"text-lg"}> {location}</span>
                    </div>
                    <div className={"w-full p-4"}>
                        <p className={"text-slate-500"}>
                            About me:
                        </p>
                        <span className={"text-lg break-words"}>
                        {data.user.aboutUser ? data.user.aboutUser : 'Not indicated.'}
                    </span>
                    </div>
                    <div className={styles.inform}>
                        <div className={styles.createdAtWrap}>
                            <p className={"text-slate-600 text-lg"}>Last active:</p>
                            <span className="text-slate-900 text-lg">
                            {lastOnline}
                        </span>
                        </div>
                        <RatingButtons rateObj={data.user}
                                       isAuth={data.isAuth}
                                       isDisabled={data.isOwner}
                                       ownerId={data.owner._id}
                                       entity={`users`}/>

                        <div className={styles.sinceWrap}>
                            <p className={"text-slate-600 text-lg"}>Since:</p>
                            <span className="text-slate-900 text-lg">
                        {moment(data.user.createdAt).format("DD-MM-YYYY")}
                        </span>
                        </div>
                    </div>
                </div>
            }
        </div>
    );
}


export default UserProfileData;