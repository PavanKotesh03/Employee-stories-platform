import React from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';

export default function RoleGuard({ allowedRoles = [], children }: { allowedRoles?: string[], children?: React.ReactNode }) {
    const { isAuthenticated, loading, role } = useAuth();

    if (loading) {
        return (
            <div className="flex h-screen w-full items-center justify-center">
                <span style={{ color: 'var(--grey-font-color)' }}>Loading permissions...</span>
            </div>
        );
    }

    if (!isAuthenticated) {
        return <Navigate to="/" replace />;
    }

    if (allowedRoles.length > 0 && !allowedRoles.includes(role)) {
        console.warn(`User role '${role}' is not in allowed roles: [${allowedRoles.join(', ')}]`);
        return <Navigate to="/app" replace />;
    }

    return children ? <>{children}</> : <Outlet />;
}
