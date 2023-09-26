import React from "react";
import styles from "./AuthInput.module.scss"

function AuthInput(props){

    return (
        <input type={props.type} placeholder={props.placeholder}
               className={`${styles.input} ${props.classname}`}
               value={props.value} disabled={props.disabled} id={props.id}
               onChange={props.onChange}
               {...props.register} onBlur={props.onBlur} onFocus={props.onFocus} />
    )
}
export default AuthInput;