import {useDispatch, useSelector} from "react-redux";
import {readMessage, selectUserData} from "../../../../store/slices/UserDataSlice";
import UserAvatar from "../../../../components/Images/UserAvatar/UserAvatar";
import moment from "moment";
import styles from "./Chat.module.scss"
import EmojiPicker from "../../../../components/EmojiPicker/EmojiPicker";
import {useEffect, useState} from "react";
import {useForm} from "react-hook-form";

import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {faPaperPlane, faFaceSmile, faList} from "@fortawesome/free-solid-svg-icons";
import useWindowDimensions from "../../../../components/hooks/useWindowDimensions";
import CenterWrapper from "../../../../components/Wrapper/CenterWrapper/CenterWrapper";
import {Link} from "react-router-dom";
import {fetchGet} from "../../../../utils/Axios/axiosFunctions";
import ChatWindow from "./ChatWindow/ChatWindow";
import LoadingBlock from "../../../../components/Loading/LoadingBlock/LoadingBlock";

import Socket from "../../../../utils/Socket/socket";
import {
    clearMessage,
    loadMessages,
    selectChatId,
    selectChatUser,
    selectMessages
} from "../../../../store/slices/ActiveChatSlice";

function Chat(props) {
    const owner = useSelector(selectUserData);
    const chatId = useSelector(selectChatId);
    const user = useSelector(selectChatUser);

    const {
        formState: {
            isValid
        },
        register,
        setValue,
        reset,
        watch,
        handleSubmit,
    } = useForm({mode: "onChange"})

    const dispatch = useDispatch();

    const [isEmojiShow, setIsEmojiShow] = useState(false);

    const messages = useSelector(selectMessages);

    const [isLoading, setIsLoading] = useState(false);

    const innerWidth = useWindowDimensions().width;
    const adaptiveWidth = props.isShowBoth ? 1015 : 525;
    const {isShowBoth} = props;
    const inputValue = watch("input");
    const chatInput = document.querySelector("#chatInput");


    useEffect(() => {
        const getMessages = async () => {
            const response = await fetchGet(`chats/${owner._id}/${chatId}`);
            if (response.success) {
                dispatch(loadMessages({messages: response.data.messages.messages}))
            }
        }

        if (chatId) {
            getMessages();
            Socket.readMessage(owner._id, chatId);
            dispatch(readMessage({chatId: chatId}));
        }
        setIsLoading(true);

    }, [chatId]);

    useEffect(() => {
        return () => {
            dispatch(clearMessage())
        };
    }, []);


    moment.updateLocale('en', {
        calendar: {
            lastDay: '[Yesterday at] HH:mm',
            sameDay: '[Today at] HH:mm',
            nextDay: '[Tomorrow at] LT',
            lastWeek: '[last] dddd  LT',
            nextWeek: 'dddd [at] LT',
            sameElse: 'L'
        }
    });

    const handleEmojiSelect = emoji => {
        setValue("input", inputValue + emoji.native, {shouldValidate: true})
    }
    const handleInputChange = (event) => {
        const textarea = event.target;
        textarea.style.height = 'auto';
        textarea.style.height = `${textarea.scrollHeight}px`;

        const parentBlock = document.querySelector("#chatWrap");

        parentBlock.scrollTop = parentBlock.scrollHeight - parentBlock.clientHeight;
    }
    const handleEmojiSmileLeave = () => {
        setIsEmojiShow(false);
    }

    const resetInput = () => {
        chatInput.style.height = "24px";
        reset();
    }

    const onSubmit = (data) => {
        const message = {
            sender: owner._id,
            text: data.input,
            timestamp: Date.now()
        };
        Socket.sendMessage({chatId: chatId, user: user, message: message});
        resetInput();
    }

    if (!user) {
        return <div
            className={`h-full bg-opacity-40 bg-white rounded-lg max-h-[678px] shadow-md w-full  ${props.className}`}>
            <CenterWrapper>
                <div className={"bg-white rounded-lg shadow-md p-10"}>
                    <h1 className={"text-xl2"}>
                        Select a user to start chatting.
                    </h1>
                </div>
            </CenterWrapper>
        </div>

    }

    return (
        <div className={"h-full flex-1 flex  flex-col justify-between max-h-[678px] overflow-auto "} id={"chatWrap"}>
            <div
                className={`h-20 p-5 max-h-[100px] rounded-lg rounded-b-none border-b border-slate-400 w-full flex items-center py-12 bg-slate-100 ${props.className} justify-between`}>
                {!isShowBoth &&
                    <FontAwesomeIcon icon={faList}
                                     onClick={() => props.setIsChatSelected(false)}
                                     className={"h-6 text-slate-600 p-2 border border-gray-400 rounded-lg cursor-pointer bg-slate-200 transition-colors hover:bg-slate-300"}
                    />
                }
                <div className={`flex items-center`}>
                    {user._id === null
                        ?
                        <UserAvatar image={user.userAvatar}
                                    className={"h-20 w-20"}
                                    isImageNeedDecoding={false}
                        />
                        :
                        <Link to={`/users/${user._id}`} className="col">
                            <UserAvatar image={user.userAvatar}
                                        className={"h-20 w-20"}
                                        isImageNeedDecoding={true}/>
                        </Link>
                    }

                    <div className="col ml-3">
                        <p>{user.lastname} {user.firstname}</p>
                        {
                            user._id !== null &&
                            <span className={"text-slate-400"}>
                                {
                                    user.isOnline ? "Online" : moment(user.lastOnline).calendar()
                                }
                            </span>
                        }

                    </div>
                </div>

            </div>
            {isLoading ?
                <ChatWindow messages={messages} ownerId={owner._id}/>
                :
                <div className={"bg-slate-100 bg-opacity-40 min-h-[50vh]"}>
                    <CenterWrapper>
                        <LoadingBlock className={"h-10 text-slate-200"}/>
                    </CenterWrapper>
                </div>
            }
            <div className={` ${styles.inputBlock} ${props.className}`}>

                {owner.blockedUsers.includes(user._id)
                    ?
                    <h1 className={"text-center"}>User is blocked</h1>
                    :
                    user._id === null ?
                        <h1 className={"text-center"}>User is Removed</h1>
                        :
                        <form className={"flex items-end"} onSubmit={handleSubmit(onSubmit)}>
                            <div className={`w-3/4 rounded-xl border border-gray-300 p-2 flex items-end rounded-b-xl`}>
                        <textarea placeholder={"Enter text..."}
                                  className={styles.chatInput}
                                  rows={1}
                                  id={"chatInput"}
                                  onInput={handleInputChange}
                                  {...register("input", {required: true})}
                        />
                                <div className={"relative"}>
                                    <FontAwesomeIcon icon={faFaceSmile}
                                                     className={`h-6 cursor-pointer ${isEmojiShow ? 'text-blue-500' : 'text-gray-400'}`}
                                                     onClick={() => setIsEmojiShow(!isEmojiShow)}
                                    />
                                    {
                                        isEmojiShow && <EmojiPicker
                                            adaptiveWidth={adaptiveWidth}
                                            top={"-450px"}
                                            left={innerWidth > adaptiveWidth ? "-320px" : "-160px"}
                                            handleEmojiSelect={handleEmojiSelect}
                                            onMouseLeave={handleEmojiSmileLeave}/>
                                    }
                                </div>
                            </div>
                            <div className={"w-1/4 flex items-center justify-center"}>
                                <button className={styles.submitButton} disabled={!isValid}>
                                    {innerWidth > adaptiveWidth ?
                                        <span>Message</span>
                                        :
                                        <FontAwesomeIcon icon={faPaperPlane}/>
                                    }
                                </button>
                            </div>
                        </form>
                }
            </div>
        </div>
    );
}

export default Chat;