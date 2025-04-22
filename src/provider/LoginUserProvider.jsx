import { createContext, useState } from "react";

export const UseLoginUserContext = createContext(null);

export function LoginUserProvider({ children }) {
    const [loginUser, setLoginUser] = useState(null);
    return (
        <UseLoginUserContext.Provider value={[loginUser, setLoginUser]}>
            {children}
        </UseLoginUserContext.Provider>
    );
}