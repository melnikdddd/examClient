import {Link, NavLink, useLocation} from "react-router-dom";
import styles from "./header.module.scss"
import Container from "../Wrapper/Container/Container";
import {useDispatch, useSelector} from "react-redux";
import {selectIsAuth} from "../../store/slices/AuthSlice";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {faUser} from "@fortawesome/free-solid-svg-icons/faUser";
import {faBell} from "@fortawesome/free-solid-svg-icons/faBell";
import {selectUserData} from "../../store/slices/UserDataSlice";
import {faBagShopping, faBars, faComments, faHouse, faShop, faUsers} from "@fortawesome/free-solid-svg-icons";
import {
    selectAppNotifications, selectIsShowedNotifications, selectUsersNotifications, setIsShowedNotification
} from "../../store/slices/NotificationSlice";
import {useEffect, useState} from "react";

function Header(props) {

    const location = useLocation()

    const isAuth = useSelector(selectIsAuth);
    const userData = useSelector(selectUserData);

    const dispatch = useDispatch();
    const isShowedNotifications = useSelector(selectIsShowedNotifications);

    const usersNotificationsCount = useSelector(selectUsersNotifications)?.length || 0
    const appNotificationsCount = useSelector(selectAppNotifications)?.length || 0


    const [isMenuOpen, setIsMenuOpen] = useState(false);


    useEffect(() => {
        dispatch(setIsShowedNotification({set: false}));
        setIsMenuOpen(false);
    }, [location]);

    useEffect(() => {
        setIsMenuOpen(false);
    }, [isShowedNotifications])


    return (<header className={styles.header}>
        <Container>
            <div className={styles.nav}>
                <div className="flex justify-between items-center ">
                    <FontAwesomeIcon icon={faBars}
                                     className={`${styles.dropDownMenuButton} ${isMenuOpen && styles.activeButton}`}
                                     onClick={() => setIsMenuOpen(!isMenuOpen)}
                    />
                    <NavLink to={"/home"} className={styles.logo}>
                        iMarketPlace
                    </NavLink>
                    <NavLink to={"/market"} className={`${styles.bigButton} ${styles.hideIcon} 
                        ${location.pathname === "/market" && styles.activeBigButton}`}>
                        Market
                    </NavLink>
                    <NavLink to={"/users"} className={`${styles.bigButton} ${styles.hideIcon} 
                        ${location.pathname === "/users" && styles.activeBigButton}`}>
                        Users
                    </NavLink>
                </div>
                {isAuth === true ? <div className={"flex justify-around items-center"}>

                    <NavLink to={`users/${userData._id}`} state={{isProfile: true}}
                             className={`${styles.hideIcon}`}>
                        <FontAwesomeIcon icon={faUser} className={`${styles.navigationIcon}
                                    ${location.pathname === `/users/${userData._id}` && styles.activeNavigationIcon}`}/>

                    </NavLink>
                    <NavLink to={`users/${userData._id}/chats`}>
                        <FontAwesomeIcon icon={faComments} className={`${styles.navigationIcon} 
                                    ${location.pathname === `/users/${userData._id}/chats` && styles.activeNavigationIcon}`}/>
                    </NavLink>
                    <div className={styles.notificationsBlock}>
                        <div className={"flex w-[50px] justify-around absolute z-0 mb-6 -ml-1"}>
                            <span
                                className={`${styles.messageCount} ${usersNotificationsCount === 0 && 'invisible'} bg-blue-400`}>
                                    {usersNotificationsCount}
                            </span>
                            <span
                                className={`${styles.messageCount} ${appNotificationsCount === 0 && 'invisible'} bg-orange-400`}>
                                    {appNotificationsCount}
                            </span>
                        </div>
                        <FontAwesomeIcon icon={faBell}
                                         className={`${styles.navigationIcon} ${isShowedNotifications ? styles.active : ""}`}
                                         onClick={() => dispatch(setIsShowedNotification({set: !isShowedNotifications}))}
                        />
                    </div>
                </div> : <Link to={"/auth/login"} className={styles.login}>Login</Link>}
            </div>
        </Container>
        {isMenuOpen && <div className={styles.dropDownMenu}>
            <ul className={"flex flex-col items-center"}>
                <li>
                    <Link to={'/home'} className={`${styles.dropDownMenuItem} mt-3`}>
                        <span className={"text-2xl text-slate-100"}>Home</span>
                        <FontAwesomeIcon icon={faHouse}
                                         className={styles.dropDownIcon}
                        />
                    </Link>
                </li>
                <li>
                    <Link to={'/market'} className={`${styles.dropDownMenuItem} mt-3`}>
                        <span className={"text-2xl text-slate-100"}>Market</span>
                        <FontAwesomeIcon icon={faShop}
                                         className={styles.dropDownIcon}
                        />
                    </Link>
                </li>
                <li>
                    <Link to={'/users'} className={`${styles.dropDownMenuItem} mt-3`}>
                        <span className={"text-2xl text-slate-100"}>Users</span>
                        <FontAwesomeIcon icon={faUsers}
                                         className={styles.dropDownIcon}
                        />
                    </Link>
                </li>

                {isAuth && <>
                    <li>
                        <Link to={`users/${userData._id}`} className={`${styles.dropDownMenuItem}`}>
                            <span className={"text-2xl text-slate-100"}>Profile</span>
                            <FontAwesomeIcon icon={faUser}
                                             className={styles.dropDownIcon}
                            />
                        </Link>
                    </li>
                </>}
            </ul>
        </div>}
    </header>);
}

export default Header;