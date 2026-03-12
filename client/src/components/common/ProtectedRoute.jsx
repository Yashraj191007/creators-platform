import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import LoadingSpinner from './LoadingSpinner';

/**
 * ProtectedRoute – wraps pages that require authentication.
 * - Shows a loading spinner while auth state is being determined.
 * - Redirects unauthenticated users to /login (saving the intended URL so
 *   Login.jsx can redirect back after a successful sign-in).
 * - Renders `children` when the user is authenticated.
 */
const ProtectedRoute = ({ children }) => {
    const { user, loading } = useAuth();
    const location = useLocation();

    // Wait until AuthContext has read localStorage
    if (loading) {
        return <LoadingSpinner message="Checking authentication..." />;
    }

    // Not logged in → redirect to /login, remember where they were headed
    if (!user) {
        return <Navigate to="/login" state={{ from: location }} replace />;
    }

    // Authenticated → render the protected page
    return children;
};

export default ProtectedRoute;
