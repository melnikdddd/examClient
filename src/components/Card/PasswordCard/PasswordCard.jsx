import React from 'react';
import styles from "../Card.module.scss"
import AuthInput from "../../Inputs/Auth/AuthInput";
import {useForm} from "react-hook-form";
import FormErrorMessage from "../../Message/FormErrorMessage";
import {fetchCheckPassword} from "../../../utils/Axios/axiosFunctions";

function PasswordCard(props) {
    const {
        formState: {
            errors,
            isValid,
        },
        register,
        setError,
        handleSubmit,
    } = useForm({mode: "onChange"});

    const onSubmit = async (data)=>{
        const flag = (await fetchCheckPassword(data.password));
        if (flag){
            props.setIsPasswordValid(true);
            return;
        }
        setError("password", {message: "Invalid password.", type: "validate"})
        props.setIsPasswordValid(false);
    }

    return (
            <form className={`$border-0 p-6 h-full w-full bg-white flex items-center justify-center rounded-b-lg`} onSubmit={handleSubmit(onSubmit)}>
                <div className={"w-72 h-72 flex p-5 flex-col items-center justify-center border border-gray-400  rounded-lg"}>
                    <h1 className={"text-2xl my-3"}>Enter your password</h1>
                    <AuthInput placeholder={"Password"} type={"password"} register={{
                        ...register("password", {
                            required:{
                                value: true,
                                message: "Field is required."
                            },
                            minLength: {
                                value: 8,
                                message: "Password too short."
                            },
                            maxLength: {
                                value: 15,
                                message: "Password too long."
                            },
                            pattern: {
                                value: /^(?=.*[a-z])(?=.*\d)(?=.*[A-Z]).+$/,
                                message: "Invalid password."
                            }
                        })
                    }}/>
                    <FormErrorMessage errorField={errors?.password}/>
                    <div className={"flex justify-center mt-6"}>
                        <button className={`rounded-lg bg-blue-500 text-white  cursor-pointer py-2 px-7 ${styles.submit}`}
                                disabled={!isValid}>
                            Continue
                        </button>
                    </div>

                </div>

            </form>
    );
}

export default PasswordCard;