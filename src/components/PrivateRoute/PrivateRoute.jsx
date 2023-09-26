import {Route, Navigate} from "react-router-dom";
import {selectIsAuth} from "../../store/slices/AuthSlice";
import {useSelector} from "react-redux";


function PrivateRoute(props) {
    const isAuth = useSelector(selectIsAuth);
    //true - если пользователь авторизирован
    //false - если нет

    const isAuthNeed = props.isAuthNeed;
    //роут должен быть доступен только для авторизированных - true
    //только для наеавторизованных - false

    const flag = (!isAuth && !isAuthNeed) || (isAuth && isAuthNeed) || false;

    const redirectTo = isAuthNeed ? "/auth/login" : "/home";

    if(!flag){
        return <Navigate to={redirectTo} />
    }

    return props.children;
}

export default PrivateRoute;