import Header from "../Header/Header";
import {Outlet} from "react-router";
import Footer from "../Footer/Footer";
import styles from "./Layout.module.scss"
import Notification from "../Notification/NotificatrionContainer/Notification";
import {useSelector} from "react-redux";
import {
    selectIsShowedNotifications,
} from "../../store/slices/NotificationSlice";
import PopupNotification from "../Notification/PopupNotification/PopupNotification";
import Container from "../Wrapper/Container/Container";
function Layout(){
    const isShowedNotifications = useSelector(selectIsShowedNotifications);

    return (
        <div className={styles.wrapper}>
            <Header/>
            <main className={styles.main}>
                <Container className={"flex justify-end  p-0 z-50"}>
                {isShowedNotifications ?
                    <Notification/>
                    :
                    <PopupNotification/>
                }
                </Container>
                <Outlet/>
            </main>
            <Footer/>
        </div>
    )
}

export default Layout;