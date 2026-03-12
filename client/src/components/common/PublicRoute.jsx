import { Navigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import LoadingSpinner from './LoadingSpinner';

/**
 * PublicRoute – wraps pages that should NOT be accessible when logged in
 * (e.g., /login, /register).
 * - Shows a loading spinner while auth state is being determined.
 * - Redirects already-authenticated users to /dashboard.
 * - Renders `children` when the user is NOT logged in.
 */
const PublicRoute = ({ children }) => {
    const { user, loading } = useAuth();

    if (loading) {
        return <LoadingSpinner />;
    }

    // Already logged in → send to dashboard
    if (user) {
        return <Navigate to="/dashboard" replace />;
    }

    // Not logged in → show the public page
    return children;
};

export default PublicRoute;
