import {useEffect, useState} from "react";
import {useForm} from "react-hook-form";
import {useLocation, useNavigate} from "react-router-dom";

import zxcvbn from "zxcvbn"

import textStyles from "../../../styles/textStyles.module.scss"
import {validateRepeatPassword} from "../../../utils/Auth/authFunctions";

import styles from "./Registration.module.scss"


import AuthCard, {HelperCard} from "../../../components/Card/AuthCard/AuthCard";
import BackGround from "../../../components/Wrapper/BackGround/BackGround";
import Container from "../../../components/Wrapper/Container/Container";
import CenterWrapper from "../../../components/Wrapper/CenterWrapper/CenterWrapper";
import AuthInput from "../../../components/Inputs/Auth/AuthInput";
import AuthButton from "../../../components/Buttons/AuthButton/AuthButton";
import FormErrorMessage from "../../../components/Message/FormErrorMessage";
import Terms from "../../../components/Terms/Terms";

import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {faXmark} from "@fortawesome/free-solid-svg-icons";


import {fetchPost} from "../../../utils/Axios/axiosFunctions";
import {
    initialIdentityValues,
    setIdentityValue,
    colors,
    passwordRegex,
    errorHandler, registrationErrors,
    login, getAuthResponseValues
} from "../../../utils/Auth/authFunctions";

import {useDispatch} from "react-redux";

import LoadingButton from "../../../components/Buttons/LoadingButton/LoadingButton";
import useWindowDimensions from "../../../components/hooks/useWindowDimensions";

