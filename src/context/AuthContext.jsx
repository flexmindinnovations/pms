import { createContext, useContext, useEffect, useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";

const AuthContext = createContext({
    isLoggedIn: false,
    getToken: () => '',
    userDetails: {},
    logout: () => {}
});

export function AuthProvider({ children }) {
    const [isLoggedIn, setIsLoggedIn] = useState(!!sessionStorage.getItem("token"));
    const [userDetails, setUserDetails] = useState({});
    const navigate = useNavigate();
    const location = useLocation();

    const isAuthenticated = () => !!sessionStorage.getItem("token");
    const getToken = () => sessionStorage.getItem("token");

    const logout = () => {
        sessionStorage.clear();
        setIsLoggedIn(false);
        navigate("/login");
        window.history.replaceState(null, "", "/login");
    };

    useEffect(() => {
        if (isAuthenticated()) {
            setIsLoggedIn(true);
            if (location.pathname === "/login") {
                navigate("/");
            }
        } else {
            navigate("/login");
        }
    }, [location.pathname]);

    useEffect(() => {
        const handleBackButton = () => {
            if (!isAuthenticated()) {
                navigate("/login");
                window.history.replaceState(null, "", "/login");
            } else if (location.pathname === "/login") {
                navigate("/");
            }
        };
        window.addEventListener("popstate", handleBackButton);
        return () => {
            window.removeEventListener("popstate", handleBackButton);
        };
    }, [location.pathname]);

    return (
        <AuthContext.Provider value={{ isLoggedIn, getToken, userDetails, logout }}>
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