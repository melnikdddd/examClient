import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {faPlus} from "@fortawesome/free-solid-svg-icons";
import styles from "./ProfileProducts.module.scss"
import {Link} from "react-router-dom";
import ProductCard from "../../Card/ProductCatd/ProductCard";

function ProfileProducts(props) {
    const {products, isOwner, isBlocked} = props;


    if (isBlocked) {
        return (
            <div className={"p-6"}>
                <h1 className={"text-2xl text-slate-500 text-center"}>User is blocked.</h1>
            </div>
        )
    }

    return (
        <div className={"p-6"}>
            {isOwner &&
                <div>
                    <Link className={styles.addProduct} to={"/products/add"}>
                        <h1 className={"text-xl"}>Add product</h1>
                        <div
                            className={"rounded-full bg-slate-200 h-12 w-12 items-center flex justify-center ml-5 " + styles.circle}>
                            <FontAwesomeIcon icon={faPlus} className={"h-10 text-slate-500"}/>
                        </div>
                    </Link>
                </div>
            }
            {
                products && products?.length > 0 ?
                    <div className={styles.productsWrap}>
                        {
                            products.map((product) => (
                                <ProductCard product={product}
                                             key={product._id}
                                             isOwner={isOwner}
                                             isImageNeedDecoding={!isOwner}
                                />
                            ))
                        }
                    </div>
                    : <h1 className={"text-2xl text-slate-500 text-center"}>No products.</h1>

            }
        </div>
    );
}

export default ProfileProducts;