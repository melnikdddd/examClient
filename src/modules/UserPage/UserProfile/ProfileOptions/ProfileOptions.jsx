import {useNavigate} from "react-router-dom";
import {useDispatch} from "react-redux";
import React, {useState} from "react";
import {fetchUpdate} from "../../../../utils/Axios/axiosFunctions";
import {updateValue} from "../../../../store/slices/UserDataSlice";
import styles from "./ProfileOptions.module.scss"
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {faBan, faBookmark, faCircleExclamation} from "@fortawesome/free-solid-svg-icons";

function ProfileOptions(props){
    const {isAuth, owner, user, isBlocked, setIsBlocked} = props;
    const userId = user?._id;
    const ownerId = owner?._id;
    const navigate = useNavigate();


    const isFavoriteUser = isAuth ? owner.favoritesUsers.includes(userId)  : false;
    const isReportedUser = isAuth ? user.reports.includes(ownerId)  : false;


    const dispatch = useDispatch();

    const [isFavorites, setIsFavorites] = useState(isFavoriteUser);
    const [isReported, setIsReported] = useState(isReportedUser);



    const updateOwnerList = async (listType, boolean, set) =>{

        const operation = boolean ? "remove" : "add";
        let updatedArray = [...owner[listType]];


        if (!boolean) updatedArray.push(userId);
        else  updatedArray = updatedArray.filter(element => updatedArray === userId);

        dispatch(updateValue({field: listType, value: updatedArray}))
        set(!boolean);

        const {success} = await fetchUpdate(`/users/${owner._id}`,
            {userId: userId, listType: listType, operation: operation});

        if (!success){
            return false;
        }


    }
    const handleFavoriteClick = async ()=>{
        if (isAuth){
            await updateOwnerList("favoritesUsers", isFavorites, setIsFavorites);
            return;
        }
        navigate("/auth/login", { state: {from: `/users/${userId}`}});

    }
    const handleBlockClick = async ()=>{
        if (isAuth){
            await updateOwnerList("blockedUsers", isBlocked, setIsBlocked);
            return;
        }
        navigate("/auth/login", { state: {from: `/users/${userId}`}});
    }
    const handleReportClick = async ()=>{
        if (isAuth){
            setIsReported(true);
            user.reports.push(ownerId);
            const {success} = await fetchUpdate(`/users/${userId}`,
                {userId: ownerId, listType: "reports", operation: "add"});
            if (!success){
                alert(success)
                return;
            }
            return;
        }
        navigate("/auth/login", { state: {from: `/users/${userId}`}});
    }

    return (
        <ul className={`${styles.options} ${props.className}`}  onMouseLeave={props.onMouseLeave}>
            <li className={`${styles.optionItem} rounded-t-lg ${styles.favorite} ${isFavorites ? styles.clicked : ''}`} onClick={handleFavoriteClick}>
                <span>To favorites</span>
                <FontAwesomeIcon icon={faBookmark}/>
            </li>
            <li className={`${styles.optionItem} ${styles.block}  ${isBlocked ? styles.clicked : ''}`} onClick={handleBlockClick}>
                <span>Block</span>
                <FontAwesomeIcon icon={faBan}/>
            </li>
            <li className={`${styles.optionItem} ${styles.report} ${isReported ? styles.clicked : ''} `} onClick={isReported ? ()=>{} : handleReportClick}>
                <span>Report</span>
                <FontAwesomeIcon icon={faCircleExclamation} />
            </li>
        </ul>
    )
}

export default ProfileOptions;