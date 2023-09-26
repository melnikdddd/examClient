import RemoveImageButton from "../../Buttons/RemoveImageButton/RemoveImage";
import {useEffect, useState} from "react";
import {decodeBase64Image} from "../utils";

const defaultImage = process.env.PUBLIC_URL + "/DefaultProductImage.png";

function ProductCover(props) {
    const {className, image} = props;

    const [thisImage, setThisImage] = useState(image);

    const {isImageNeedDecoding} = props;

    const {isChanged, isRemoveButtonHidden} = props;

    const {setIsClicked, isClicked} = props;



    useEffect(() => {
        setThisImage(image)
    }, [image])

    useEffect(() => {
        if (isImageNeedDecoding) {
            if (image.data.data) {
                setThisImage(decodeBase64Image(image.data.data, image.ext, defaultImage).decodedImage);
                return;
            }
            setThisImage(decodeBase64Image(image.data, image.ext, defaultImage).decodedImage);

        }
    }, [image]);


    return (
        <div className={`${isChanged && "bg-[#c0c0c0] flex justify-center"} ${className}`}>
            {isChanged && !isClicked && !isRemoveButtonHidden &&
                <RemoveImageButton
                    setIsClicked={setIsClicked}
                    isClicked={isClicked}
                    className={"ml-64 -mt-3"}
                />}
            <img src={thisImage}
                 alt="defaultProductCover"
                 className={`${isChanged && "cursor-pointer"} h-full w-auto ${props.imageClassName}`}
                 onClick={props.onClick}
            />
        </div>
    );
}

export default ProductCover;