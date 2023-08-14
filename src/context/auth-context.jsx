import { createContext, useContext, useState } from "react";

const AuthContext = createContext();
function AuthProvider(props) {
    const [userInfo, setUserInfo] = useState({});
    const value = { userInfo, setUserInfo };
    return (
        <AuthContext.Provider value={value} {...props}></AuthContext.Provider>
    );
}

function useAuth() {
    const context = useContext(AuthContext);
    if (typeof context === "undefined")
        throw new Error("useAuth must be used within AuthProvider");
    return context;
}

// eslint-disable-next-line react-refresh/only-export-components
export { useAuth, AuthProvider };