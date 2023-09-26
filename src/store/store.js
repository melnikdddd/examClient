import {combineReducers, createStore} from '@reduxjs/toolkit';

import AuthReducer from "./slices/AuthSlice";
import UserDataReducer from "./slices/UserDataSlice";
import NotificationReducer from "./slices/NotificationSlice";
import ActiveChatReducer from "./slices/ActiveChatSlice"

const rootReducer = combineReducers({
        auth: AuthReducer,
        userData: UserDataReducer,
        notification: NotificationReducer,
        activeChat: ActiveChatReducer,
});

const store = createStore(rootReducer);

export default store;


