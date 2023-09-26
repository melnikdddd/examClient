import BackGround from "../../../components/Wrapper/BackGround/BackGround";
import Container from "../../../components/Wrapper/Container/Container";
import {useParams} from "react-router";
import {useDispatch, useSelector} from "react-redux";
import {selectUserData} from "../../../store/slices/UserDataSlice";
import {useEffect, useState} from "react";
import CenterWrapper from "../../../components/Wrapper/CenterWrapper/CenterWrapper";
import LoadingBlock from "../../../components/Loading/LoadingBlock/LoadingBlock";
import {getProduct} from "../../../utils/Axios/axiosFunctions";
import ProductCover from "../../../components/Images/ProductCover/ProductCover";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {faEye, faMessage, faPenToSquare, faThumbsDown, faThumbsUp} from "@fortawesome/free-solid-svg-icons";
import UserAvatar from "../../../components/Images/UserAvatar/UserAvatar";
import {Link, useNavigate} from "react-router-dom";
import moment from "moment";
import RatingButtons from "../../../components/Buttons/RatingButton/RatingButtons";
import {selectIsAuth} from "../../../store/slices/AuthSlice";

import  styles from "./ProductPage.module.scss"
import {decodeBase64Image} from "../../../components/Images/utils";
import {pushNotification} from "../../../store/slices/NotificationSlice";


const defaultImage = process.env.PUBLIC_URL + "/DefaultProductImage.png";


