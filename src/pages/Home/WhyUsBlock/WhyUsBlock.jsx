import Container from "../../../components/Wrapper/Container/Container";
import {Link} from "react-router-dom";
import {useSelector} from "react-redux";
import {selectIsAuth} from "../../../store/slices/AuthSlice";
import CenterWrapper from "../../../components/Wrapper/CenterWrapper/CenterWrapper";

function WhyUsBlock(props) {
    const isAuth = useSelector(selectIsAuth);

    return (
        <div style={props.style} className={"h-[80vh] w-screen "}>
            <Container>
                <CenterWrapper>
                <div className={"flex flex-col"}>
                    <h1 className={"text-3xl text-center mt-5"}>Why us?</h1>
                    <p className={"mt-5 text-center"}>
                        We are a marketplace where buyers and people can openly see information
                        about each other. Also, the seller will receive money for the
                        goods only if the buyer has taken the goods. For sellers, we offer
                        the lowest commission of 0.5% of the amount of the goods
                        <span> </span>
                        <span
                            className={"text-blue-500 cursor-pointer transition-colors hover:text-blue-600 underline"}>
                                  (more details here)
                              </span>.
                        Users also receive various
                        <span> </span>
                        <span
                            className={"text-blue-500 cursor-pointer transition-colors hover:text-blue-600 underline"}>
                                  bonuses
                              </span>
                        <span> </span>
                        for purchases and sales on our marketplace.
                        {!isAuth && <span> Join now!</span>}
                    </p>
                    <div className={"w-full flex justify-center my-5"}>
                        {!isAuth &&
                            <Link to={"/auth/login"}
                                  className={"text-xl bg-green-500 hover:bg-green-600 transition-colors py-2 px-5 rounded"}>
                                Join
                            </Link>
                        }
                    </div>
                </div>
                </CenterWrapper>
            </Container>
        </div>
    );
}

export default WhyUsBlock;