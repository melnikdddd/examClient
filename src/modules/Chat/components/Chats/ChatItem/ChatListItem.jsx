import UserAvatar from "../../../../../components/Images/UserAvatar/UserAvatar";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {faCircle} from "@fortawesome/free-solid-svg-icons";


function ChatListItem(props) {
    const {user, chatInfo, isSelected} = props;

    const lastMessageText = chatInfo.lastMessage.text;

    const text = lastMessageText.length > 100 ? lastMessageText.substring(0, 97) + '...' : lastMessageText;

    return (
        <div
            className={`flex justify-between items-start border-b py-2 px-3 cursor-pointer border-slate-400 w-full transition-colors ${isSelected ? 'bg-slate-200' : "hover:bg-gray-200"}`}
            onClick={props.onClick}>
            <div className={"flex"}>
                {user._id === null ?
                    <UserAvatar image={user.userAvatar}
                                className={"w-20 h-20 min-w-[80px]"}
                    />
                    :
                    <UserAvatar image={user.userAvatar}
                                className={"w-20 h-20 min-w-[80px]"}
                                isImageNeedDecoding={true}
                    />
                }

                <div className={"flex flex-col ml-3"}>
                    <div>
                        <span className={"text-lg text-slate-700"}>{user.firstname + " " + user.lastname}</span>
                    </div>
                    <span className={"mt-1 text-slate-800"}>
                    {text}
                 </span>
                </div>
            </div>
            <div className={"flex flex-col h-full justify-center items-center"}>
                {!chatInfo.read &&
                    <FontAwesomeIcon icon={faCircle} className={"h-5 text-blue-400"}/>
                }
            </div>
        </div>);
}

export default ChatListItem;