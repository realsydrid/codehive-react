import {Link, useNavigate} from "react-router-dom";
import {UseLoginUserContext} from "../../provider/LoginUserProvider.jsx";
import {useContext} from "react";

export default function TopNavbar() {
    const [loginUser, setLoginUser] = useContext(UseLoginUserContext);
    const navigate = useNavigate();

    const logoutHandler = () => {
        localStorage.removeItem("jwt");  // JWT 삭제
        setLoginUser(null);              // 로그인 사용자 초기화
        navigate("/");                   // 홈으로 이동
    };
    return (
        <>
            <nav id="topNavbar">
                <div>
                    <a href="/">
                        <img src="/images/sample_logo.svg" alt="비트하이브로고"/>
                    </a>
                </div>
                <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                    <img src="/images/user_icon_default.png" alt="프로필로고" />
                    {loginUser ? (
                        <>
                            <span>{loginUser.nickname}님</span>
                            <button onClick={logoutHandler} style={{ border: "none", background: "none", cursor: "pointer", color: "blue" }}>
                                로그아웃
                            </button>
                        </>
                    ) : (
                        <>
                            <Link to="/login">로그인</Link>
                            <Link to="/signup">회원가입</Link>
                        </>
                    )}
                </div>
            </nav>
        </>
    );
}