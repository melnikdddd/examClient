import styles from './CenterWrapper.module.scss'

function CenterWrapper(props) {
    return (
        <div className={styles.wrap}>
            {props.children}
        </div>
    );
}

export default CenterWrapper;