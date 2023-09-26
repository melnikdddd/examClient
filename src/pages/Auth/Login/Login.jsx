import {useForm} from "react-hook-form";

import {NavLink, useNavigate, useLocation} from "react-router-dom";
import {useEffect, useState} from "react";


import styles from "./Login.module.scss";
import textStyles from "../../../styles/textStyles.module.scss";


import {faGoogle, faTelegram} from "@fortawesome/free-brands-svg-icons";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";

import AuthButton from "../../../components/Buttons/AuthButton/AuthButton";
import AuthInput from "../../../components/Inputs/Auth/AuthInput";
import AuthCard from "../../../components/Card/AuthCard/AuthCard";
import FormErrorMessage from "../../../components/Message/FormErrorMessage";


import CenterWrapper from "../../../components/Wrapper/CenterWrapper/CenterWrapper";
import Container from "../../../components/Wrapper/Container/Container";
import BackGround from "../../../components/Wrapper/BackGround/BackGround";

import {setToken} from "../../../store/slices/AuthSlice";
import {useDispatch} from "react-redux";

import {fetchPost} from "../../../utils/Axios/axiosFunctions";
import {
    errorHandler,
    initialIdentityValues,
    loginErrors,
    login,
    setIdentityValue, getAuthResponseValues
} from "../../../utils/Auth/authFunctions";
import {setUserData} from "../../../store/slices/UserDataSlice";
import LoadingButton from "../../../components/Buttons/LoadingButton/LoadingButton";


function Login() {

    const [regex, setRegex] = useState(initialIdentityValues.regex);
    const [identityType, setIdentityType] = useState(initialIdentityValues.identityType);
    const [message, setMessage] = useState(initialIdentityValues.message);
    const [isLoading, setIsLoading] = useState(false);

    const navigate = useNavigate();
    const dispatch = useDispatch();

    const location = useLocation();
    const fromPage = location.state?.from?.pathname || '/home';
    

    const {
        register,
        formState: {
            errors,
            isValid,
        },
        handleSubmit,
        setError,
        watch,
    } = useForm({
        mode: "onChange"
    });



    const identityValue = watch('identity');
    const passwordValue = watch('password');


    useEffect(() => {
        setIdentityValue(identityValue, {setRegex, setIdentityType, setMessage});
    }, [identityValue])


    const onSubmit = async (data) => {
        setIsLoading(true);
        const identityT = identityType === "Email" ? 'email' : 'phoneNumber';
        const dataForSend = {
            [identityT]: identityValue.toLowerCase(),
            password: passwordValue,
        }

        const responseData = await fetchPost("/auth/login", dataForSend);

        if (responseData.success === false) {
            setIsLoading(false);
            errorHandler(loginErrors, responseData.status, setError, identityType);
            // errorHandler(loginErrors, responseData.status, setError, );
            return;
        }
        const {token, userData, products} = getAuthResponseValues(responseData);

        setIsLoading(false);
        login(dispatch, token, userData, products);
        navigate(fromPage);

    }

    return (
        <BackGround background={"linear-gradient(129deg, #008000, #6c93e8)"}>
            <Container>
                <CenterWrapper>
                    <AuthCard height={"590px"}>
                        <h1 className={textStyles.title}>
                            Sign in to your account.
                        </h1>
                        <form className={"w-full flex flex-col mb-3"} onSubmit={handleSubmit(onSubmit)}>
                            <div className={"mt-3 flex-1 flex flex-col"}>
                                <label form={"identity"}>{identityType}</label>
                                <AuthInput register={{
                                    ...register('identity',
                                        {
                                            required: "Field is required.",
                                            pattern: {value: regex, message: message}
                                        }
                                    )
                                }}
                                           placeholder={"Email or phone number"}/>
                                <FormErrorMessage errorField={errors?.identity}/>
                            </div>
                            <div className={"mt-3 flex-1 flex flex-col"}>
                                <label form={"password"}>Password</label>
                                <AuthInput register={{
                                    ...register('password',
                                        {
                                            required: "Field is required.",
                                            minLength: {
                                                value: 8,
                                                message: "Password too short."
                                            },
                                            maxLength: {
                                                value: 15,
                                                message: "Password too long."
                                            }
                                        })
                                }}
                                           placeholder={"Password"}
                                           type={"password"}/>
                                <FormErrorMessage errorField={errors?.password}/>
                            </div>
                            <div className={"w-full mt-5"}>
                                {isLoading ?
                                    <LoadingButton className={"px-0 w-full py-2 text-center"}/>
                                    :
                                    <AuthButton text={"Sign in"} disabled={!isValid}/>
                                }

                            </div>
                        </form>
                        <p className={"w-full text-center"}>Don’t have an account yet?
                            <NavLink to={'/auth/registration'}
                                     className={"text-blue-500 font-bold underline " + styles.registrationLink}>
                                <span> Sign Up.</span>
                            </NavLink>
                        </p>
                        <p className={"text-center mt-3"}>
                            <NavLink to={'/forgot'}
                                     className={"underline text-blue-500 font-bold " + styles.registrationLink}>
                                Сan't sign in?
                            </NavLink>
                        </p>

                        <div className={"flex items-center my-3"}>
                            <hr className={"mx-2 flex-grow bg-gray-200 h-0.5"}/>
                            <span className={"text-gray-700"}>or</span>
                            <hr className={"mx-2 flex-grow bg-gray-200 h-0.5"}/>
                        </div>
                        <div className={"flex flex-col w-full"}>
                            <NavLink to={'/auth/google'} className={"bg-green-600 " + styles.brandLink}>
                                <FontAwesomeIcon icon={faGoogle}></FontAwesomeIcon>
                                <span className={"ml-2"}>Continue with Google</span>
                            </NavLink>
                            <NavLink to={'/auth/telegram'} className={"mt-5 bg-blue-400 " + styles.brandLink}>
                                <FontAwesomeIcon icon={faTelegram}></FontAwesomeIcon>
                                <span className={"ml-2"}>Continue with Telegram</span>
                            </NavLink>
                        </div>
                    </AuthCard>
                </CenterWrapper>
            </Container>
        </BackGround>
    )
}

export default Login;