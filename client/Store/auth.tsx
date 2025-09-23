"use client";
import axios from "axios";
import { createContext, useContext, useState, useEffect, use } from "react";

type AuthContextType = {
    storeTokenLS: (token: string) => void;
    user: any;
    getTokenLS: () => string | null;
    removeTokenLS: () => void;
    token: string | null;
    isLoggedIn: boolean;
    setUserData: (userData: any) => void;
};

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
    const [token, setToken] = useState<string | null>(null);
    const [user, setUser] = useState(null);
    const [isLoggedIn, setIsLoggedIn] = useState(false);
    
    // Store token
    const storeTokenLS = (token: string) => {
        localStorage.setItem("Token", token);
        setToken(token);
        setIsLoggedIn(true);
    };
    // Get token
    const getTokenLS = () => {
        return localStorage.getItem("Token");
    };

    // Remove token (logout)
    const removeTokenLS = () => {
        localStorage.removeItem("Token");
        setToken(null);
        setUser(null);
        setIsLoggedIn(false);
    };
    
    // Set user data directly (for immediate login)
    const setUserData = (userData: any) => {
        setUser(userData);
    };
    const userAuthenticated = async () => {
        if (token) {
            try {
                const response = await axios.get("http://localhost:5001/api/auth/user", {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                });
                if (response.status === 200) {
                    console.log("User authenticated:", response.data.userData);
                    setUser(response.data.userData);
                    setIsLoggedIn(true);
                } else {
                    // Token might be invalid or expired
                    removeTokenLS();
                    setIsLoggedIn(false);
                }
            } catch (error) {
                console.error("Error verifying token:", error);
                removeTokenLS();
                setIsLoggedIn(false);
            }
        } else {
            setIsLoggedIn(false);
        }
    };
    // Load token on page refresh
    useEffect(() => {
        const storedToken = localStorage.getItem("Token");
        if (storedToken) {
            setToken(storedToken);
            setIsLoggedIn(true);
        }
    }, []);
    useEffect(() => {
        userAuthenticated();
    }, [token]);
    //JWT Authentication to get logged in user info

    return (
        <AuthContext.Provider value={{ storeTokenLS, getTokenLS, removeTokenLS, token, isLoggedIn, user, setUserData }}>
            {children}
        </AuthContext.Provider>
    );
}

export function useAuth() {
    const context = useContext(AuthContext);
    if (!context) throw new Error("useAuth must be used within AuthProvider");
    return context;
}
