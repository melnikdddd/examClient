import {useParams} from "react-router";
import {useDispatch, useSelector} from "react-redux";
import {removeProduct, selectUserData, updateProduct, updateValue} from "../../../store/slices/UserDataSlice";
import {Navigate, useNavigate} from "react-router-dom";
import {useEffect, useRef, useState} from "react";
import {fetchGet, fetchRemove, fetchUpdate, getProduct} from "../../../utils/Axios/axiosFunctions";
import BackGround from "../../../components/Wrapper/BackGround/BackGround";
import Container from "../../../components/Wrapper/Container/Container";
import LoadingBlock from "../../../components/Loading/LoadingBlock/LoadingBlock";
import CenterWrapper from "../../../components/Wrapper/CenterWrapper/CenterWrapper";
import {pushNotification} from "../../../store/slices/NotificationSlice";
import moment from "moment/moment";
import {useForm} from "react-hook-form";
import ProductCover from "../../../components/Images/ProductCover/ProductCover";
import Select from "../../../components/Inputs/Select/Select";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {faCheck} from "@fortawesome/free-solid-svg-icons";
import FormErrorMessage from "../../../components/Message/FormErrorMessage";
import ProductInput from "../ProductInput/ProductInput";

import styles from "./EditProduct.module.scss"
import LoadingButton from "../../../components/Buttons/LoadingButton/LoadingButton";
import {decodeBase64Image} from "../../../components/Images/utils";
import productCard from "../../../components/Card/ProductCatd/ProductCard";

const defaultImage = process.env.PUBLIC_URL + "/DefaultProductImage.png";


