import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {faSpinner} from "@fortawesome/free-solid-svg-icons";

function LoadingBlock(props) {
    return (
       <FontAwesomeIcon icon={faSpinner} spin className={props.className} />
    );
}

export default LoadingBlock;