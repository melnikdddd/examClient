import styles from "../Card.module.scss";
import {NavLink} from "react-router-dom";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {faCircleExclamation} from "@fortawesome/free-solid-svg-icons";

function ErrorCard(props) {

    return(
        <div className={"text-center " + styles.Card} style={{height: "400px", width : "450px"}}>
            {props.error === "Not found" &&
                <div className={"flex flex-col justify-around items-center w-full h-full"}>
                    <FontAwesomeIcon icon={faCircleExclamation} bounce className={"h-32"}/>
                    <h1 className={"text-3xl"}>404 Error. Page not found.</h1>
                    <NavLink className={"text-2xl cursor-pointer hover:text-white hover:bg-black transition-colors rounded p-4 underline"}
                             to={"/home"}>Go to home.
                    </NavLink>
                </div>
            }
        </div>
    );
}

export default ErrorCard;