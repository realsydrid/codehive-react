import {createContext, useEffect, useState} from "react";

export const UseLoginUserContext = createContext(null);
// 프로바이더
export function LoginUserProvider({ children }) {
    const [loginUser, setLoginUser] = useState(null);

    useEffect(() => {
        const jwt = localStorage.getItem("jwt");
        if (!jwt) return;

        fetch("http://localhost:8801/user/myinfo", {
            method: "GET",
            headers: {
                "Authorization": `Bearer ${jwt}`,
            },
        })
            .then(res => {
                if (!res.ok) throw new Error("인증 실패");
                return res.json();
            })
            .then(data => setLoginUser(data))
            .catch(err => {
                console.error("유저 정보 불러오기 실패:", err);
                setLoginUser(null); // 만료된 토큰이면 로그인 해제
            });
    }, []);

    return (
        <UseLoginUserContext.Provider value={[loginUser, setLoginUser]}>
            {children}
        </UseLoginUserContext.Provider>
    );
}