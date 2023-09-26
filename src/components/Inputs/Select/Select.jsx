import styles from "./Select.module.scss"
function Select(props) {
    const { name, id, className, selectColor, onChange } = props;

    return (
        <select
            name={name}
            id={id}
            onChange={onChange}
            className={`${styles.select} ${className} ${
                selectColor &&
                `focus:ring-${selectColor}-500 focus:border-${selectColor}-500`
            }`}
            value={props.value}
        >
            {props.children}
        </select>
    );
}

export default Select;