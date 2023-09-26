export function convertObjectToString(obj) {
    const keys = Object.keys(obj);
    const lastIndex = keys.length - 1;
    let result = '';

    keys.forEach((key, index) => {
        result += key;

        if (index < lastIndex) {
            result += ', ';
        } else {
            result += '.';
        }
    });

    return result;
}
