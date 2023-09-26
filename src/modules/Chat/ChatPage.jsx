import BackGround from "../../components/Wrapper/BackGround/BackGround";
import Container from "../../components/Wrapper/Container/Container";
import {useEffect, useState} from "react";
import ChatsList from "./components/Chats/ChatsList";
import Chat from "./components/Chat/Chat";
import {useLocation} from "react-router-dom";
import useWindowDimensions from "../../components/hooks/useWindowDimensions";
import styles from "./ChatPage.module.scss"
import {useDispatch, useSelector} from "react-redux";
import {selectUserData, setUsersToChatInfo} from "../../store/slices/UserDataSlice";
import {useNavigate} from "react-router-dom";
import {clearChat, setSelectedChat} from "../../store/slices/ActiveChatSlice";
import CenterWrapper from "../../components/Wrapper/CenterWrapper/CenterWrapper";
import LoadingBlock from "../../components/Loading/LoadingBlock/LoadingBlock";
import {fetchUsersInChat} from "../../utils/Axios/axiosFunctions";
import {extractProperties} from "../../utils/ArrayFunctions";

function ChatPage(props) {
    const owner = useSelector(selectUserData);
    const chatsInfo = owner.chatsInfo;
    const location = useLocation();

    const dispatch = useDispatch();

    const innerWidth = useWindowDimensions().width;

    const [isChatSelected, setIsChatSelected] = useState(false);
    const [isShowBoth, setIsShowBoth] = useState(false)


    const [isLoading, setIsLoading] = useState(false);

    const getUsers = async () => {
        if (chatsInfo.length > 0) {
            const users = await fetchUsersInChat(owner._id, extractProperties(chatsInfo, ["userId"]));
            dispatch(setUsersToChatInfo({users: users}));
        }
        setIsLoading(true);
    }

    useEffect(() => {
        getUsers();
        if (location.state?.user) {
            loadingSelectChat(location.state?.user);
        }
        return () => {
            dispatch(clearChat());
        }
    }, []);

    const loadingSelectChat = (user) => {
        if (!user) {
            return;
        }


        const chat = owner.isChatsUsersSet ? owner.chatsInfo.find(chatInfo => chatInfo?.user._id === user._id)
            : owner.chatsInfo.find(chatInfo => chatInfo?.userId === user._id)

        const chatId = chat?.chatId || null;

        dispatch(setSelectedChat({chatId, user}));
        setIsChatSelected(true);
    };


    useEffect(() => {
        setIsShowBoth(innerWidth > 736);
    }, [innerWidth]);

    useEffect(()=>{
        getUsers();
    },[chatsInfo])




    if (!isLoading) {
        return (
            <BackGround background={"linear-gradient(111deg, rgba(27,102,122,1) 39%, rgba(112,201,119,1) 91%)"}>
                <Container>
                    <CenterWrapper>
                        <LoadingBlock className={"h-20"}/>
                    </CenterWrapper>
                </Container>
            </BackGround>
        )
    }


    return (
        <BackGround background={"linear-gradient(111deg, rgba(27,102,122,1) 39%, rgba(112,201,119,1) 91%)"}>
            <Container className={"pt-6"}>
                <div className={`w-full flex h-[85vh]`}>
                    <ChatsList
                        setIsChatSelected={setIsChatSelected} chatsInfo={owner.chatsInfo}
                        className={isShowBoth ? `${styles.showBoth} rounded-r-none border-r border-r-slate-400` :
                            `${isChatSelected && `hidden`}`}/>
                    <Chat
                        isShowBoth={isShowBoth} setIsChatSelected={setIsChatSelected}
                        className={isShowBoth ? `${styles.showBoth} rounded-l-none` :
                            `${!isChatSelected && `hidden`}`}/>
                </div>
            </Container>
        </BackGround>
    );
}

export default ChatPage;