
function FormErrorMessage(props) {
    if (props.message){
        return (
            <div className={"h-3 my-1"}>
                    <p className={"text-red-500"}>{props.message || "Invalid field."}</p>
            </div>
        );
    }


    return (
        <div className={"h-3 my-1"}>
            {
                props.errorField &&
            <p className={"text-red-500"}>{props?.errorField?.message || "Invalid field."}</p>
            }
        </div>
    );
}

export default FormErrorMessage;