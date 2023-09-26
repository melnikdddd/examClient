import CardImage from "../../../components/Images/CardImage/CardImage";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {faThumbsDown, faThumbsUp} from "@fortawesome/free-solid-svg-icons";
import {Link} from "react-router-dom";
import styles from "./UserCard.module.scss"
import moment from "moment";


function UserCard(props) {
    const {_id, firstname, lastname, nickname, createdAt, deals, userAvatar, rating} = props.user;

    const since = moment(createdAt).format("DD.MM.YY");

    return (
        <Link className={styles.card} to={`/users/${_id}`}>
            <div className={"row flex justify-center border-b border-slate-400"}>
                <CardImage image={userAvatar} isImageNeedDecoding={true} className={"w-[210px] h-[210px]"}/>
            </div>
            <div className={"flex w-full flex-col  px-5"}>
                <div className={"flex justify-around mt-5 text-lg font-bold capitalize"}>
                    <span>{firstname}</span>
                    <span>{lastname}</span>
                </div>
                <div className={"flex justify-center"}>
                    <span>{nickname}</span>
                </div>
            </div>
            <div className={"px-5 flex justify-around w-full mt-3"}>
                <div className={"flex items-center  "}>
                    <FontAwesomeIcon icon={faThumbsUp} className={"h-5"}/>
                    <span className={"text-xl ml-2"}>{rating.likes.length}</span>
                </div>
                <div className={"flex items-center "}>
                    <FontAwesomeIcon icon={faThumbsDown} className={"h-5"}/>
                    <span className={"text-xl ml-3"}>{rating.dislikes.length}</span>
                </div>
            </div>
            <div className={"px-5 flex flex-col items-center mt-3 justify-between "}>
                <span className={"text-lg"}>
                    Success sales: {deals.sales}
                </span>
                <span className={"text-lg"}>
                    Since: {since}
                </span>
            </div>
        </Link>
    );
}

export default UserCard;