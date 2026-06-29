"use client"

import React, { createContext, useState, useCallback, useEffect } from 'react';
import axiosInstance from "@/api/axios"
import apiRoutes from "@/api/routes"

// Créer le contexte
export const AppContext = createContext();

// Provider component
export const AppProvider = ({ children }) => {

    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(false);
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const [initialized, setInitialized] = useState(false); // 👈 Nouveau

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
        setInitialized(true); // 👈 Toujours déclenché, même si pas d'user
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
        }
    }, []);

    // Logout
    const logout = useCallback(async () => {
        try {
            const response = await axiosInstance.post(apiRoutes.logout);
            setUser(null);
            setIsAuthenticated(false);
            window.localStorage.removeItem("user")
            return { success: true, status: response.status, message: response.message };
        } catch (error) {

            let errorStatus = error.response?.status;
            let errorMessage = '';

            console.log("error :", error)
            if (errorStatus === 500) {
                errorMessage = error || 'Erreur côté serveur';
            } else if (errorStatus === 401) {
                errorMessage = 'Vous n\'êtes pas connexté.e!';
            } else {
                errorMessage = error || 'Erreur de déconnexion';
            }

            console.log('Erreur from logout in AppContext:', errorMessage);
            throw new Error(errorMessage)
        }
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

            // console.log('Erreur lors de la création de l\'utilisateur :', error.response);
            // console.log('Erreur status:', errorStatus);
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
        initialized, // 👈 Exposé

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

// Hook personnalisé pour utiliser le contexte
export const useApp = () => {
    const context = React.useContext(AppContext);

    if (!context) {
        throw new Error('useApp doit être utilisé à l\'intérieur d\'un AppProvider');
    }
    return context;
};
