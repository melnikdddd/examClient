export function decodeBase64Image(data, ext, defaultImage = null) {
    const defImage = defaultImage ? defaultImage : process.env.PUBLIC_URL + "/user-avatar.png";


    if (!data || !ext) {
        return {decodedImage: defImage, isDefaultImage: true}
    }

    const base64 = arrayBufferToBase64(data);


    return {decodedImage: `data:image/${ext};base64,` + base64.toString('base64'), isDefaultImage: false}
}

export const defaultImage = () => {
    return {decodedImage: process.env.PUBLIC_URL + "/user-avatar.png", isDefaultImage: true};
}


export function arrayBufferToBase64(buffer) {
    const binary = String.fromCharCode.apply(null, buffer);
    return btoa(binary);
}