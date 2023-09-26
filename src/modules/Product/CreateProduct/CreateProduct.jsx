import {useEffect, useRef, useState} from 'react';
import BackGround from "../../../components/Wrapper/BackGround/BackGround";
import Container from "../../../components/Wrapper/Container/Container";
import {useForm} from "react-hook-form";
import ProductInput from "../ProductInput/ProductInput";
import {fetchGet, fetchPost} from "../../../utils/Axios/axiosFunctions";
import Select from "../../../components/Inputs/Select/Select";
import ProductCover from "../../../components/Images/ProductCover/ProductCover";
import ProductImage from "../../../components/Images/ProductImage/ProductImage";

import styles from "./CreateProduct.module.scss"
import FormErrorMessage from "../../../components/Message/FormErrorMessage";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {faCheck} from "@fortawesome/free-solid-svg-icons";
import LoadingButton from "../../../components/Buttons/LoadingButton/LoadingButton";
import {useDispatch, useSelector} from "react-redux";
import {pushNotification} from "../../../store/slices/NotificationSlice";
import moment from "moment/moment";
import {useNavigate} from "react-router-dom";
import {pushProduct, selectUserData} from "../../../store/slices/UserDataSlice";
import {decodeBase64Image} from "../../../components/Images/utils";


function CreateProduct(props) {

    const defaultImage = process.env.PUBLIC_URL + "/DefaultProductImage.png";

    const ownerId = useSelector(selectUserData)._id;

    const {
        formState: {
            isValid,
            errors
        },
        register,
        clearErrors,
        handleSubmit,
        setError,
        setValue,
        watch,
    } = useForm({
        mode: "onChange",
        defaultValues: {
            productType: "None",
            productCover: defaultImage,
            characteristics: "",
            description: "",
            title: "",
        }
    })

    const dispatch = useDispatch();
    const navigate = useNavigate();

    const productCoverFileInput = useRef(null);

    const [firstEffect, setFirstEffect] = useState(true);

    const [isLoading, setIsLoading] = useState(false);


    const [productsType, setProductsType] = useState([]);

    const [uploadedProductCoverImage, setUploadedProductCoverImage] = useState(null);
    const [isProductCoverClear, setIsProductCoverClear] = useState(true)

    const [characteristicsLength, setCharacteristicsLength] = useState(0);
    const [descriptionsLength, setDescriptionsLength] = useState(0)


    const description = watch("description");
    const characteristics = watch("characteristics");
    const productCover = watch("productCover");

    const handleProductCoverClick = (event) => {
        if (productCoverFileInput.current) {
            productCoverFileInput.current.click();
        }
    }
    const handleProductCoverFileChange = (event) => {
        const file = event.target.files[0];
        setUploadedProductCoverImage(file);
        if (file) {
            const reader = new FileReader();
            reader.onloadend = () => {
                setValue("productCover", reader.result, {shouldDirty: true});
                setIsProductCoverClear(false);
                clearErrors("productCover")
            }
            reader.readAsDataURL(file);
        }

    }
    const handleSelectChange = (event) => {
        const selectedValue = event.target.value;

        if (selectedValue === "None") {
            setError("productType", {
                type: "validate",
                message: "You must select a type of product",
            })
        }
        const flag = selectedValue !== "None";
        setValue("productType", selectedValue, {shouldDirty: flag, shouldValidate: flag});

        if (flag) {
            clearErrors("productType");
        }
    }

    useEffect(() => {
        if (firstEffect) {
            setFirstEffect(false);
            return;
        }
        setDescriptionsLength(description.length);
    }, [description]);

    useEffect(() => {
        if (firstEffect) {
            setFirstEffect(false);
            return;
        }
        setCharacteristicsLength(characteristics.length);
    }, [characteristics]);

    useEffect(() => {
        if (firstEffect) {
            setFirstEffect(false);
            return;
        }

        if (!isProductCoverClear) {
            return;
        }

        setValue("productCover", defaultImage, {shouldDirty: false});

        if (productCoverFileInput.current) {
            productCoverFileInput.current.value = "";
        }


    }, [isProductCoverClear]);

    useEffect(() => {
        const getProductsTypes = async () => {
            const types = await fetchGet("/products/types")
            types.data.types[0] = "None";
            setProductsType(types.data.types);

        }
        getProductsTypes();

    }, []);

    const onSubmit = async (data) => {
        const errors = [];
        if (isProductCoverClear) {
            errors.push({
                name: "productCover",
                errorType: "validate",
                message: "Cover is required.",
            });
        }
        if (data.productType === "None") {
            errors.push({
                name: "productType",
                errorType: "validate",
                message: "You must select a type of product",

            });
        }
        if (errors.length) {
            errors.forEach(error => {
                setError(error.name, {type: error.errorType, message: error.message});
            })
            return;
        }
        setIsLoading(true);

        const {productCover, ...dataForSend} = data


        const formData = new FormData();


        formData.append("productCover", uploadedProductCoverImage);

        for (const [key, value] of Object.entries(dataForSend)) {
            if (dataForSend[key]) {
                if (value) formData.append(key, value);
            }
        }

        const response = await fetchPost("/products/", formData);


        const product = response.data.product;

        const imageData = product.data?.data || ''
        const image = imageData.length === 0 || !imageData ? '' : imageData;
        const ext = product.productCover?.ext || '';

        const {decodedImage} = decodeBase64Image(image, ext, productCover);

        product.productCover = decodedImage;


        dispatch(pushProduct({product: product}));

        if (response.data.success){
            dispatch(pushNotification({
                field: "appNotifications",
                value: {
                    title: "Success", type: "done", text: "You created product.", createdAt: moment()
                },

            }))
            navigate(`/users/${ownerId}`, {state: {isProfile : false}});
        }

        setIsLoading(false);
    }

    return (
        <BackGround background={"linear-gradient(160deg, #0093E9 0%, #80D0C7 100%)"}>
            <Container>
                <form className={styles.wrap} onSubmit={handleSubmit(onSubmit)}>
                    <div className={"text-center"}>
                        <h1 className={"text-2xl text-slate-700"}>Add your own product and start earning money.</h1>
                    </div>
                    <div className={`${styles.inputsWrap} items-start flex-col`}>
                        <label>Add product title, it will show up as your item's "name" when searching.</label>
                        <ProductInput inputType="text" placeholder={"Title"} className={"w-1/2 min-w-[310px]"}
                                      register={{
                                          ...register("title", {
                                              required: {
                                                  value: true,
                                                  message: "Title is required",
                                              },
                                              minLength: {
                                                  value: 5,
                                                  message: "Minimum 5 characters.",
                                              },
                                              maxLength: {
                                                  value: 40,
                                                  message: "Maximum 40 characters.",
                                              }
                                          })
                                      }}/>
                        <FormErrorMessage errorField={errors?.title}/>
                    </div>
                    <div className={`${styles.inputsWrap} flex-col`}>
                        <label>Choose a category for your product.</label>
                        <Select
                            name="category"
                            id="category"
                            className="w-1/3 mt-0 min-w-[310px] max-w-[350px]"
                            selectColor="green"
                            onChange={handleSelectChange}
                        >
                            {productsType.map((product, index) => (
                                <option key={index}>{product}</option>
                            ))}
                        </Select>
                        <FormErrorMessage errorField={errors?.productType}/>
                    </div>
                    <div
                        className={`${styles.inputsWrap}  items-center justify-around ${styles.imagesMediaWrap}`}>
                        <div className={"flex-col mt-3"}>
                            <label>
                                Add a cover to your product.
                            </label>
                            <ProductCover isChanged={true}
                                          image={productCover}
                                          className={"h-72 w-72"}
                                          onClick={handleProductCoverClick}
                                          setIsClicked={setIsProductCoverClear}
                                          isClicked={isProductCoverClear}

                            />
                            <FormErrorMessage errorField={errors?.productCover}/>

                            <input ref={productCoverFileInput}
                                   type="file"
                                   hidden={true}
                                   onInput={handleProductCoverFileChange}
                                   accept={".jpg,.jpeg"}
                            />
                        </div>
                        <div className={"flex-col mt-3"}>
                            <label>Don't forget to add images!</label>
                            <table>
                                <tbody>
                                <tr>
                                    <td>
                                        <ProductImage className={"w-24 h-24"} image={defaultImage}/>
                                    </td>
                                    <td>
                                        <ProductImage className={"w-24 h-24"} image={defaultImage}/>
                                    </td>
                                    <td>
                                        <ProductImage className={"w-24 h-24"} image={defaultImage}/>
                                    </td>
                                </tr>
                                <tr>
                                    <td>
                                        <ProductImage className={"w-24 h-24"} image={defaultImage}/>
                                    </td>
                                    <td>
                                        <ProductImage className={"w-24 h-24"} image={defaultImage}/>
                                    </td>
                                    <td>
                                        <ProductImage className={"w-24 h-24"} image={defaultImage}/>
                                    </td>
                                </tr>
                                <tr>
                                    <td>
                                        <ProductImage className={"w-24 h-24"} image={defaultImage}/>
                                    </td>
                                    <td>
                                        <ProductImage className={"w-24 h-24"} image={defaultImage}/>
                                    </td>
                                    <td>
                                        <ProductImage className={"w-24 h-24"} image={defaultImage}/>
                                    </td>
                                </tr>
                                </tbody>
                            </table>
                        </div>
                    </div>
                    <div className={`${styles.inputsWrap} justify-between ${styles.mediaWrap}`}>
                        <div className={"flex flex-col flex-1 items-center mt-3"}>
                            <label>
                                Describe your product in as much detail as possible.
                            </label>
                            <ProductInput placeholder={"Description..."}
                                          inputType={"textarea"}
                                          className={"min-h-[300px] w-full min-w-[310px] max-w-[450px]"}
                                          register={{
                                              ...register("description", {
                                                  required: {
                                                      value: true,
                                                      message: "Description is required."
                                                  },
                                                  minLength: {
                                                      value: 40,
                                                      message: "Minimum 40 characters."
                                                  },
                                                  maxLength: {
                                                      value: 1000,
                                                      message: "Maximum 1000 characters.",
                                                  }
                                              })
                                          }}
                            />
                            <span className={`mt-3 ${descriptionsLength >= 40 && "text-teal-700"}`}>
                                {
                                    descriptionsLength >= 40 ?
                                        !errors.description &&
                                        <>
                                            Done <FontAwesomeIcon icon={faCheck}/>
                                        </>
                                        :
                                        `At least ${40 - descriptionsLength} more characters.`
                                }
                            </span>
                            <FormErrorMessage errorField={errors?.description}/>
                        </div>
                        <div className={"flex flex-col flex-1 items-center mt-3"}>
                            <label>
                                Add characteristics to your product.
                            </label>
                            <ProductInput placeholder={"Characteristics..."} inputType={"textarea"}
                                          className={"min-h-[300px] w-full max-w-[450px] "}
                                          register={{
                                              ...register("characteristics", {
                                                  required: {
                                                      value: true,
                                                      message: "Characteristics is required."
                                                  },
                                                  minLength: {
                                                      value: 25,
                                                      message: "Minimum 25 characters."
                                                  },
                                                  maxLength: {
                                                      value: 1000,
                                                      message: "Maximum 1000 characters.",
                                                  }
                                              })
                                          }}
                            />
                            <span className={`mt-3 ${characteristicsLength >= 25 && "text-teal-700"}`}>
                                {
                                    characteristicsLength >= 25 ?
                                        !errors.characteristics &&
                                        <>
                                            Done <FontAwesomeIcon icon={faCheck}/>
                                        </>
                                        :
                                        `At least ${25 - characteristicsLength} more characters.`
                                }
                            </span>
                            <FormErrorMessage errorField={errors?.characteristics}/>
                        </div>
                    </div>
                    <div className={`${styles.inputsWrap} justify-center`}>
                        <div className={"pt-5 px-8 pb-9 bg-white rounded-lg "}>
                            <div className={"text-center"}>
                                <label className={"text-2xl "}>Price</label>
                            </div>
                            <div className={"mt-3"}>
                                <div className={"flex items-center"}>
                                    <ProductInput inputType={"number"}
                                                  className={"max-w-[100px]"}
                                                  register={{
                                                      ...register("price", {
                                                          required: {
                                                              value: true,
                                                              message: "Price is required."
                                                          },
                                                          pattern: {
                                                              value: /^-?\d+(\.\d+)?$/,
                                                              message: "Only numbers."
                                                          },
                                                          min: {
                                                              value: 0,
                                                              message: "Min price is 0.",
                                                          },
                                                          max: {
                                                              value: 5000000,
                                                              message: "Max  5 million.",
                                                          }
                                                      })
                                                  }}
                                    />
                                    <span className={"text-2xl ml-1"}>$</span>
                                </div>
                            </div>
                            <div className={"text-sm text-teal-700 mt-2"}>
                                <FormErrorMessage errorField={errors?.price}/>
                            </div>
                        </div>
                    </div>
                    <div className={"flex justify-center mt-10 w-full"}>

                        {isLoading ?
                            <LoadingButton className={" py-3 px-6 text-center text-white rounded "}/>
                            :
                            <button type={"submit"} disabled={(!isValid)}
                                    className={styles.submitButton}>
                                Submit
                            </button>
                        }


                    </div>
                </form>
            </Container>
        </BackGround>
    );
}

export default CreateProduct;