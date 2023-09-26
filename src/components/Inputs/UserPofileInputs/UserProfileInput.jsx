import styles from './UserProfileInput.module.scss';

function UserProfileInput(props) {
    const {placeholder, inputType} = props;

    if (!inputType || inputType === "text"){
        return (
            <input type={"text"}
                   placeholder={placeholder}
                   className={styles.profileInput}
                   {...props.register}/>

        );
    }
    if (inputType === "textarea"){
        return (
            <textarea placeholder={placeholder}
                      className={`${styles.profileInput} ${styles.textarea}`}
                      rows={1}
                      onInput={props.onInput}
                      {...props.register}>

            </textarea>
        )
    }



}

export default UserProfileInput;