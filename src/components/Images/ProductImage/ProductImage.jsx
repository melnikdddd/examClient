
function ProductImage(props) {
    const {image, className} = props;

    return (
        <div className={`${className} cursor-pointer transition-colors hover:outline hover:outline-sky-600`}>
            <img src={image} alt={"productImage"} className={"w-full h-full"}/>
        </div>
    );
}

export default ProductImage;