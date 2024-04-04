import { useEffect } from 'react';
import { Navigate, useLocation } from "react-router-dom";
import { useAuth } from "../../hooks/useAuth";

export default function AuthRoute({ children }) {
    const location = useLocation();
    const { user, logout } = useAuth();

    useEffect(() => {
        if (user && user.isBlocked) {
            logout();
        }
    }, [user, logout]);

    if (!user) {
        return <Navigate to={`/login?returnUrl=${location.pathname}`} replace />;
    }

    return user.isBlocked ? (
        <Navigate to={`/login?returnUrl=${location.pathname}`} replace />
    ) : (
        children
    );
}
