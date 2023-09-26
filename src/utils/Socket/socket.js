import io from "socket.io-client";
import {addMessage, selectChatId} from "../../store/slices/ActiveChatSlice";
import {updateChatsInfo} from "../../store/slices/UserDataSlice";
import {pushNotification} from "../../store/slices/NotificationSlice";
import moment from "moment";


const Socket = class {

    createConnect = (user, dispatch) => {
        if (user) {
            this.socket = io.connect("http://localhost:8000");
            const {
                _id,
                userAvatar,
                firstname,
                lastname,
                isOnline,
                lastOnline,
                nickname
            } = user;


            const extractedUser = {
                _id,
                userAvatar,
                firstname,
                lastname,
                isOnline,
                lastOnline,
                nickname
            }


            this.socket.emit("userLoggedIn", extractedUser);

            window.addEventListener("beforeunload", () => {
                this.socket.disconnect();
            });

            this.socket.on("newMessage", data => {
                if (data.success === false) {
                    window.location.pathname = "/home";
                    dispatch(pushNotification(
                        {
                            field: "appNotifications",
                            value: {
                                title: "Error", type: "error", text: "Error message", createdAt: moment()
                            },
                        }
                    ));
                }
                dispatch(updateChatsInfo({data: data}));
                dispatch(addMessage({data: data}));
                if (data.message.sender !== _id) {

                    dispatch(pushNotification({
                        value: {
                            type: "message",
                            message: data.message,
                            user: data.user,
                        },
                        field: "usersNotifications"
                    }))
                }
            })
        }
    }
    closeConnect = () => {
        this.socket.disconnect();
    }
    sendMessage = (messageData) => {
        this.socket.emit("sendMessage", messageData);
    }
    readMessage = (userId, chatId) => {
        this.socket.emit("readChat", {userId, chatId});
    }
}

export default new Socket;