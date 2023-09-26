import {createSlice} from "@reduxjs/toolkit";
import {selectChatId} from "./ActiveChatSlice";

const initialState = {
    appNotifications: [],
    usersNotifications: [],
    isShowedNotification: false,
    popupNotifications: []
}

const localStorage = window.localStorage;


const NotificationSlice = createSlice({
    name: "notification",
    initialState,
    reducers: {
        pushNotification: (state, action) => {
            const {field, value} = action.payload;

            value.notificationType = field;
            state[field].push(value);

            state.popupNotifications.push(value);
            localStorage.setItem(field, JSON.stringify(state[field]));
        },
        removeNotification: (state, action) => {
            const {field, value} = action.payload;
            state[field].splice(value, 1);

            if (state[field].length) {
                localStorage.setItem(field, JSON.stringify(state[field]));
                return;
            }
            localStorage.removeItem(field);
        },
        removePopupNotification: (state, action) => {
            state.popupNotifications.splice(action.payload.value, 1);
        },
        clearNotifications: (state, action) => {
            const {field} = action.payload;
            state[field] = [];
            localStorage.removeItem(field);
        },
        clearAllNotifications: (state, action) => {
            state.usersNotifications = [];
            state.isShowedNotification = false;
            state.popupNotifications = [];
            state.appNotifications = [];

            localStorage.removeItem("appNotifications");
            localStorage.removeItem("usersNotifications");
        },
        setAppNotifications: (state, action) => {
            state.appNotifications = action.payload.app || [];
        },
        setUsersNotifications: (state, action) => {
            state.usersNotifications = action.payload.users;
        },
        setIsShowedNotification: (state, action) => {
            state.isShowedNotification = action.payload.set;

            if (state.isShowedNotification) {
                state.popupNotifications = [];
            }
        },
    },

})

export const selectIsShowedNotifications = state => state.notification.isShowedNotification;
export const selectAppNotifications = state => state.notification.appNotifications;
export const selectUsersNotifications = state => state.notification.usersNotifications;
export const selectPopupNotifications = state => state.notification.popupNotifications;


export const {
    pushNotification, removeNotification,
    clearNotifications, clearAllNotifications,
    setAppNotifications, setUsersNotifications,
    setIsShowedNotification, removePopupNotification,
    clearPopupNotification
} = NotificationSlice.actions;


export default NotificationSlice.reducer;