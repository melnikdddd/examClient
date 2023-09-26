import {clearToken, setToken} from "../../store/slices/AuthSlice";
import {fetchUserByToken} from "../Axios/axiosFunctions";
import {clearUserData, setOwnerProducts, setUserData} from "../../store/slices/UserDataSlice";
import {
    clearAllNotifications, pushNotification, setAppNotifications,
    setUsersNotifications
} from "../../store/slices/NotificationSlice";
import Socket from "../Socket/socket";
import {clearChat} from "../../store/slices/ActiveChatSlice";
import moment from "moment";

export function checkIdentityValue(value) {
    const emailRegex = /^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/;
    const phoneNumberRegex = /^\+\d{12}$/;


    if (!value) {
        return {identityType: 'Email or phone number', regex: /^/, m: ""}
    }
    if (value.length > 2) {
        if (phoneNumberRegex.test(value) || /^\+\d{2,12}$/.test(value)) {
            return {identityType: "Phone number", regex: phoneNumberRegex, message: "Invalid phone number"};
        } else if (emailRegex.test(value) || /^[a-zA-Z0-9]{5}@/) {
            return {identityType: "Email", regex: emailRegex, message: "Invalid email"};
        }
    }
    return {identityType: 'Email or phone number', regex: /^/, message: ""}

}

export const initialIdentityValues = {
    regex: /^/,
    identityType: "Email or phone number",
    message: "",
}

export const setIdentityValue = (identityValue, {setRegex, setIdentityType, setMessage}) => {
    if (identityValue) {
        const {identityType, regex, message} = checkIdentityValue(identityValue);
        setIdentityType(identityType);
        setRegex(regex);
        setMessage(message)
        return;
    }
    setRegex(initialIdentityValues.regex);
    setIdentityType(initialIdentityValues.identityType);
    setMessage(initialIdentityValues.message);
}

export const colors = {
    0: "bg-orange-700",
    1: "bg-orange-500",
    2: "bg-green-300",
    3: "bg-green-500",
    4: "bg-green-700",
    white: "bg-white",
}

export const passwordRegex = {
    mainRegex: /^(?=.*[a-z])(?=.*\d)(?=.*[A-Z]).+$/,
    length: /^.{8,15}$/,
    latin: /^[^\u0400-\u04FF]+$/,

    checkOnRegex(regex, password) {
        if (password.length !== 0) {
            return regex.test(password) ? "text-green-700" : "text-red-700";
        }
        return "text-black";
    },
}

export const login = (dispatch, token, userData, products) => {
    dispatch(setToken(token));
    dispatch(setOwnerProducts({products: products}));
    dispatch(setUserData(userData));
    setMessageNotification(userData.chatsInfo, dispatch);


    Socket.createConnect(userData, dispatch);

    //setUserDataInLocalStorage(userData);
    window.localStorage.setItem('token', token);
}
export const logout = (dispatch) => {
    window.localStorage.removeItem("token");

    dispatch(clearToken());
    dispatch(clearUserData());
    dispatch(clearChat());
    dispatch(clearAllNotifications());


    Socket.closeConnect();
}

export const loginErrors = {
    401: {
        field: "password",
        options: {
            message: "Invalid password.",
            type: "validate",
        }
    },
    404: {
        field: "identity",
        options: {
            message: identityType => `Invalid ${identityType.toLowerCase()}.`,
            type: "validate"
        }
    },
    500: {
        field: "identity",
        options: {
            message: "Something going wrong, try later please.",
            type: "validate"
        }
    }

}

export const registrationErrors = {
    400: {
        field: "terms",
        options: {
            message: "Wrong fields. Try again please",
            type: "validation",
        }
    },
    409: {
        options: {
            message: (field, identityType) => {
                if (field === "identity") {
                    return `This ${identityType.toLowerCase()} already exists.`
                }
                return "This nickname already exists."
            },
            type: "validate",
        }
    },

    500: {
        field: "terms",
        options: {
            message: "Something going wrong. Try later please.",
            type: "validate",
        }
    },
    404: {
        field: "terms",
        options: {
            message: "Something going wrong. Try later please.",
            type: "validate",
        }
    }
}

export const errorHandler = (errorsType, status, setError, identityType, errorsFields = null) => {
    const errorData = errorsType[status];


    if (errorsFields) {
        for (const field of errorsFields) {
            if (typeof errorData.options.message === "function") {
                setError(field, {
                    message: errorData.options.message(field, identityType),
                    type: errorData.options.type,
                })
            } else {
                setError(field, errorData.options);
            }
        }
        return;
    }

    if (typeof errorData.options.message === "function") {
        setError(errorData.field, {
            message: errorData.options.message(identityType),
            type: errorData.options.type,
        })
        return;
    }

    setError(errorData.field, errorData.options);
}

export const getAuthResponseValues = (response) => {
    return {token: response.data.token, userData: response.data.user , products: response.data.products};
}

export const validateRepeatPassword = (repeatPassword, password) => {
    if (repeatPassword === password) {
        return true;
    } else {
        return 'Passwords must match.';
    }
};


let firstEffectFlag = true;
export const firstEffectEntry = async (dispatch, setIsLoading) => {
    const firstEffect = async () => {
        firstEffectFlag = false;
        const localStorage = window.localStorage;
        const token = localStorage.getItem('token');

        if (!token) {
            window.localStorage.removeItem('token');
            setIsLoading(true);
            return;
        }

        const {user, products} = await fetchUserByToken();
        if (!user) {
            localStorage.removeItem('token');
            setIsLoading(true);
            return;
        }
        const appNotifications = localStorage.getItem("appNotifications");
        const usersNotifications = localStorage.getItem("usersNotifications");

        if (appNotifications) {
            dispatch(setAppNotifications({users: JSON.parse(appNotifications)}));
        }
        if (usersNotifications) {
            dispatch(setUsersNotifications({users: JSON.parse(usersNotifications)}));
        }
        Socket.createConnect(user, dispatch);

        dispatch(setUserData(user))
        dispatch(setOwnerProducts({products: products}));
        dispatch(setToken(token));
        setMessageNotification(user.chatsInfo, dispatch);
        setIsLoading(true);
    }

    if (firstEffectFlag){
       await firstEffect()
    }

}


const setMessageNotification = (chatsInfo, dispatch) => {
    const unreadMessageCount = chatsInfo.reduce((count, chat) => {
        if (!chat.read) {
            return count + 1;
        }
        return count;
    }, 0);

    if (unreadMessageCount === 0){
        return;
    }

    dispatch(pushNotification({
        field: "usersNotifications",
        value: {
            title: "Messages", type: "startMessage", text: `You have ${unreadMessageCount} unread messages`, createdAt: moment()
        },
    }))
}