function ProductPage(props) {
    const ownerId = useSelector(selectUserData)._id;
    const {id} = useParams();

    const dispatch = useDispatch();
    const navigate = useNavigate();

    const isAuth = useSelector(selectIsAuth);

    const [product, setProduct] = useState(null);
    const [user, setUser] = useState(null);

    const [isLoading, setIsLoading] = useState(false);

    const [isOwner, setIsOwner] = useState(null);




    useEffect(() => {
        const setData = async () => {

            const {PRODUCT, USER} = await getProduct(id, ownerId);

            if (!PRODUCT || !USER){
                dispatch(pushNotification({
                    field: "appNotifications",
                    value: {
                        title: "Error", type: "error", text: "Product not exists.", createdAt: moment()
                    }
                }))
                navigate("/market");
                return;
            }

            const imageData = PRODUCT.productCover.data.data || ''
            const image = imageData.length === 0 || !imageData ? '' : imageData;
            const ext = PRODUCT.productCover?.ext || '';

            const {decodedImage} = decodeBase64Image(image, ext, defaultImage);


            PRODUCT.productCover = decodedImage;

            setProduct(PRODUCT);
            setUser(USER);

            setIsLoading(true);
        }

        setData();

    }, [])

    useEffect(() => {
        if (user) {
            setIsOwner(isAuth && user._id === ownerId)
        }
    }, [user]);


    if (!isLoading) {
        return <BackGround background={"linear-gradient(90deg, #74EBD5 0%, #9FACE6 100%)"}>
            <Container>
                <CenterWrapper>
                    <LoadingBlock className={"h-40 w-40"}/>
                </CenterWrapper>
            </Container>
        </BackGround>
    }

    return (
        <BackGround background={"linear-gradient(90deg, #74EBD5 0%, #9FACE6 100%)"}>
            <Container>
                <div className={styles.coreWrap}>
                    <div className={styles.topContent}>
                        <div className={styles.topInformation}>
                            <ProductCover
                                image={product.productCover}
                                className={styles.cover}
                                imageClassName={"rounded-lg"}
                            />
                            <div className={styles.topInf}>
                                <p className={"text-2xl capitalize"}>
                                    {product.title}
                                </p>
                                <p className={styles.price}>
                                    {product.price === 0 ? "FREE" : product.price + "$"}
                                </p>
                                {
                                    isOwner ?
                                        <div className={styles.editButton}>
                                            <Link to={`/products/${product._id}/edit`}
                                                  className={"flex justify-around items-center w-1/2 bg-blue-500 hover:bg-blue-600 transition-colors text-white px-3 py-2 rounded-lg"}>
                                                <span className={"text-xl"}>
                                                    Edit
                                                </span>
                                                <FontAwesomeIcon icon={faPenToSquare} className={"h-5"}/>
                                            </Link>
                                        </div>
                                        :
                                        <div className={"flex justify-between mt-12"}>
                                            <button
                                                className={"py-2 px-8 bg-green-600 text-white rounded-lg w-3/4"}>
                                                Buy
                                            </button>
                                            <Link to={ownerId ? `/users/${ownerId}/chats` : `/auth/login`}
                                                  state={
                                                      {
                                                          isChatSelect: true,
                                                          user: user,
                                                      }
                                                  }
                                                  className={"py-2 px-5 rounded-lg text-white bg-blue-500 ml-1 w-1/4 " +
                                                      "flex items-center justify-center hover:bg-blue-600 transition-colors"}
                                            >
                                                <FontAwesomeIcon icon={faMessage}/>
                                            </Link>
                                        </div>
                                }
                                <div className={"flex flex-col text-start mt-5"}>
                                    <p className={""}>
                                        <span className={"font-bold text-black"}>Product code:</span>
                                        <span> {product.code}</span>
                                    </p>

                                </div>
                            </div>
                        </div>
                        <div className={styles.userInformation}>
                            <div className={"text-lg flex items-center"}>
                                <span className={"capitalize"}>
                                    {user.firstname.toLowerCase()}
                                </span>
                                <span className={"ml-2 capitalize"}>
                                    {user.lastname.toLowerCase()}
                                </span>
                                <Link to={`/users/${user._id}`}>
                                    <UserAvatar isImageNeedDecoding={true}
                                                image={user.userAvatar}
                                                className={"w-12 h-12 ml-2"}
                                    />
                                </Link>
                            </div>
                            <div className={"flex justify-start"}>
                                <div className={"flex items-center ml-3"}>
                                    <FontAwesomeIcon icon={faThumbsUp} className={"h-5"}/>
                                    <span className={"text-xl ml-2"}>{user.rating.likes.length}</span>
                                </div>
                                <div className={"flex items-center ml-3"}>
                                    <FontAwesomeIcon icon={faThumbsDown} className={"h-5"}/>
                                    <span className={"text-xl ml-3"}>{user.rating.dislikes.length}</span>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div className={styles.middleContent}>
                        <div className={styles.productText}>
                            <span className={"font-bold"}>
                                Description
                            </span>
                            <span>
                                {product.description}
                            </span>
                        </div>
                        <div className={styles.productText}>
                            <span className={"font-bold"}>
                                Characteristics
                            </span>
                            <span>
                                {product.characteristics}
                            </span>
                        </div>
                    </div>
                    <div className={styles.bottomContent}>
                        <div className={styles.hideBlock}>
                            <div className={"flex flex-col mt-5 "}>
                                <span>Since:</span>
                                <span>{moment(product.createdAt).format("DD-MM-YYYY")}</span>
                            </div>
                            <div className={"mt-5"}>
                                <span><FontAwesomeIcon icon={faEye}/> {product.viewsCount}</span>
                            </div>
                        </div>
                        <div className={`flex flex-col mt-5 ${styles.hiddenInfo}`}>
                            <span>Since:</span>
                            <span>{moment(product.createdAt).format("DD-MM-YYYY")}</span>
                        </div>
                        <div className={styles.ratingButtons}>
                            <RatingButtons rateObj={product}
                                           ownerId={ownerId}
                                           isAuth={isAuth}
                                           entity={"products"}
                                           isDisabled={isOwner}
                                           className={styles.buttons}
                            />
                        </div>
                        <div className={`mt-5 ${styles.hiddenInfo}`}>
                            <span><FontAwesomeIcon icon={faEye}/> {product.viewsCount}</span>
                        </div>
                    </div>
                </div>

            </Container>
        </BackGround>
    );
}

export default ProductPage;