import React, { createContext, useContext, useState, useEffect } from 'react';
import { AuthService } from '../services/auth';

interface AuthContextType {
    isAuthenticated: boolean;
    login: (nome: string, matricula: string) => Promise<boolean>;
    logout: () => void;
    loading: boolean;
    getUsuarioId: () => number | null;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const checkAuth = () => {
            const id = AuthService.getUsuarioId();
            setIsAuthenticated(!!id);
            setLoading(false);
        };
        checkAuth();
    }, []);

    const login = async (nome: string, matricula: string) => {
        const result = await AuthService.login(nome, matricula);
        if (result.idUsuario) {
            setIsAuthenticated(true);
            return true;
        }
        return false;
    };

    const logout = () => {
        AuthService.logout();
        setIsAuthenticated(false);
    };

    const getUsuarioId = () => {
        return AuthService.getUsuarioId();
    };

    if (loading) return <div>Loading...</div>;

    return (
        <AuthContext.Provider value={{ isAuthenticated, login, logout, loading, getUsuarioId }}>
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => {
    const context = useContext(AuthContext);
    if (!context) throw new Error('useAuth must be used within an AuthProvider');
    return context;
};