function Registration(){

    const [regex, setRegex] = useState(initialIdentityValues.regex);
    const [identityType, setIdentityType] = useState(initialIdentityValues.identityType);
    const [message, setMessage] = useState(initialIdentityValues.message);

    const [passwordReliability, setPasswordReliability] = useState("");
    const [firstEffect, setFirstEffect] = useState(true);

    const [isLoading, setIsLoading] = useState(false);

    const innerWidth = useWindowDimensions().width;

    const [isIdentityFocus, setIsIdentityFocus] = useState(false);
    const [isPasswordFocus, setIsPasswordFocus] = useState(false);

    const [showTerms, setShowTerms] = useState(false);

    const navigate = useNavigate();
    const location = useLocation();
    const fromPage = location.state?.from?.pathname || '/home';

    const dispatch = useDispatch();

    const {
        register,
        formState: { errors, isValid},
        handleSubmit,
        watch,
        setError,
        setValue,
    } = useForm({mode: "onChange"});



    const identityValue = watch('identity');
    const password = watch('password');
    const nickname = watch("nickname");

    useEffect(() => {
        if (firstEffect){
            setFirstEffect(false);
            return;
        }
        if (nickname.length > 0){
            if (!nickname.startsWith("@")){
                setValue("nickname", "@" + nickname);
            }
        }

    }, [nickname]);

    useEffect(() => {
        if (firstEffect){
            setFirstEffect(false);
            return;
        }
        if (password.length===0){
            setPasswordReliability(colors.white);
            return;
        }
        const score = zxcvbn(password).score;
        setPasswordReliability(colors[score]);
    },[password]);

    useEffect( ()=> {
        setIdentityValue(identityValue, {setRegex, setIdentityType, setMessage});
    },[identityValue]);

    const onSubmit = async (data) =>{
        setIsLoading(true);
        const identityT = identityType === "Email" ? "email" : "phoneNumber";
        const {identity, repeatPassword, terms, ...dataForSending} = data;
        dataForSending[identityT] = identity.toLowerCase();

        const responseData = await fetchPost("/auth/registration", dataForSending);

        if (responseData.success === false){

            const errorFields = responseData.status === 409 ? responseData.data.errorFields : "";

            errorHandler(registrationErrors, responseData.status, setError, identityType, errorFields);
            setIsLoading(false);
            return;
        }

        setIsLoading(false);
        const {token, userData} = getAuthResponseValues(responseData);
        login(dispatch, token, userData);
        navigate(fromPage);
    }


    const handleSpanClick = () => {
        setShowTerms(true);
    };
    const handleCloseClick = () =>{
        setShowTerms(false);
    }



    return (
        <BackGround background={"linear-gradient(90deg, #C33764, #1D2671)"}>
            <Container>
                    <CenterWrapper>
                    <AuthCard>
                        <h1 className={textStyles.title}>Sign up and join to our Marketplace.</h1>
                        <form onSubmit={handleSubmit(onSubmit)} className={"w-full flex flex-col mb-3"}>
                            <div className={"flex flex-col mt-3"}>
                                <label htmlFor={"identity"}>{identityType}</label>
                                <AuthInput register={{
                                    ...register("identity", {
                                        required: "Field is required.",
                                        pattern: {value: regex , message: message},
                                    })
                                }}
                                           onBlur={()=>  setIsIdentityFocus(false)}
                                           onFocus={() => setIsIdentityFocus(true)}
                                           placeholder={"Email or phone number"} />
                                <FormErrorMessage errorField={errors?.identity}/>
                                {innerWidth > 1050 && isIdentityFocus && <HelperCard  height={"200px"} right={"400px"} >
                                    <div>
                                        <div className={"mb-3 flex flex-col"}>
                                            <label>Email</label>
                                            <AuthInput disabled={true} value={"Example@mail.com"}/>
                                        </div>
                                        <div className={"mt-4 flex flex-col"}>
                                            <label>Phone number</label>
                                            <AuthInput disabled={true} value={"+380001112233"}/>
                                        </div>
                                    </div>
                                </HelperCard>}
                            </div>
                            <hr className={"my-3"}/>
                            <div className={"mt-3 flex-1 flex flex-col"}>
                                <label form={"firstname"}>Nickname</label>
                                <AuthInput register={{
                                    ...register('nickname', {
                                        required: "Field is required.",
                                        minLength: {
                                            value: 3,
                                            message: "Nickname too short."
                                        },
                                        maxLength:{
                                            value: 16,
                                            message: "Nickname too long."
                                        },
                                        pattern: {
                                            value: /^@[a-zA-Z0-9_@.]+$/,
                                            message: "Invalid nickname"
                                        }
                                    })
                                }} placeholder={"@Nickname"}/>
                                <FormErrorMessage errorField={errors?.nickname}/>
                            </div>
                            <hr className={"my-3"}/>
                            <div className={"flex-1 flex flex-col"}>
                                <label form={"firstname"}>Firstname</label>
                                <AuthInput register={{
                                    ...register('firstname', {
                                        required: "Field is required.",
                                        minLength: {
                                            value: 3,
                                            message: "Firstname too short."
                                        },
                                        maxLength:{
                                            value: 15,
                                            message: "Firstname too long."
                                        },
                                        pattern: {
                                            value: /^[A-Za-z]+$/i,
                                            message: "Only letters."
                                        }
                                    })
                                }} placeholder={"Firstname"}/>
                                <FormErrorMessage errorField={errors?.firstname}/>
                            </div>
                            <div className={"mt-3 flex-1 flex flex-col"}>
                                <label form={"lastname"}>Lastname</label>
                                <AuthInput register={{
                                    ...register('lastname',{
                                        required: "Field is required.",
                                        minLength: {
                                            value: 3,
                                            message: "Lastname too short."
                                        },
                                        maxLength:{
                                            value: 15,
                                            message: "Lastname too long."
                                        },
                                        pattern: {
                                            value: /^[A-Za-z]+$/i,
                                            message: "Only letters."
                                        }

                                    })
                                }} placeholder={"Lastname"}/>
                                <FormErrorMessage errorField={errors?.lastname}/>
                            </div>
                            <hr className={"my-3"}/>
                            <div className={"flex-1 flex flex-col"}>
                                <div className={"flex flex-col"}>
                                    <label htmlFor={"password"}>Password</label>
                                    <AuthInput register={{
                                        ...register('password', {
                                            required: "Field is required.",
                                            maxLength: {
                                                value: 15,
                                                message: "Password too long."
                                            },
                                            minLength: {
                                                value: 8,
                                                message: "Password is too short"
                                            },
                                            pattern: {
                                                value: /^(?=.*[a-z])(?=.*\d)(?=.*[A-Z]).+$/,
                                                message: "Invalid password."
                                            }
                                        })
                                    }}
                                               onFocus={()=> setIsPasswordFocus(true)}
                                               onBlur={()=> setIsPasswordFocus(false)}
                                               placeholder={"Password"} type={"password"}/>

                                    <FormErrorMessage errorField={errors?.password}/>

                                    {isPasswordFocus &&
                                        <HelperCard height={"250px"} top={innerWidth < 1050 && "350px"} right={innerWidth > 1050 && "400px"}>
                                           <div className={"flex justify-between items-center text-lg"}>
                                               <span>Reliability:</span>
                                               <span className={"border border-black rounded-3xl h-7 w-7 " + passwordReliability}></span>
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
                                </div>
                                <div className={"flex flex-col"}>
                                    <label className={"mt-3"}>Repeat password</label>
                                    <AuthInput register={{
                                        ...register('repPassword',{
                                            required: "Field is required.",
                                            validate: (repeatPassword) => validateRepeatPassword(repeatPassword, password),
                                        })
                                    }} placeholder={"Repeat password"} type={"password"} />
                                    <FormErrorMessage errorField={errors?.repPassword}/>

                                </div>
                            </div>
                            <hr className={"my-3"}/>
                            <div className={"flex-1 flex flex-col"}>
                                <div className={"flex flex-row justify-around"}>
                                    <input type="checkbox" {...register('terms', {required: "This is required."})}/>
                                    <p>I accept the <span className={"text-blue-500 underline hover:text-black transition cursor-pointer"} onClick={handleSpanClick}>terms of the user agreement</span>.</p>
                                </div>
                                <FormErrorMessage errorField={errors?.terms}/>
                            </div>
                            <div className={"w-full mt-5"}>
                                {isLoading ?
                                    <LoadingButton className={"w-full py-2 text-center text-white rounded"}/>
                                    :
                                    <AuthButton text={"Sign up"} disabled={!isValid}/>
                                }
                            </div>
                        </form>
                    </AuthCard>
                        <div className={styles.terms}>
                            {showTerms && <Terms>
                                <FontAwesomeIcon icon={faXmark} className={"h-7 w-7 cursor-pointer bg-red-500 rounded hover:bg-red-400 transition-colors"}
                                onClick={handleCloseClick}/>
                            </Terms>
                            }
                        </div>
                    </CenterWrapper>
            </Container>
        </BackGround>
    )
}
export default Registration;