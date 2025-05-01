import {FloatingLabel, Form, Button} from "react-bootstrap";
import {useState, useContext} from "react";
import {useNavigate} from "react-router-dom";
import {UseLoginUserContext} from "../provider/LoginUserProvider.jsx";
import {GoogleLogin} from "@react-oauth/google";
import {jwtDecode} from "jwt-decode";

export default function LoginPage() {
    const navigate = useNavigate();
    const [, setLoginUser] = useContext(UseLoginUserContext);

    const [user, setUser] = useState({id: "", pw: ""});

    const inputHandler = (e) => {
        const {name, value} = e.target;
        setUser(prev => ({...prev, [name]: value}));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const response = await fetch("http://localhost:8801/user/jwt/login.do", {
                method: "POST",
                headers: {"Content-Type": "application/json"},
                body: JSON.stringify(user)
            });

            if (!response.ok) throw new Error("로그인 실패");

            const {jwt, user: userData} = await response.json();
            // JWT 저장
            localStorage.setItem("jwt", jwt);


            // Context 업데이트
            setLoginUser(userData);

            // 홈으로 이동
            navigate("/");
        } catch (err) {
            alert("아이디 또는 비밀번호를 확인하세요.");
            console.error(err);
        }
    };

    return (
        <div className="text-center">
            <h1>로그인</h1>
            <hr/>
            <form onSubmit={handleSubmit} style={{width: "400px"}} className="mx-auto">
                <FloatingLabel label="아이디를 입력하세요" className="mb-3">
                    <Form.Control
                        value={user.id}
                        onChange={inputHandler}
                        name="id"
                        placeholder="아이디"
                    />
                </FloatingLabel>

                <FloatingLabel label="비밀번호를 입력하세요" className="mb-3">
                    <Form.Control
                        type="password"
                        value={user.pw}
                        onChange={inputHandler}
                        name="pw"
                        placeholder="비밀번호"
                    />
                </FloatingLabel>

                <p className="text-end">
                    <Button variant="success" type="submit">로그인</Button>
                </p>
                <p>
                    <GoogleLogin onSuccess={async (credentialResponse) => {
                        try {
                            const decoded = jwtDecode(credentialResponse.credential);
                            const socialUser = {
                                email: decoded.email,
                                name: decoded.name,
                                picture: decoded.picture,
                                oauth: "GOOGLE"
                            };

                            const response = await fetch("http://localhost:8801/user/oauth/login.do", {
                                method: "POST",
                                headers: {"Content-Type": "application/json"},
                                body: JSON.stringify(socialUser)
                            });

                            if (response.status === 200) {
                                const {jwt, user} = await response.json();
                                localStorage.setItem("jwt", jwt);
                                setLoginUser(user);
                                navigate("/");
                            } else if (response.status === 404) {
                                navigate("/OAuthSignup", {
                                    state: {
                                        user: socialUser,
                                        error: "해당 구글 계정으로 가입된 사용자가 없습니다. 회원가입을 진행해주세요."
                                    }
                                });
                            } else if (response.status === 409) {
                                alert("이미 다른 방식으로 가입된 이메일입니다. 기존 로그인 방식을 사용해주세요.");
                            } else {
                                alert("소셜 로그인에 실패했습니다.");
                            }
                        } catch (err) {
                            console.error("소셜 로그인 에러:", err);
                            alert("소셜 로그인 도중 문제가 발생했습니다.");
                        }
                    }}
                                 onError={() => {
                                     alert("Google 로그인 실패");
                                 }}/>
                </p>
            </form>
        </div>
    );
}