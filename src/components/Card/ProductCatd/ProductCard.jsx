import ProductCover from "../../Images/ProductCover/ProductCover";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {faEye, faThumbsDown, faThumbsUp} from "@fortawesome/free-solid-svg-icons";
import {Link} from "react-router-dom";

function ProductCard(props) {
    const {product} = props;
    const {productCover, price, title, rating, viewsCount, _id} = product;
    const {isImageNeedDecoding} = props;


    return (
        <Link to={`/products/${_id}`} className={"w-[310px]  h-[490px] rounded-lg shadow-md flex flex-col justify-between cursor-pointer hover:bg-sky-200 transition-colors bg-slate-50"}>
            <div className={"flex justify-center items-center"}>
                <ProductCover image={productCover}
                              isImageNeedDecoding={isImageNeedDecoding}
                              isMarketImage={true}
                              isChanged={false}
                              className={"h-[310px] rounded-t-lg"}
                              imageClassName={"rounded-t-lg"}
                />
            </div>
            <div className={"flex flex-col px-5 pb-5 border-t border-gray-500 "}>
                <div className={"text-center p-2 text-xl"}>
                    {title}
                </div>
                <div className={"px-5 flex justify-around w-full mt-3"}>
                    <div className={"flex items-center  "}>
                        <FontAwesomeIcon icon={faThumbsUp} className={"h-5"}/>
                        <span className={"text-xl ml-2"}>{rating.likes.length}</span>
                    </div>
                    <div className={"flex items-center "}>
                        <FontAwesomeIcon icon={faThumbsDown} className={"h-5"}/>
                        <span className={"text-xl ml-3"}>{rating.dislikes.length}</span>
                    </div>
                </div>
                <div className={"text-center text-xl mt-3"}>
                    {price === 0 ?
                        <span className={"font-bold"}>Free</span>
                        :
                        <span>{price}$</span>
                    }
                </div>
                <div className={"text-end"}>
                    <span><FontAwesomeIcon icon={faEye} /> {viewsCount}</span>
                </div>
            </div>
        </Link>
    );
}

export default ProductCard;