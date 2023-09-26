import CenterWrapper from "../../../../components/Wrapper/CenterWrapper/CenterWrapper";
import {useDispatch, useSelector} from "react-redux";
import ChatListItem from "./ChatItem/ChatListItem";
import {selectChatId, setSelectedChat} from "../../../../store/slices/ActiveChatSlice";

function ChatsList(props) {
    const selectedChatId = useSelector(selectChatId);
    const {chatsInfo} = props;
    const dispatch = useDispatch();


    const selectChat = (user, chatId)=>{
        props.setIsChatSelected(true);
        dispatch(setSelectedChat({chatId: chatId, user: user}));
    }


    return (
        <div className={` h-full bg-slate-100 rounded-lg w-full ${props.className}  max-h-[678px]`}>
            {
                chatsInfo.length > 0 ?
                    <div className={"flex flex-col overflow-scroll  max-h-[678px]"}>
                        {
                            [...chatsInfo].sort((a,b)=>{
                                const timestampA = new Date(a.lastMessage.timestamp).getTime();
                                const timestampB = new Date(b.lastMessage.timestamp).getTime();

                                return timestampB - timestampA;
                            }).map((chat) => {
                                return (
                                    <ChatListItem
                                        key={chat.chatId}
                                        isSelected={selectedChatId === chat.chatId}
                                        user={chat.user}
                                        onClick={() => selectChat(chat.user, chat.chatId)}
                                        chatInfo={{lastMessage: chat.lastMessage, read: chat.read}}
                                    />

                                )
                            })
                        }
                    </div>
                    :
                    <CenterWrapper>
                        <h1 className={"w-full h-full max-h-[678px] text-2xl text-center p-5 text-gray-500 bg-slate-100"}>
                            No chats.
                        </h1>
                    </CenterWrapper>
            }
        </div>
    );
}

export default ChatsList;