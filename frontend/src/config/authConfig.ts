import { PublicClientApplication } from "@azure/msal-browser";

export const msalConfig = {
    auth: {
        clientId: import.meta.env.VITE_ENTRA_CLIENT_ID || 'mock-client-id',
        authority: `https://login.microsoftonline.com/${import.meta.env.VITE_ENTRA_TENANT_ID || 'mock-tenant-id'}`,
        redirectUri: '/',
        postLogoutRedirectUri: '/'
    },
    cache: {
        cacheLocation: 'localStorage', // This configures where your cache will be stored
        storeAuthStateInCookie: false, // Set this to "true" if you are having issues on IE11 or Edge
    }
};

export const loginRequest = {
    scopes: ['openid', 'profile', 'email']
};

export const msalInstance = new PublicClientApplication(msalConfig);