function EditProduct(props) {
    const dispatch = useDispatch();
    const navigate = useNavigate();

    const fileInputRef = useRef(null);


    const {id} = useParams();
    const ownerId = useSelector(selectUserData)._id;

    const [image, setImage] = useState("");
    const [uploadedImage, setUploadedImage] = useState(null);

    const [product, setProduct] = useState(null);

    const [isLoading, setIsLoading] = useState(false);
    const [isFormSending, setIsFormSending] = useState(false);


    const [descriptionsLength, setDescriptionsLength] = useState(product?.description.length || 0);
    const [characteristicsLength, setCharacteristicsLength] = useState(product?.characteristics.length || 0);

    const [productsType, setProductsType] = useState([]);

    const [isDirty, setIsDirty] = useState(false);


    const {
        register,
        formState: {
            errors,
            isValid,
            dirtyFields,
        },
        handleSubmit,
        setValue,
        watch,
        reset,
    }
        = useForm({
        mode: "onChange",
        defaultValues: {
            description: product?.description || "",
            characteristics: product?.characteristics || "",
            title: product?.title || "",
            productType: product?.title || "",
            price: product?.price || "",
            isCoverChange: false,
        }
    })


    const description = watch("description");
    const characteristics = watch("characteristics");
    const productType = watch("productType");
    const isCoverChange = watch("isCoverChange");

    const values = watch();

    const handleSelectChange = (event) => {
        setValue("productType", event.target.value, {shouldDirty: true});
    }

    const handleImageClick = (event) => {
        if (fileInputRef.current) {
            fileInputRef.current.click();
        }
    }

    const handleRemoveProduct = async () => {
        const response = await fetchRemove(`products/${id}`, {productType: productType});

        if (response.success === true){
            dispatch(pushNotification({
                value: {
                    title: "Success", type: "inform", text: "Your product has been removed.", createdAt: moment()
                },
                field: "appNotifications"
            }))
            dispatch(removeProduct({productId: product._id}));
            navigate(`/users/${ownerId}`, {state: {isProfileSelected : false}})
            return;
        }

        dispatch(pushNotification({
            value: {
                title: "Success", type: "error", text: "Try again later", createdAt: moment()
            },
            field: "appNotifications"
        }))

    }

    const handleFileChange = (event) => {
        setValue("isCoverChange", true, {shouldDirty: true});
        const file = event.target.files[0];
        setUploadedImage(file);
        if (file) {
            const reader = new FileReader();
            reader.onloadend = () => {
                setImage(reader.result)
            }
            reader.readAsDataURL(file);
        }
    }

    const onSubmit = async (data) => {
        setIsFormSending(true)
        const {isCoverChange, ...sendData} = data;

        const formData = new FormData();
        if (isCoverChange && uploadedImage) {
            formData.append("productCover", uploadedImage);
            formData.append("imageOperation", "replace");
        }
        formData.append("userId", product.owner);


        for (const [key, value] of Object.entries(sendData)) {
            if (dirtyFields[key]) {
                if (value) formData.append(key, value);
            }
        }

        const response = await fetchUpdate(`/products/${product._id}`, formData);
        setIsFormSending(false);
        if (response.success === true) {
            sendData.productCover = image;
            dispatch(updateProduct({product:sendData}));
            resetForm(sendData);
            return;
        }
        reset();
    }

    const resetForm = (newData) => {
        dispatch(pushNotification({
            field: "appNotifications",
            value: {
                title: "Success", type: "done", text: "Product has been updated.", createdAt: moment()
            },
        }));
        reset({isCoverChange: false, ...newData});
        setUploadedImage(null);
    }


    useEffect(() => {
        Object.keys(dirtyFields).length > 0 ?
            setIsDirty(true) : setIsDirty(false);
    }, [values]);

    useEffect(() => {
        setDescriptionsLength(description.length);
    }, [description]);

    useEffect(() => {
        setCharacteristicsLength(characteristics.length);
    }, [characteristics]);

    useEffect(() => {

        const getProductsTypes = async () => {
            const types = await fetchGet("/products/types")
            types.data.types.shift();
            setProductsType(types.data.types);
        }
        const setData = async () => {
            const {PRODUCT} = await getProduct(id, ownerId);

            if (!PRODUCT) {
                return;
            }

            const imageData = PRODUCT.productCover?.data.data || '';
            const image = imageData.length === 0 || !imageData ? '' : imageData;
            const ext = PRODUCT.productCover?.ext || '';

            const {decodedImage} = decodeBase64Image(image, ext, defaultImage);

            PRODUCT.productCover = decodedImage;

            setProduct(PRODUCT);



            await getProductsTypes();
            reset(PRODUCT);
            setImage(PRODUCT.productCover);
            setIsLoading(true);
        }

        setData();

    }, [])


    if (!isLoading) {
        return <BackGround background={"linear-gradient(160deg, #0093E9 0%, #80D0C7 100%)"}>
            <Container>
                <CenterWrapper>
                    <LoadingBlock className={"h-40 mt-20"}/>
                </CenterWrapper>
            </Container>
        </BackGround>

    }

    if (!product.owner || product.owner !== ownerId) {
        dispatch(pushNotification(
            {
                field: "appNotifications",
                value: {
                    title: "Error", type: "error", text: "Something going wrong", createdAt: moment()
                },
            }
        ));
        return <Navigate to={"/home"}/>
    }

    return (
        <BackGround background={"linear-gradient(160deg, #0093E9 0%, #80D0C7 100%)"}>
            <Container>
                <form onSubmit={handleSubmit(onSubmit)}
                      className={"my-6 bg-white p-10 rounded shadow-lg flex flex-col"}>
                    <h1 className={"text-3xl text-center mb-3"}>Edit product.</h1>
                    <div className={`flex justify-center`}>
                        <ProductCover image={image}
                                      className={"h-72 rounded-lg"}
                                      imageClassName={"rounded-lg"}
                                      isChanged={true}
                                      isRemoveButtonHidden={true}
                                      onClick={handleImageClick}
                        />
                        <input type="file"
                               hidden={true}
                               onInput={handleFileChange}
                               ref={fileInputRef}
                               accept={".jpg,.jpeg"}
                        />
                    </div>
                    <div className={`flex items-start justify-around mt-5 ${styles.flexCol768}`}>
                        <div className={"flex flex-col "}>
                            <label>Title</label>
                            <ProductInput placeholder={"Title"}
                                          className={"min-w-[310px]"}
                                          register={{
                                              ...register("title", {
                                                  required: {
                                                      value: true,
                                                      message: "Title is required."
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

                                          }}
                            />
                            <FormErrorMessage errorField={errors?.title}/>
                        </div>
                        <div className={"flex flex-col"}>
                            <label>Product type</label>
                            <Select className={"mt-0 min-w-[310px] h-[46px]"}
                                    onChange={handleSelectChange}
                                    value={productType}
                            >
                                {
                                    productsType.map((product, index) => (
                                        <option key={index}>
                                            {product}
                                        </option>
                                    ))
                                }
                            </Select>
                        </div>
                    </div>
                    <div className={`flex items center justify-around mt-5 ${styles.flexCol1100}`}>
                        <div className={"flex flex-col flex-1 items-center mt-3"}>
                            <label>
                                Description.
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
                                Characteristics.
                            </label>
                            <ProductInput placeholder={"Characteristics..."}
                                          inputType={"textarea"}
                                          className={"min-h-[300px] w-full min-w-[310px] max-w-[450px]"}
                                          register={{
                                              ...register("characteristics", {
                                                  required: {
                                                      value: true,
                                                      message: "Characteristics is required."
                                                  },
                                                  minLength: {
                                                      value: 25,
                                                      message: "Minimum 40 characters."
                                                  },
                                                  maxLength: {
                                                      value: 1000,
                                                      message: "Maximum 1000 characters.",
                                                  }
                                              })
                                          }}
                            />
                            <span className={`mt-3 ${characteristicsLength >= 40 && "text-teal-700"}`}>
                                {
                                    characteristicsLength >= 40 ?
                                        !errors.description &&
                                        <>
                                            Done <FontAwesomeIcon icon={faCheck}/>
                                        </>
                                        :
                                        `At least ${40 - characteristicsLength} more characters.`
                                }
                            </span>
                            <FormErrorMessage errorField={errors?.characteristics}/>
                        </div>

                    </div>
                    <div className={"flex justify-center"}>
                        <div className={"flex flex-col"}>
                            <label>
                                Price
                            </label>
                            <div className={"flex items-center"}>
                                <ProductInput
                                    inputType={"number"}
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
                            <FormErrorMessage errorField={errors?.price}/>
                        </div>
                    </div>
                    <div className={"flex justify-around mt-5"}>
                        {isFormSending ?
                           <LoadingButton className={"py-3 px-4"}/>
                            :
                            <button type={"submit"} disabled={!(isDirty && isValid)}
                                    className={styles.submit}>
                                Submit
                            </button>
                        }

                        <button type={"button"} onClick={handleRemoveProduct}
                                className={"bg-red-500 py-3 px-4 rounded-lg transition-colors hover:bg-red-600 cursor-pointer"}>
                            Remove
                        </button>
                    </div>
                </form>
            </Container>
        </BackGround>
    );
}

export default EditProduct;