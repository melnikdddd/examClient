import styles from "./BackGround.module.scss"
function BackGround(props) {
    return (
        <div  className={styles.backGround} style={{background: props.background}} >
            {props.children}
        </div>
    );
}

export default BackGround;