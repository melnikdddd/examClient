export const setDataToSearchParams = (data, searchParams, setSearchParams)=>{
    Object.keys(data).forEach((key) => {
        if (!data[key]) {
            searchParams.delete(key);
            setSearchParams(searchParams);
            return;
        }
        searchParams.has(key) ? searchParams.set(key, data[key]) : searchParams.append(key, data[key]);
        setSearchParams(searchParams);
    })
}

