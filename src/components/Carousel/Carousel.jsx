import React from 'react';
import Slider from "react-slick";
import "slick-carousel/slick/slick.css"
import "slick-carousel/slick/slick-theme.css"

const Carousel = (props) => {
    return (
        <Slider {...settings} className={props.className}>
            {props.children}
        </Slider>
    );
}

const NextArrow = (props) => {
    const { onClick, className, style } = props;
    return (
        <div
            className={`${className}`}
            style={{ ...style, display: 'block', right: '20px', background: "black", borderRadius: "50%"}}
            onClick={onClick}
        >
        </div>
    );
}

const PrevArrow = (props) => {
    const { className, style, onClick } = props;
    return (
        <div
            className={className}
            style={{ ...style, display: "block", left:"20px",background: "black", borderRadius: "50%", zIndex: 10}}
            onClick={onClick}
        />
    );
}
const settings = {
    infinite: true,
    speed: 500,
    autoplay: true,
    autoplaySpeed: 5000,
    adaptiveHeight: true,
    slidesToShow: 1,
    swipeToSlide: true,
    pauseOnHover: true,
    slidesToScroll: 1,
    className: "w-full h-full",
    cssEase: "linear",
    nextArrow: <NextArrow />,
    prevArrow: <PrevArrow />,
};

export default Carousel;