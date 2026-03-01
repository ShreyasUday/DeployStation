import React, { createContext, useContext, useState, useEffect, useCallback } from "react";

export interface User {
    id: string;
    name: string;
    email: string;
    github_id?: string;
    github_token?: string;
}

interface AuthContextType {
    user: User | null;
    isAuthenticated: boolean;
    loading: boolean;
    logout: () => Promise<void>;
    login: (email: string, password: string) => Promise<void>;
    signup: (name: string, email: string, password: string) => Promise<void>;
    refreshUser: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const [user, setUser] = useState<User | null>(null);
    const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
    const [loading, setLoading] = useState<boolean>(true);

    const refreshUser = useCallback(async () => {
        setLoading(true);
        try {
            const response = await fetch("http://localhost:3000/api/auth/me", {
                credentials: "include",
            });
            if (response.ok) {
                const data = await response.json();
                setUser({
                    id: data.id,
                    name: data.name,
                    email: data.email,
                    github_id: data.github_id,
                    github_token: data.github_token,
                });
                setIsAuthenticated(true);
            } else {
                setUser(null);
                setIsAuthenticated(false);
            }
        } catch (error) {
            console.error("Auth check failed:", error);
            setUser(null);
            setIsAuthenticated(false);
        } finally {
            setLoading(false);
        }
    }, []);

    useEffect(() => {
        refreshUser();
    }, [refreshUser]);

    const login = async (email: string, password: string) => {
        const response = await fetch("http://localhost:3000/api/auth/login", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            credentials: "include",
            body: JSON.stringify({ email, password }),
        });
        if (response.ok) {
            await refreshUser();
        } else {
            const data = await response.json();
            throw new Error(data.message || "Login failed");
        }
    };

    const signup = async (name: string, email: string, password: string) => {
        const response = await fetch("http://localhost:3000/api/auth/signup", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            credentials: "include",
            body: JSON.stringify({ name, email, password }),
        });
        if (response.ok) {
            await refreshUser();
        } else {
            const data = await response.json();
            throw new Error(data.message || "Signup failed");
        }
    };

    const logout = async () => {
        try {
            await fetch("http://localhost:3000/api/auth/logout", {
                method: "POST",
                credentials: "include",
            });
        } catch (error) {
            console.error("Logout request failed:", error);
        } finally {
            setUser(null);
            setIsAuthenticated(false);
            // Redirection will typically be handled by components, or we could use window.location.href = "/" if strictly required.
        }
    };

    return (
        <AuthContext.Provider value={{ user, isAuthenticated, loading, logout, login, signup, refreshUser }}>
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => {
    const context = useContext(AuthContext);
    if (context === undefined) {
        throw new Error("useAuth must be used within an AuthProvider");
    }
    return context;
};
