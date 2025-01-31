import axios from "axios";
import {useAuth} from "@context/AuthContext.jsx";
import {useMemo} from "react";

const useHttp = () => {
    const {isLoggedIn, getToken, logout} = useAuth();

    const http = useMemo(() => {
        const instance = axios.create({
            baseURL: import.meta.env.VITE_API_URL,
            headers: {
                "Content-Type": "application/json",
            },
        });

        instance.interceptors.request.use(
            async (config) => {
                const excludedEndpoints = ["/login", "/register"];
                const isExcluded = excludedEndpoints.some((endpoint) => config.url.includes(endpoint));

                if (!isExcluded) {
                    if (isLoggedIn) {
                        const token = getToken();
                        if (token) {
                            config.headers.Authorization = `Bearer ${token}`;
                        }
                    }
                }
                return config;
            },
            (error) => Promise.reject(error)
        );

        instance.interceptors.response.use(
            (response) => response,
            (error) => {
                if (error.response) {
                    if (error.response.status === 401) {
                        console.error("Unauthorized! Redirecting to login...");
                        logout();
                    }
                }
                return Promise.reject(error);
            }
        );

        return instance;
    }, [isLoggedIn, getToken, logout]);

    const get = async (url, config = {}) => http.get(url, config);
    const post = async (url, data, config = {}) => http.post(url, data, config);
    const put = async (url, data, config = {}) => http.put(url, data, config);
    const patch = async (url, data, config = {}) => http.patch(url, data, config);
    const del = async (url, config = {}) => http.delete(url, config);

    return {get, post, put, patch, del};
};

export {useHttp};
