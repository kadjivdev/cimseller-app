import axios from 'axios';
import apiRoutes from "./routes"

const axiosInstance = axios.create({
    baseURL: process.env.NEXT_PUBLIC_API_URL,
    withCredentials: true,
    headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
    },
});

type FailedQueueItem = {
    resolve: (value: unknown) => void;
    reject: (error: unknown) => void;
    config: any;
};

let isRefreshing = false;
let failedQueue: FailedQueueItem[] = [];

const processQueue = (error: unknown) => {
    failedQueue.forEach(({ resolve, reject, config }) => {
        if (error) {
            reject(error);
        } else {
            resolve(axiosInstance(config));
        }
    });
    failedQueue = [];
};

const clearSessionAndRedirect = () => {
    localStorage.clear();
    // Évite une boucle si on est déjà sur "/"
    if (window.location.pathname !== '/') {
        window.location.href = '/';
    }
};

axiosInstance.interceptors.response.use(
    response => response,
    async error => {
        const originalRequest = error.config;
        const status = error.response?.status;

        // Laisser passer toutes les erreurs non-401
        if (status !== 401) {
            return Promise.reject(error);
        }

        // Ne pas tenter le refresh sur login ou refresh lui-même
        const isAuthRoute =
            originalRequest.url?.includes(apiRoutes.login) ||
            originalRequest.url?.includes(apiRoutes.refresh);

        if (isAuthRoute) {
            return Promise.reject(error);
        }

        // Éviter les boucles infinies
        if (originalRequest._retry) {
            clearSessionAndRedirect();
            return Promise.reject(error);
        }

        originalRequest._retry = true;

        // Si un refresh est déjà en cours, mettre la requête en file d'attente
        if (isRefreshing) {
            return new Promise((resolve, reject) => {
                failedQueue.push({ resolve, reject, config: originalRequest });
            });
        }

        isRefreshing = true;

        try {
            await axiosInstance.post(apiRoutes.refresh, {}, { withCredentials: true });

            processQueue(null);
            return axiosInstance(originalRequest);

        } catch (refreshError: any) {
            const refreshStatus = refreshError.response?.status;

            console.warn(`[axios] Refresh échoué (${refreshStatus}), déconnexion...`);

            processQueue(refreshError);
            clearSessionAndRedirect();

            return Promise.reject(refreshError);

        } finally {
            isRefreshing = false;
        }
    }
);

export default axiosInstance;