import { createContext, useContext, useEffect, useState, useCallback } from "react";
import { useNavigate, useLocation } from "react-router-dom";

const AuthContext = createContext({
    isLoggedIn: false,
    getToken: () => "",
    userDetails: {},
    logout: () => {},
});

const getTokenFromSessionStorage = () => sessionStorage.getItem("token");

export function AuthProvider({ children }) {
    const [isLoggedIn, setIsLoggedIn] = useState(() => !!getTokenFromSessionStorage());
    const [userDetails, setUserDetails] = useState({});
    const navigate = useNavigate();
    const location = useLocation();

    const logout = useCallback(() => {
        sessionStorage.clear();
        setIsLoggedIn(false);
        navigate("/login");
        window.history.replaceState(null, "", "/login");
    }, [navigate]);

    useEffect(() => {
        if (isLoggedIn && location.pathname === "/login") {
            navigate("/");
        } else if (!isLoggedIn && location.pathname !== "/login") {
            navigate("/login");
        }
    }, [isLoggedIn, location.pathname, navigate]);

    useEffect(() => {
        const handleBackButton = () => {
            if (!isLoggedIn) {
                navigate("/login");
                window.history.replaceState(null, "", "/login");
            }
        };
        window.addEventListener("popstate", handleBackButton);
        return () => {
            window.removeEventListener("popstate", handleBackButton);
        };
    }, [isLoggedIn, navigate]);
    
    useEffect(() => {
        setIsLoggedIn(!!getTokenFromSessionStorage());
    }, [getTokenFromSessionStorage()])

    return (
        <AuthContext.Provider
            value={{ isLoggedIn, getToken: getTokenFromSessionStorage, userDetails, logout }}
        >
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
