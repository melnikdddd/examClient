import React, {useEffect, useState} from 'react';
import {decodeBase64Image} from "../utils";

function CardImage(props) {
    const {image, className} = props;
    const {isImageNeedDecoding} = props;

    const [thisImage, setThisImage] = useState("")


    useEffect(() => {
        if (isImageNeedDecoding){
            setThisImage(decodeBase64Image(image.data.data, image.ext).decodedImage)
        }

    }, [image]);


    return (
        <div className={`relative ${className}`}>
            <img src={thisImage} alt="cardIamge" className={"w-full h-full"}/>
        </div>
    );
}

export default CardImage;