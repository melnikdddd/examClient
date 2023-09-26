import styles from "../Card.module.scss"

function AuthCard(props){

    return(
        <div className={styles.Card}
             style={{height: props.height, width: props.width}}>
            {props.children}
        </div>
    )
}

export const HelperCard  = (props) => {
        return (
            <div className={`absolute ${styles.HelperCard}`} style={{height: props.height, marginLeft: props.right, top: props.top}}>
                {props.children}
            </div>
        )
}

export default AuthCard;