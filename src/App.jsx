import {createBrowserRouter, createRoutesFromElements, Link, Route, RouterProvider} from "react-router-dom";
import Layout from "./components/Layout/Layout";
import Login from "./pages/Auth/Login/Login";
import Registration from "./pages/Auth/Registration/Registration";
import Home from "./pages/Home/Home";
import Error from "./pages/Erorr/Error";
import PrivateRoute from "./components/PrivateRoute/PrivateRoute";
import {useDispatch} from "react-redux";
import {useEffect, useState} from "react";
import {firstEffectEntry} from "./utils/Auth/authFunctions";
import LoadingBlock from "./components/Loading/LoadingBlock/LoadingBlock";
import CenterWrapper from "./components/Wrapper/CenterWrapper/CenterWrapper";
import UserProfile from "./modules/UserPage/UserProfile/UserProfile";
import UserSetting from "./modules/UserPage/UserSetting/UserSetting";
import ChatPage from "./modules/Chat/ChatPage";
import Users from "./modules/Users/Users";
import CreateProduct from "./modules/Product/CreateProduct/CreateProduct";
import ProductPage from "./modules/Product/ProductPage/ProductPage";
import EditProduct from "./modules/Product/EditProduct/EditProduct";
import Market from "./pages/Market/Market";


const routes = createBrowserRouter(createRoutesFromElements(
    <Route path={"/"} element={<Layout/>}>
        <Route path={'/home'} element={<Home/>}/>
        <Route path={"/auth"} isAuthNeed={false}>
            <Route path={"login"} element={
                <PrivateRoute isAuthNeed={false}>
                    <Login/>
                </PrivateRoute>
            }/>
            <Route path={"registration"} element={
                <PrivateRoute isAuthNeed={false}>
                    <Registration/>
                </PrivateRoute>
            }/>
        </Route>
        <Route path={'/market'} element={<Market/>}/>

        <Route path={"/products"}>
            <Route path={":id"} exact element={
                <PrivateRoute isAuthNeed={true}>
                    <ProductPage/>
                </PrivateRoute>
            } />
            <Route path={":id/edit"} element={
                <PrivateRoute isAuthNeed={true}>
                    <EditProduct/>
                </PrivateRoute>
            }/>

            <Route path={"add"} element={
                <PrivateRoute isAuthNeed={true}>
                <CreateProduct/>
                </PrivateRoute>
            }/>
        </Route>
        <Route path={"/users"}>
            <Route index path={""} element={<Users/>}/>
            <Route path={":id"} element={<UserProfile/>} />
            <Route path={':id/setting'} element={
                <PrivateRoute isAuthNeed={true}>
                <UserSetting/>
                </PrivateRoute>
            }/>
            <Route path={":id/chats"} element={
                <PrivateRoute isAuthNeed={true}>
                    <ChatPage/>
                </PrivateRoute>
            }>
            </Route>
        </Route>
        <Route path={"/terms"}/>
        <Route path={"/contacts"}/>
        <Route path="*" element={<Error error={"Not found"}/>} />
        <Route path={"/error"} element={<Error error={"Not found"}/>} />
    </Route>
))

function App (){

    const dispatch = useDispatch();
    const [isLoading, setIsLoading] = useState(false);

    useEffect(() => {
        const fetchData = async () => {
            await firstEffectEntry(dispatch, setIsLoading);
        };
        if (!isLoading){
            fetchData();
        }
    }, [dispatch]);

    if (!isLoading){
        return <CenterWrapper>
                <LoadingBlock className={"h-40 mt-60"}/>
            </CenterWrapper>
    }

    return (
        <>
            <RouterProvider router={routes}/>
        </>
    )
}



export default App;