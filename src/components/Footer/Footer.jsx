import Container from "../Wrapper/Container/Container";
import styles from "./footer.module.scss"
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {faFacebook, faInstagram, faTelegram} from "@fortawesome/free-brands-svg-icons";
import {faLocationCrosshairs} from "@fortawesome/free-solid-svg-icons";

function Footer() {
    return (
        <footer className={styles.footer}>
            <Container>
                <div className={styles.wrap}>
                    <ul className={styles.wrapRow}>
                        <li>
                            <span>Help</span>
                        </li>
                        <li>
                            <span>Contacts</span>
                        </li>
                        <li>
                            <span>Privacy terms</span>
                        </li>
                    </ul>
                    <ul className={`${styles.wrapRow} ${styles.hiddenRow}`}>
                        <li>
                            <span>About us</span>
                        </li>
                        <li>
                            <span>Partnership</span>
                        </li>
                        <li>
                            <span>Promotion</span>
                        </li>
                    </ul>
                    <ul className={styles.wrapRow}>
                        <li>
                            <FontAwesomeIcon icon={faInstagram} className={"mr-1"}/><span>Instagram</span>
                        </li>
                        <li>
                            <FontAwesomeIcon icon={faFacebook} className={"mr-1"}/><span>Facebook</span>
                        </li>
                        <li>
                            <FontAwesomeIcon icon={faTelegram} className={"mr-1"}/><span>Telegram</span>
                        </li>
                    </ul>
                    <ul className={`${styles.wrapRow} ${styles.hiddenRow}`}>
                        <li>
                            <span>iMarketPlace@gmail.com</span>
                        </li>
                        <li>
                            <span>+380681112233</span>
                        </li>
                        <li>
                            <FontAwesomeIcon icon={faLocationCrosshairs} className={"mr-1"}/><span>Our location</span>
                        </li>
                    </ul>
                </div>
            </Container>
        </footer>
    );
}

export default Footer;