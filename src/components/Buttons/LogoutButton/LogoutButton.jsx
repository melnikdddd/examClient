import {logout} from "../../../utils/Auth/authFunctions";
import {clearToken} from "../../../store/slices/AuthSlice";
import {clearUserData} from "../../../store/slices/UserDataSlice";
import {useDispatch} from "react-redux";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {faRightFromBracket} from "@fortawesome/free-solid-svg-icons";
import {NavLink} from "react-router-dom";


function LogoutButton(props) {
    const dispatch = useDispatch();
    const handleLogoutClick  = () =>{
        logout(dispatch);
    }

    return (
        <NavLink to={'/home'} className={"p-1 hover:bg-rose-500 transition-colors rounded cursor-pointer bg-rose-400 items-center " + props.className} onClick={handleLogoutClick}>
            Logout <FontAwesomeIcon icon={faRightFromBracket}/>
        </NavLink>
    );
}

export default LogoutButton;