import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {faSpinner} from "@fortawesome/free-solid-svg-icons";


function LoadingButton(props) {
    return (
        <button className={`rounded-lg bg-gray-100 text-gray-600 cursor-pointer py-2 ${props.className}`}>
            <span>Loading</span> <FontAwesomeIcon icon={faSpinner} spin/>
        </button>
    );
}

export default LoadingButton;