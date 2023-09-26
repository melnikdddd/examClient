import React, {useEffect, useState} from 'react';
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {faThumbsDown, faThumbsUp} from "@fortawesome/free-solid-svg-icons";
import styles from "./RatingBottons.module.scss"
import {useNavigate} from "react-router-dom";
import {fetchUpdate} from "../../../utils/Axios/axiosFunctions";

function RatingButtons(props) {
    const {rateObj, isAuth, isDisabled, ownerId, entity} = props;
    const navigate = useNavigate();


    useEffect(()=>{
        setLikesLength(rateObj.rating.likes.length || 0);
        setDislikesLength(rateObj.rating.dislikes.length || 0);
        setIstLiked(rateObj.rating.likes.includes(ownerId));
        setIsDisliked(rateObj.rating.dislikes.includes(ownerId));

    },[rateObj, isAuth, isDisabled, ownerId, entity])


    const [likesLength, setLikesLength] = useState(rateObj.rating.likes.length || 0);
    const [dislikesLength, setDislikesLength] = useState(rateObj.rating.dislikes.length || 0);


    const [isLiked, setIstLiked] = useState(rateObj.rating.likes.includes(ownerId));
    const [isDisliked, setIsDisliked] = useState(rateObj.rating.dislikes.includes(ownerId));

    const updateRating = async (ratingType, boolean) =>{
        const operation = boolean ? 'remove' : 'add';
        return  await fetchUpdate(`/${entity}/${rateObj._id}`,
            {userId: ownerId, listType: ratingType, operation: operation});
    }

    const handleLikeClick = async () =>{
        if (isAuth){
            setLikesLength(isLiked ? (likesLength - 1) : (likesLength + 1));
            setIstLiked(!isLiked);
            setDislikesLength(isDisliked ? dislikesLength - 1 : dislikesLength);
            setIsDisliked(false);
            const response = await updateRating('like', isLiked);
            return;
        }
        navigate("/auth/login", { state: {from: `${window.location.pathname}`}});
    }

    const handleDisLikeClick = async () =>{
        if (isAuth){
            setDislikesLength(isDisliked ? (dislikesLength - 1) : (dislikesLength + 1));
            setIsDisliked(!isDisliked);
            setLikesLength(isLiked ? likesLength - 1 : likesLength);
            setIstLiked(false);

            const response = await updateRating('dislike', isDisliked);
            return;
        }
        navigate("/auth/login", { state: {from: `${window.location.pathname}`}});

    }



    return (
        <div className={`${styles.wrap} ${props.className}`}>
            <button className={`${styles.ratingButton} ${styles.left} ${isLiked ? styles.clicked : ''}`}
                    disabled={isDisabled}
            onClick={handleLikeClick}>
                <FontAwesomeIcon icon={faThumbsUp} className={"h-7"}/>
                {likesLength}
            </button>
            <button className={`${styles.ratingButton} ${styles.right} ${isDisliked ? styles.clicked : ''}`} disabled={isDisabled}
            onClick={handleDisLikeClick}>
                 <FontAwesomeIcon icon={faThumbsDown} className={"h-7"}/>
                {dislikesLength}
            </button>
        </div>

    );
}

export default RatingButtons;