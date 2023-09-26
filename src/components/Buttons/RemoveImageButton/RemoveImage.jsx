import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {faTrash} from "@fortawesome/free-solid-svg-icons";
import {useEffect, useState} from "react";
import styles from "./RemoveImage.module.scss"

function RemoveImageButton(props) {

    const [isEnable, setIsEnable] = useState(true);
    const handleRemoveClick = () =>{
        if (isEnable){
            props.setIsClicked(true);
            setIsEnable(false);
        }

    }

    useEffect(() => {
       setIsEnable(!props.isClicked);
    }, [props]);



    return (
        <div className={`${styles.buttonWrap} ${isEnable ? 'cursor-pointer' : ''} group ${props.className}`} onClick={handleRemoveClick}>
            <FontAwesomeIcon icon={faTrash}
                             className={`${styles.button} ${!isEnable ? '@apply bg-gray-100 text-gray-600' : 
                                 'group-hover:bg-red-500 group-hover:text-black'}`} />
        </div>
    );
}

export default RemoveImageButton;