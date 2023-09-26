export const extractProperties = (array, propertyName)=>{
    return array.map(obj => obj[propertyName]);

}