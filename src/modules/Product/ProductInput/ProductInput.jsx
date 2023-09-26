import styles from "./Product.module.scss"


function ProductInput(props) {
    const {className, placeholder, inputType} = props;

    if (inputType === "textarea") {
        return (
            <textarea {...props.register}
                      placeholder={placeholder}
                      className={`${styles.input} ${styles.textarea} ${className}`}
            />
        );
    }

    return (
        <input {...props.register}
               placeholder={placeholder}
               type={inputType}
               className={`${styles.input} 
               ${className}`}
        />
    );
}

export default ProductInput;