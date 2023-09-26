import Carousel from "../../../components/Carousel/Carousel";
import Container from "../../../components/Wrapper/Container/Container";
import CenterWrapper from "../../../components/Wrapper/CenterWrapper/CenterWrapper";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {faLock, faPlus} from "@fortawesome/free-solid-svg-icons";


function HomeCarouselBlock(props) {

    return (
        <div id={props.id} style={props.style} className={"w-full h-[70vh] outline-black "}>
            <Carousel className={"h-full"}>
                <div className="h-[70vh] flex items-center justify-center bg-slate-800 text-white">
                    <Container>
                        <CenterWrapper>
                            <div className={"flex flex-col cursor-pointer"}>
                                <div className={"flex items-center"}>
                                    <span className={"text-3xl"}>iMarket</span>
                                    <FontAwesomeIcon icon={faPlus} className={"text-yellow-400  h-10 w-10 ml-2"}/>
                                </div>
                                <div className={"text-center"}>
                                <span className={"text-3xl"}>
                                    Soon.
                                </span>
                                </div>
                            </div>
                        </CenterWrapper>
                    </Container>
                </div>
                <div className="h-[70vh] bg-gray-700 text-slate-100">
                    <Container>
                        <CenterWrapper>
                            <div className={"flex flex-col items-center"}>
                                <FontAwesomeIcon icon={faLock} className={"h-20 w-20"}/>
                                <h1 className={"text-3xl mt-2 text-red-500"}>
                                    Attention!
                                </h1>
                                <h1 className={"text-2xl text-yellow-300"}>
                                    Observe these safety precautions:
                                </h1>
                                <ul className={"flex flex-col gap-3 mt-5 list-decimal"}>
                                    <li><span>Do not share your account information with other users.</span></li>
                                    <li><span>Do not share payment information with other users.</span></li>
                                    <li><span>Do not pay in advance, only upon receipt of the goods.</span></li>
                                    <li><span>Make transactions only on https://iMarketPlace.com.</span></li>
                                    <li><span>In case of suspicious behavior of the user, feel free to report him</span></li>
                                </ul>
                            </div>
                        </CenterWrapper>
                    </Container>
                </div>
                <div className="h-[70vh] flex items-center justify-center">
                    <div className={"w-full h-full bg-friendlyPeople bg-bottom bg-no-repeat pt-8"}>
                        <Container>
                            <div className={"text-center"}>
                                <h1 className={"text-6xl font-bold"}>Be friendly</h1>
                            </div>
                        </Container>
                    </div>
                </div>
            </Carousel>
        </div>
    );
}

export default HomeCarouselBlock;

