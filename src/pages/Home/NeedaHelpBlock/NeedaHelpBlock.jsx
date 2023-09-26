import React from 'react';
import Container from "../../../components/Wrapper/Container/Container";
import CenterWrapper from "../../../components/Wrapper/CenterWrapper/CenterWrapper";

import styles from "./style.module.scss";

function NeedaHelpBlock(props) {
    return (
        <div id={props.id} className={"bg-yellow-400 text-black  h-[70vh] w-full"}>
            <Container>
                <div className={"flex flex-col justify-around"}>
                    <div className={"flex justify-end mt-10"}>
                        <h1 className={"text-3xl"}>Need a help?</h1>
                    </div>
                    <CenterWrapper>
                        <div className={"flex flex-col items-center"}>
                            <div className={"mt-10"}>
                                <p className={"text-lg"}>Check the
                                    <span className={"font-bold"}> FAQ </span>
                                    or try <span className={"font-bold"}> call </span>
                                    the free customer support line 08.00 - 23.00 every day of the week.
                                </p>
                                <p className={"text-center text-lg"}>
                                    Our experts will be happy to help you, do not hesitate =)
                                </p>
                            </div>
                            <div className={styles.buttonWrap}>
                                <button className={`${styles.helpButton}`}>
                                    Frequently asked questions
                                </button>
                                <button className={`${styles.helpButton} `}>
                                    Free customer support
                                </button>
                            </div>
                        </div>
                    </CenterWrapper>
                </div>
            </Container>
        </div>
    );
}

export default NeedaHelpBlock;