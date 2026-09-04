import axios from 'axios';
import { msalInstance, loginRequest } from '../config/authConfig';

const apiClient = axios.create({
    baseURL: import.meta.env.VITE_API_BASE_URL || 'http://localhost:8000/api/v1',
    headers: {
        'Content-Type': 'application/json',
    },
});

apiClient.interceptors.request.use(async (config) => {
    // Dev Bypass Check
    const isBypass = import.meta.env.VITE_AUTH_BYPASS === 'true';
    if (isBypass) {
        config.headers['X-Dev-Email'] = localStorage.getItem('devEmail') || import.meta.env.VITE_DEV_EMAIL || 'mock.dev@tricon.com';
        return config;
    }

    const account = msalInstance.getActiveAccount() || msalInstance.getAllAccounts()[0];
    if (account) {
        try {
            const response = await msalInstance.acquireTokenSilent({
                ...loginRequest,
                account: account
            });
            config.headers.Authorization = `Bearer ${response.idToken}`;
        } catch (error) {
            console.warn("Token acquisition failed, falling back to redirect.", error);
            msalInstance.acquireTokenRedirect({ ...loginRequest, account });
        }
    }
    return config;
}, (error) => {
    return Promise.reject(error);
});

apiClient.interceptors.response.use(
    (response) => response,
    (error) => {
        if (error.response && error.response.status === 401) {
            // Handle unauthorized access
            console.error("401 Unauthorized - Redirecting to login");
            sessionStorage.setItem('postLoginRedirect', window.location.pathname);
            
            const isBypass = import.meta.env.VITE_AUTH_BYPASS === 'true';
            if (!isBypass) {
                 msalInstance.logoutRedirect({ postLogoutRedirectUri: '/' });
            } else {
                 window.location.href = '/login';
            }
        }
        return Promise.reject(error);
    }
);

export default apiClient;
