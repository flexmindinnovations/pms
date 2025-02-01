import {createContext, useContext, useEffect, useState} from "react";
import {useNavigate} from "react-router-dom";

const authConfig = {
    isLoggedIn: false,
    getToken: () => '',
    userDetails: {},
    logout() {}
};

const AuthContext = createContext(authConfig);

export function AuthProvider({children}) {
    const [isLoggedIn, setIsLoggedIn] = useState(false);
    const [userDetails, setUserDetails] = useState({});
    const navigate = useNavigate();

    const isAuthenticated = () => !!sessionStorage.getItem("token");
    const getToken = () => sessionStorage.getItem("token");

    const logout = () => {
        sessionStorage.removeItem("token");
        sessionStorage.removeItem("userID");
        sessionStorage.clear();
        setIsLoggedIn(false);
        navigate("/login");
    };

    useEffect(() => {
        if (isAuthenticated()) {
            setIsLoggedIn(true);
        } else {
            navigate("/login");
        }
    }, []);

    return (
        <AuthContext.Provider value={{isLoggedIn, getToken, userDetails, logout}}>
            {children}
        </AuthContext.Provider>
    );
}

export const useAuth = () => {
    const context = useContext(AuthContext);
    if (!context) {
        throw new Error("useAuth must be used within an AuthProvider");
    }
    return context;
};