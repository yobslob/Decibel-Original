// components/auth/PublicRoute.jsx
export function PublicRoute({ children }) {
    const { isAuthenticated } = useAuth();
    const location = useLocation();

    if (isAuthenticated) {
        return <Navigate to={location.state?.from?.pathname || '/feed'} replace />;
    }

    return children;
}