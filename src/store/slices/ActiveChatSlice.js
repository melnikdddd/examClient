import {createSlice} from "@reduxjs/toolkit";

const initialState = {
    messages: [],
    chatId: null,
    user: null,
}

const ActiveChatSlice = createSlice({
    name: "activeChat",
    initialState,
    reducers: {
        clearChat: (state, action) => {
            state.messages = [];
            state.chatId = null;
            state.user = null;
        },
        clearMessage: (state, action) => {
            state.messages = [];
        },
        loadMessages: (state, action) => {
            state.messages = action.payload.messages;
        },
        addMessage: (state, action) => {
            const {user, message, chatId} = action.payload.data;

            if (!state.user){
                return;
            }

            if (state.user._id === user._id){
                state.messages.push(message);
                if (state.chatId === null){
                    state.chatId = chatId;
                }
            }
        },
        setSelectedChat: (state, action) => {
            const {chatId, user} = action.payload;
            [state.chatId, state.user] = [chatId, user];
        }
    }
})

export const {
    clearChat,
    loadMessages,
    setSelectedChat,
    addMessage,
    clearMessage,
} = ActiveChatSlice.actions;

export const selectMessages = state => state.activeChat.messages;
export const selectChatId = state => state.activeChat.chatId;


export const selectChatUser = state => state.activeChat.user;

export default ActiveChatSlice.reducer;