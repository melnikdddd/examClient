import React, {useEffect, useState} from 'react';
import AuthInput from "../../../../components/Inputs/Auth/AuthInput";
import styles from "./SecuritySetting.module.scss"
import {useForm} from "react-hook-form";
import {colors, logout, passwordRegex, validateRepeatPassword} from "../../../../utils/Auth/authFunctions";
import FormErrorMessage from "../../../../components/Message/FormErrorMessage";
import {fetchRemove, fetchUpdate} from "../../../../utils/Axios/axiosFunctions";
import {HelperCard} from "../../../../components/Card/AuthCard/AuthCard";

import zxcvbn from "zxcvbn";
import UserProfileInput from "../../../../components/Inputs/UserPofileInputs/UserProfileInput";
import {useDispatch, useSelector} from "react-redux";
import {selectUserData, updateValue} from "../../../../store/slices/UserDataSlice";
import {useNavigate} from "react-router-dom";
import {pushNotification} from "../../../../store/slices/NotificationSlice";
import moment from "moment/moment";
import LoadingButton from "../../../../components/Buttons/LoadingButton/LoadingButton";
import useWindowDimensions from "../../../../components/hooks/useWindowDimensions";

function SecuritySetting(props) {
    const navigate = useNavigate()
    const owner = useSelector(selectUserData);
    const dispatch = useDispatch();
    const id = owner._id;

    const innerWidth = useWindowDimensions().width;

    const [isPasswordFocus, setIsPasswordFocus] = useState(false);
    const [passwordReliability, setPasswordReliability] = useState("");
    const [firstEffect, setFirstEffect] = useState(true);
    const [isDirty, setIsDirty] = useState(false);
    const [isLoading, setIsLoading] = useState(false);

    const [removeAccMessage, setRemoveAccMessage] = useState("");
    const [isValidCurrentPassword, setIsValidCurrentPassword] = useState(false);

    const {
        formState: {
            isValid,
            errors,
            dirtyFields,
        },
        handleSubmit,
        register,
        watch,
        setError,
        reset,
    }
        = useForm({
        defaultValues: {
            password: "",
            repPassword: "",
            email: owner.email || "",
            phoneNumber: owner.phoneNumber || "",
        },
        mode: "onChange"
    });

    const email = watch("email");
    const phoneNumber = watch("phoneNumber")
    const password = watch("password");
    const handleRemoveAccountClick = async (event) => {
        event.preventDefault();
        const currentPassword = document.querySelector("#currentPassword").value;

        const response = await fetchRemove(`users/${id}`, {password: currentPassword})
        if (response.status === 401){
            setRemoveAccMessage("Invalid password");
            return;
        }
        dispatch(pushNotification({
            value: {
                title: "Success", type: "Warning", text: "Your profile has been removed.", createdAt: moment()
            },
            field: "appNotifications"
        }))

        logout(dispatch);
        navigate("home")
    }

    const resetData = (data) => {
        setIsLoading(false);
        dispatch(pushNotification({
            value: {
                title: "Success", type: "done", text: "Your data has been updated.", createdAt: moment()
            },
            field: "appNotifications"
        }))
        setFirstEffect(true);
        reset({password: "", repPassword: "", data});
    }

    useEffect(() => {
        if (firstEffect) {
            setFirstEffect(false);
            return;
        }
        if (password.length === 0) {
            setPasswordReliability(colors.white);
            return;
        }
        const score = zxcvbn(password).score;
        setPasswordReliability(colors[score]);
    }, [password]);

    useEffect(() => {
        Object.keys(dirtyFields).length > 0 ?
            setIsDirty(true) : setIsDirty(false);
    }, [email, phoneNumber, password]);

    const handleCurrentPasswordChange = (event) => {
        const currentPassword = event.target.value;
        setRemoveAccMessage("");

        if (currentPassword.length >= 8 && currentPassword.length <= 15
            && /^(?=.*[a-z])(?=.*\d)(?=.*[A-Z]).+$/.test(currentPassword)) {
            setIsValidCurrentPassword(true);
            return;
        }
        setIsValidCurrentPassword(false);
    }


    const onSubmit = async (data) => {
        setIsLoading(true);
        const formData = new FormData();

        if (data.repPassword) {
            delete data.repPassword;
        }

        for (const [key, value] of Object.entries(data)) {
            if (dirtyFields[key]){
                if (value) formData.append(key, value);
            }

        }
        const response = await fetchUpdate(`/users/${id}`, formData);

        if (response.success) {
            if (data.password) delete data.password;
            if (Object.entries(data).length > 0) {
                for (const [field, value] of Object.entries(data)) {
                    dispatch(updateValue({field, value}));
                }
                resetData(data);
            }
        }

        if (response.status === 409){
            setIsLoading(false);
            const errorFields = response.data.errorsFields;

            for (const field of errorFields){
               setError(field, {message: `This field already exists`, type: "validate"})
            }

        }
    }

    return (
        <form className={"flex flex-col w-full h-full pb-4"} onSubmit={handleSubmit(onSubmit)}>
            <div className={styles.wrap}>
                <div className={`${styles.block} ${styles.first}`}>
                    <h1 className={"text-2xl"}>Change password</h1>
                    <hr className={"bg-slate-800 w-full my-3"}/>
                    <div className={"flex flex-col w-full mt-10"}>
                        <label>New password.</label>
                        <AuthInput type={"password"} placeholder={"Password"} register={{
                            ...register('password',
                                {
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
                        }}
                                   onFocus={() => setIsPasswordFocus(true)}
                                   onBlur={() => setIsPasswordFocus(false)}
                        />

                        {isPasswordFocus && innerWidth > 1100 &&
                            <HelperCard height={"250px"}
                                        right={"250px"}
                            >
                                <div className={"flex justify-between items-center text-lg"}>
                                    <span>Reliability:</span>
                                    <span
                                        className={"border border-black rounded-3xl h-7 w-7 " + passwordReliability}></span>
                                </div>
                                <hr className={"mt-3 h-2"}/>
                                <ul>
                                    <li className={"my-3 " + passwordRegex.checkOnRegex(passwordRegex.mainRegex, password)}>
                                        Contain one capital letter, one small letter, one number.
                                    </li>
                                    <li className={"my-3 " + passwordRegex.checkOnRegex(passwordRegex.latin, password)}>
                                        Contain only latin letters.
                                    </li>
                                    <li className={"my-3 " + passwordRegex.checkOnRegex(passwordRegex.length, password)}>
                                        Contain at least 8 and no more than 15 characters.
                                    </li>
                                </ul>
                            </HelperCard>}
                        <FormErrorMessage errorField={errors?.password}/>

                    </div>
                    <div className={"flex flex-col w-full my-3"}>
                        <label>Repeat new password.</label>
                        <AuthInput register={{
                            ...register('repPassword', {
                                required: {
                                    value: !!password,
                                    message: "Field is required"
                                },
                                validate: (repeatPassword) => validateRepeatPassword(repeatPassword, password)
                            })
                        }} placeholder={"Repeat password"} type={"password"}/>
                        <FormErrorMessage errorField={errors?.repPassword}/>
                    </div>

                </div>
                <div className={`${styles.block} `}>
                    <h1 className={"text-2xl"}>Change email</h1>
                    <hr className={"bg-slate-800 w-full my-3"}/>
                    <div className={"flex flex-col w-full my-3"}>
                        <label>Email</label>
                        <UserProfileInput placeholder={owner.email || "Not indicated."} register={{
                            ...register("email", {
                                pattern: {
                                    value: /^[\w\.-]+@[a-zA-Z\d\.-]+\.[a-zA-Z]{2,}$/,
                                    message: "Invalid email.",
                                }
                            })
                        }}/>
                        <FormErrorMessage errorField={errors?.email}/>
                    </div>
                    <ul className={`list-disc text-gray-500 ${styles.listNone}`}>
                        <li className={"mt-3"}>Data about your account activity will be sent to this email.</li>
                        <li className={"mt-3"}>Login details will be changed.</li>
                        {owner.email &&
                            <li className={"mt-3"}>The old email will no longer be used.</li>
                        }
                    </ul>
                </div>
                <div className={`${styles.block} `}>
                    <h1 className={"text-2xl"}>Change phone number</h1>
                    <hr className={"bg-slate-800 w-full my-3"}/>
                    <div className={"flex flex-col w-full my-3"}>
                        <label>Phone number</label>
                        <UserProfileInput placeholder={owner.phoneNumber || "Not indicated."} register={{
                            ...register("phoneNumber", {
                                pattern: {
                                    value: /^\+\d{12}$/,
                                    message: "Invalid phone number"
                                }
                            })
                        }}/>
                        <FormErrorMessage errorField={errors?.phoneNumber}/>
                    </div>
                    <ul className={`list-disc text-gray-500 ${styles.listNone}`}>
                        <li className={"mt-3"}>Data about your account activity will be sent to this phone number.</li>
                        <li className={"mt-3"}>Login details will be changed.</li>
                        {owner.phoneNumber &&
                            <li className={"mt-3"}>The old phone number will no longer be used.</li>
                        }
                    </ul>
                </div>
                <div className={`${styles.block} `}>
                    <h1 className={"text-2xl"}>Remove account</h1>
                    <hr className={"bg-slate-800 w-full my-3"}/>
                    <div className={"w-full flex flex-col"}>
                        <label>Password</label>
                        <AuthInput id={"currentPassword"} type={"password"} classname={"w-full"}
                                   placeholder={"Current password"}
                                   onChange={handleCurrentPasswordChange}/>
                        <div className={"text-center"}>
                            <FormErrorMessage message={removeAccMessage}/>
                        </div>
                    </div>

                    <div className={"flex items-center w-full justify-center mt-4"}>
                        <button
                            className={`bg-red-500 p-2 rounded-lg transition-colors ${styles.removedButton}`}
                            onClick={handleRemoveAccountClick} disabled={!isValidCurrentPassword}>
                            Remove account
                        </button>
                    </div>
                    <ul className={`list-disc text-gray-500 ${styles.listNone}`}>
                        <li className={"mt-3"}>All data associated with your account, except for the history of
                            transactions and messages, will be deleted.
                        </li>
                        <li className={"mt-3"}>Once deleted, the account cannot be recovered.</li>
                    </ul>
                </div>
            </div>
            <div className={"w-full flex items-center justify-center mt-3"}>
                <div className={styles.buttonBlock}>
                    {isLoading ?
                        <LoadingButton/>
                        :
                        <button className={`rounded-lg bg-blue-500 text-white  cursor-pointer py-2 px-7 ${styles.submit}`}
                                disabled={!(isDirty && isValid)}>
                            Save
                        </button>
                    }
                </div>
            </div>
        </form>
    );
}

export default SecuritySetting;



