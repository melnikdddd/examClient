import styles from "./ChatWindow.module.scss";
import moment from "moment";
import {useEffect, useRef} from "react";
import {useDispatch, useSelector} from "react-redux";
import {selectChatId, selectMessages} from "../../../../../store/slices/ActiveChatSlice";
import {readMessage} from "../../../../../store/slices/UserDataSlice";

function ChatWindow(props) {
    const {ownerId} = props;
    const messages = useSelector(selectMessages);
    const chatId = useSelector(selectChatId)

    const dispatch = useDispatch();

    const windowChatRef = useRef(null);

    const scrollToBottom = () => {
        if (windowChatRef.current) {
            windowChatRef.current.scrollTop = windowChatRef.current.scrollHeight;
        }
    }

    useEffect(() => {
        scrollToBottom();
    }, [messages.length]);


    return (
        <div className={"bg-slate-100 bg-opacity-40 w-full h-full overflow-auto min-h-[350px]"}
             ref={windowChatRef}>
            {
                messages.length > 0 &&
                <div className={"flex flex-col flex-wrap w-full  px-2 pt-0 pb-3"}>
                    {
                        [...messages].map((message, index) => {
                            const isOwnerMessage = message.sender === ownerId;

                            const positionClass = isOwnerMessage ? 'justify-end' : 'justify-start';
                            const messageClass = isOwnerMessage ? styles.ownerMessage : styles.userMessage;

                            return (
                                <div key={index} className={`w-full flex mt-3 ${positionClass}`}>
                                    <div className={`${styles.message} ${messageClass}`}
                                    >
                                        <p className={styles.timeStamp}>{moment(message.timestamp).calendar()}</p>
                                        <p>{message.text}</p>
                                    </div>
                                </div>
                            )
                        })

                    }
                </div>
            }

        </div>
    );
}

export default ChatWindow;