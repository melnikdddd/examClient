import {createSlice} from "@reduxjs/toolkit";
import {decodeBase64Image} from "../../components/Images/utils";

const productCover = process.env.PUBLIC_URL + "/DefaultProductImage.png";
const removedImage = process.env.PUBLIC_URL + "/removedUser.png";


const initialState = {
    data: {
        _id: null,
        firstname: null,
        lastname: null,
        phoneNumber: null,
        email: null,
        aboutUser: null,
        createdAt: null,
        rating: null,
        lastOnline: null,
        userAvatar: null,
        deals: null,
        favoritesUsers: null,
        blockedUsers: null,
        city: null,
        country: null,
        isOnline: null,
        nickname: null,
        isDefaultImage: null,
        chatsInfo: null,
        isChatsUsersSet: false,
    },
    products: []
}


const UserDataSlice = createSlice({
    name: 'userData',
    initialState,
    reducers: {
        setUserData: (state, action) => {
            const {userAvatar, ...data} = action.payload;


            const imageData = action.payload.userAvatar?.data?.data || ''
            const image = imageData.length === 0 || !imageData ? '' : imageData;
            const ext = action.payload.userAvatar?.ext || '';

            const {decodedImage, isDefaultImage} = decodeBase64Image(image, ext);
            data.userAvatar = decodedImage;
            data.isDefaultImage = isDefaultImage;

            state.data = data;
        },
        clearUserData: (state, action) => {
            state.data = initialState.data;
            state.products = [];
        },
        updateValue: (state, action) => {
            state.data[action.payload.field] = action.payload.value;
        },
        clearValue: (state, action) => {
            state.data[action.payload.field] = null;
        },
        updateChatsInfo: (state, action) => {
            const {chatId, user, message} = action.payload.data;
            const chatsInfo = [...state.data.chatsInfo];

            const chatInfo = {
                chatId: chatId,
                user: user,
                read: user._id === state.data._id,
                lastMessage: {text: message.text, timestamp: message.timestamp}

            };


            if (chatsInfo.length > 0) {
                const chatIndex = chatsInfo.findIndex(chat => chat.chatId === chatId);

                if (chatIndex !== -1) {
                    state.data.chatsInfo[chatIndex].lastMessage = chatInfo.lastMessage;
                    return;
                }

                state.data.chatsInfo.push(chatInfo);
                return;
            }
            state.data.chatsInfo.push(chatInfo);
        },
        setUsersToChatInfo: (state, action) => {
            if (!state.data.isChatsUsersSet) {
                const {users} = action.payload;
                state.data.isChatsUsersSet = true;

                state.data.chatsInfo = replaceUserIdToUser(state.data.chatsInfo, users);
            }
        },
        readMessage: (state, action) => {
            const {chatId} = action.payload;
            if (!chatId) {
                return;
            }
            const updatedChatInfo = state.data.chatsInfo.map(chat => {
                if (chat.chatId === chatId) {
                    return {
                        ...chat,
                        read: true
                    };
                }
                return chat;
            });
            state.data.chatsInfo = updatedChatInfo;
        },
        pushProduct: (state, action) => {
            state.products.push(action.payload.product);
        },
        setOwnerProducts: (state, action) => {
            const products = action.payload.products;
            const length = products?.length || null;

            if (length === null || length === 0){
                return;
            }


            const updatedProducts = [];

            products.forEach(product => {
                const imageData = product?.productCover.data.data || ''
                const image = imageData.length === 0 || !imageData ? '' : imageData;
                const ext = product.productCover?.ext || '';


                const {decodedImage} = decodeBase64Image(image, ext, productCover);
                product.productCover = decodedImage;
                updatedProducts.push(product)
            });

            state.products = updatedProducts;

        },
        updateProduct: (state, action) => {
            const {product} = action.payload;

            const productIndex = state.products.findIndex(prod => prod._id === product._id);

            state.products[productIndex] = product;

        },
        removeProduct: (state, action) => {
            const productId = action.payload;

            state.products = state.products.filter(product => product._id !== productId);
        }
    }
});


export const setUserDataInLocalStorage = (userData) => {
    window.localStorage.setItem('userData', JSON.stringify(userData));
}
export const getUserDataFromLocalStorage = () => {
    return window.localStorage.getItem(JSON.parse('userData'));
}

const replaceUserIdToUser = (chatsInfo, users) => {
    const removedUser = {
        _id : null,
        firstname: "Removed",
        lastname: "Account",
        nickname: "Removed",
        userAvatar: removedImage,
        isRemoved: true
    }
    return chatsInfo.map(chatInfo => {
        if (chatInfo.hasOwnProperty("user")) {
            return chatInfo;
        }

        const user = users.find(user => {
            if (!user) return null;
            return user._id === chatInfo.userId;
        });
        const {userId, ...restChatInfo} = chatInfo;

        if (!user){
            return {...restChatInfo,user: removedUser};
        }

        return {
            ...restChatInfo,
            user: user
        };
    })
}


export const selectUserData = state => state.userData.data;
export const selectUserImage = state => state.userData.data.userAvatar;


export const selectUserProducts = state => state.userData.products;

export const {
    setUserData,
    updateValue,
    clearValue,
    pushProduct,
    clearUserData,
    updateChatsInfo,
    setUsersToChatInfo,
    readMessage,
    setOwnerProducts,
    updateProduct,
    removeProduct,
} = UserDataSlice.actions;


export default UserDataSlice.reducer;

