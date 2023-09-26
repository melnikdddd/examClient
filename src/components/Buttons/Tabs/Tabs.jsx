import React from 'react';
import styles from "./Tabs.module.scss";

function Tabs(props) {
    const {boolean, setBoolean, optionA, optionB} = props;

    const handleTabsProfileClick = (event)=>{
        setBoolean(true);
    }
    const handleTabsProductsClick = (event)=>{
        setBoolean(false);
    }

    return (
        <ul className={styles.tabs}>
            <li className={`${styles.tabsItem} ${styles.left} 
                      ${boolean ? styles.tabsActive : ''}`}
                onClick={boolean ? ()=>{} : handleTabsProfileClick}>
                {optionA}
            </li>
            <li className={`${styles.tabsItem} ${styles.right} 
                      ${!boolean ? styles.tabsActive : ''}`}
                onClick={!boolean ? ()=>{} : handleTabsProductsClick}>
                {optionB}
            </li>
        </ul>
    );
}

export default Tabs;