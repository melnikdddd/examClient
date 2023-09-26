import axios from "./axios"

export const fetchPost = async (path, data) => {
    try {
        const response = await axios.post(path, data);

        return {success: true, data: response.data};

    } catch (error) {
        const status = error.response?.status || 500;

        if (status === 500) {
            return {success: false, status}
        }

        return {success: false, status: status, data: error.response.data}
    }
}

export const getProduct = async (productId, ownerId) => {

    let patch = `products/${productId}`;
    if (ownerId) {
        patch += `?userId=${ownerId}`;
    }

    const response = await fetchGet(patch)

    if (response.success) {
        const data = response.data;


        return {PRODUCT: data.product, USER: data.owner}
    } else {
        return {PRODUCT: null, USER: null};
    }

}

export const fetchGet = async (path) => {
    try {
        const response = await axios.get(path);
        return {success: true, data: response.data};
    } catch (error) {
        const status = error.response?.status || 500;

        if (status === 500) {
            return {success: false, status: 500}
        }
        return {success: false, status: status}
    }
}
export const fetchUpdate = async (path, data) => {
    try {
        const response = await axios.patch(path, data, {
            headers: {
                'Content-Type': 'multipart/form-data',
            },
        });
        return {success: true, data: response.data};
    } catch (error) {
        const status = error.response?.status || 500;

        if (status === 500) {
            return {success: false, status: 500}
        }
        return {success: false, status: status, data: error.response.data};
    }
}
export const fetchUserByToken = async () => {
    try {
        const response = await axios.get(`users/getUserByToken`);
        const {user, products} = response.data

        if (!user) {
            return false;
        }
        return {user, products};

    } catch (error) {
        return false;
    }
}
export const fetchRemove = async (path, data = null) => {
    try {
        const response = await axios.delete(path, {data});
        return {success: true, data: response.data};
    } catch (error) {
        const status = error.response?.status || 500;

        return {success: false, status}
    }
}
export const fetchCheckPassword = async (password) => {
    try {
        const response = await axios.post("auth/checkPassword", {password});
        return response.data.success === true;

    } catch (error) {
        return false;
    }

}

export const fetchUsersInChat = async (ownerId, usersIds) => {
    const response = await fetchPost(`users/${ownerId}/chats`, {usersIds: usersIds});
    if (response.success) {
        return response.data.users;
    } else return false;
}
