import {createContext, useEffect, useState} from "react";

export const UseLoginUserContext = createContext(null);
// 프로바이더
export function LoginUserProvider({ children }) {
    const [loginUser, setLoginUser] = useState(null);
    useEffect(() => {
        const savedUser = localStorage.getItem('user'); // localStorage에서 user 값을 가져옵니다.
        if (savedUser) {
            try {
                setLoginUser(JSON.parse(savedUser)); // 안전하게 JSON을 파싱하고 상태를 업데이트
            } catch (error) {
                console.error("LocalStorage에서 유저 정보 로딩 실패:", error);
            }
        }},[])
    return (
        <UseLoginUserContext.Provider value={[loginUser, setLoginUser]}>
            {children}
        </UseLoginUserContext.Provider>
    );
}