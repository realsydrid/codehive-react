import { FloatingLabel, Form, Button } from "react-bootstrap";
import { useState, useContext } from "react";
import { useNavigate } from "react-router-dom";
import { UseLoginUserContext } from "../provider/LoginUserProvider.jsx";

export default function LoginPage() {
    const navigate = useNavigate();
    const [ , setLoginUser ] = useContext(UseLoginUserContext);

    const [user, setUser] = useState({ id: "", pw: "" });

    const inputHandler = (e) => {
        const { name, value } = e.target;
        setUser(prev => ({ ...prev, [name]: value }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const response = await fetch("http://localhost:8801/user/jwt/login.do", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(user)
            });

            if (!response.ok) throw new Error("로그인 실패");

            const { jwt, user: userData } = await response.json();
            // JWT 저장
            localStorage.setItem("jwt", jwt);

            // 로컬에 저장되는 유저데이터 삭제
            localStorage.removeItem("loginUser");

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
            <hr />
            <form onSubmit={handleSubmit} style={{ width: "400px" }} className="mx-auto">
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
            </form>
        </div>
    );
}