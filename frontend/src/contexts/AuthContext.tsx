import React, { createContext, useContext, useEffect, useState } from 'react';
import { useMsal, useIsAuthenticated } from '@azure/msal-react';
import { loginRequest } from '../config/authConfig';
import apiClient from '../api/client';

const AuthContext = createContext<any>({});

export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
    const { instance, accounts, inProgress } = useMsal();
    const isMsalAuthenticated = useIsAuthenticated();
    
    const [user, setUser] = useState(null);
    const [role, setRole] = useState(null); // 'employee', 'hr', 'admin'
    const [loading, setLoading] = useState(true);

    const isBypass = import.meta.env.VITE_AUTH_BYPASS === 'true';

    useEffect(() => {
        const fetchUserProfile = async () => {
            try {
                // MSAL auth check
                if (!isBypass && !isMsalAuthenticated && inProgress === "none") {
                    setLoading(false);
                    return;
                }
                
                // If bypassed or authenticated, fetch the backend profile
                if (isBypass || isMsalAuthenticated) {
                    const response = await apiClient.get('/users/me');
                    setUser({
                        email: response.data.email,
                        name: response.data.username,
                        id: response.data.user_id
                    });
                    setRole(response.data.role);
                }
            } catch (error) {
                console.error("Failed to fetch user profile:", error);
                setUser(null);
                setRole(null);
            } finally {
                setLoading(false);
            }
        };

        if (inProgress === "none" || isBypass) {
            fetchUserProfile();
        }
    }, [isMsalAuthenticated, inProgress, isBypass]);

    const login = () => {
        if (isBypass) {
            // Mock successful login by redirecting manually
            window.location.href = '/app';
            return;
        }
        instance.loginRedirect(loginRequest).catch(e => {
            console.error(e);
        });
    };

    const logout = () => {
        if (isBypass) {
            window.location.href = '/';
            return;
        }
        instance.logoutRedirect({
            postLogoutRedirectUri: "/",
        });
    };

    const value = {
        user,
        role,
        loading,
        isAuthenticated: !!user,
        isEmployee: role === 'employee' || role === 'hr' || role === 'admin',
        isHR: role === 'hr' || role === 'admin',
        isAdmin: role === 'admin',
        login,
        logout
    };

    return (
        <AuthContext.Provider value={value}>
            {children}
        </AuthContext.Provider>
    );
};
