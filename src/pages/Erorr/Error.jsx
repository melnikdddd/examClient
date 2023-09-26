import Container from "../../components/Wrapper/Container/Container";
import CenterWrapper from "../../components/Wrapper/CenterWrapper/CenterWrapper";
import BackGround from "../../components/Wrapper/BackGround/BackGround";
import ErrorCard from "../../components/Card/ErrorCard/ErrorCard";


function Error(props) {
    return (
        <BackGround background={"linear-gradient(90deg, rgba(2,0,36,1) 0%, rgba(121,15,9,1) 42%, rgba(0,212,255,1) 100%)"}>
        <Container>
            <CenterWrapper>
                    <ErrorCard error={props.error}/>
            </CenterWrapper>
        </Container>
        </BackGround>
    );
}

export default Error;