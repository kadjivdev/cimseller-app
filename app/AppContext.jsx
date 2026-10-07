"use client"

import React, { createContext, useState, useCallback, useEffect } from 'react';
import axiosInstance from "@/api/axios"
import apiRoutes from "@/api/routes"

export const AppContext = createContext();

export const AppProvider = ({ children }) => {

    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(false);
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const [initialized, setInitialized] = useState(false);

    useEffect(() => {
        const storedUser = window.localStorage.getItem("user");

        if (storedUser) {
            try {
                setUser(JSON.parse(storedUser));
                setIsAuthenticated(true);
            } catch (error) {
                console.warn("Impossible de parser l'utilisateur en localStorage", error);
            }
        }
        setInitialized(true);
    }, []);

    // Login
    const login = useCallback(async (email, password) => {
        setLoading(true);
        try {
            const response = await axiosInstance.post(
                apiRoutes.login,
                { email, password }
            );
            const userData = response.data?.user || response.data;

            // ✅ mise à jour effective du state, plus commentée
            setUser(userData)
            setIsAuthenticated(true)

            window.localStorage.setItem("user", JSON.stringify(userData))

            return { success: true, status: response.status, message: response.message };
        } catch (error) {
            let errorMessage = null
            console.log(`Erreure de login : ${error}`)
            switch (error.response?.status) {
                case 422:
                    errorMessage = "Erreure de validation";
                    break;
                case 500:
                    errorMessage = "Erreure côté serveur";
                    break;
                case 401:
                    errorMessage = "Identifiants incorrects! ";
                    break;
                default:
                    errorMessage = "Le serveur rejete votre requête";
                    break;
            }
            throw new Error(errorMessage);
        } finally {
            setLoading(false) // ✅ manquait, laissait loading bloqué à true après succès
        }
    }, []);

    // Supprime un cookie côté navigateur
    const deleteCookie = (name) => {
        const base = `${name}=; expires=Thu, 01 Jan 1970 00:00:00 GMT; max-age=0`;
        // Même path que celui de la création (souvent "/")
        document.cookie = `${base}; path=/`;
        // Si le cookie a été créé avec un domain précis, supprime-le aussi avec ce domain
        // document.cookie = `${base}; path=/; domain=.mondomaine.com`;
    };

    const clearAllCookies = () => {
        document.cookie
            .split(";")
            .map((c) => c.split("=")[0].trim())
            .filter(Boolean)
            .forEach(deleteCookie);
    };

    const logout = useCallback(async () => {
        let backendError = null;
        let message;

        // 1. Invalider la session côté API (avant de supprimer les cookies,
        //    car l'API a besoin du cookie/token pour t'identifier)
        try {
            const response = await axiosInstance.post(apiRoutes.logout);
            message = response.data?.message;
        } catch (error) {
            backendError = error;
        }

        // 2. Nettoyage local : toujours exécuté, quoi qu'il arrive avant
        clearAllCookies();
        setUser(null);
        setIsAuthenticated(false);
        try {
            window.localStorage.removeItem("user");
        } catch (error) {
            console.warn("Impossible de vider le localStorage", error);
        }

        // 3. Erreurs : un 401 signifie session déjà expirée, donc utilisateur bien déconnecté
        if (backendError && backendError.response?.status !== 401) {
            throw new Error(backendError.response?.data?.message || "Erreur de déconnexion");
        }

        return { success: true, message: message ?? "Déconnecté" };
    }, []);

    // Register
    const register = useCallback(async (userData) => {
        setLoading(true);
        try {
            const response = await axiosInstance.post(apiRoutes.createUser, userData);
            return { success: true, status: response.status, data: response.data };
        } catch (error) {
            const errorMessage = error.response?.data?.message || 'Erreur d\'inscription';
            const errorStatus = error.response?.status;
            const errors = error.response?.data?.errors;
            return { success: false, status: errorStatus, error: errorMessage, errors: errors };
        } finally {
            setLoading(false);
        }
    }, []);

    const value = {
        user,
        loading,
        isAuthenticated,
        setLoading,
        initialized,

        login,
        logout,
        register,
    };

    return (
        <AppContext.Provider value={value}>
            {children}
        </AppContext.Provider>
    );
};

export const useApp = () => {
    const context = React.useContext(AppContext);
    if (!context) {
        throw new Error('useApp doit être utilisé à l\'intérieur d\'un AppProvider');
    }
    return context;
};