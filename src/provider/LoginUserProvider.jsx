import {createContext, useEffect, useState} from "react";

export const UseLoginUserContext = createContext(null);
// 프로바이더
export function LoginUserProvider({ children }) {
    const [loginUser, setLoginUser] = useState(null);
    useEffect(() => {
        const savedUser = localStorage.getItem('user'); // localStorage 에서 user 값을 가져옴
        // jwt 일수도 있는데 일단은 제외
        if (savedUser) {
            try {
                setLoginUser(JSON.parse(savedUser)); // 이 상태의 json 값을 파싱해서 loginUser에 집어넣음
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