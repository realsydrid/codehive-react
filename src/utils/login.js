import { useNavigate } from "react-router-dom";
import { useContext } from "react";
import { UseLoginUserContext } from "../provider/LoginUserProvider.jsx";

// 공통 로그인 처리 함수
export function useLogin() {
    const navigate = useNavigate();
    const [, setLoginUser] = useContext(UseLoginUserContext);

    const login = (jwt, userData) => {
        localStorage.setItem("jwt", jwt);
        localStorage.removeItem("loginUser");
        setLoginUser(userData);
        navigate("/");
    };
    return { login };
}