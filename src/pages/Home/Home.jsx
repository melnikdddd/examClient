import HomeCarouselBlock from "./HomeCarouselBlock/HomeCarouselBlock";
import WhyUsBlock from "./WhyUsBlock/WhyUsBlock";
import NeedaHelpBlock from "./NeedaHelpBlock/NeedaHelpBlock";
import {useEffect, useState} from "react";

function Home() {


    return (
        <div className={"flex flex-col"}>
            <HomeCarouselBlock />
            <WhyUsBlock/>
            <NeedaHelpBlock/>
        </div>
    );
}


export default Home;