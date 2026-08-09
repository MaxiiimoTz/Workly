import { Navigate, Outlet } from "react-router-dom";

const PublicRoute = () => {
    const user = localStorage.getItem("worklyUser");

    if (user) {
        return <Navigate to="/dashboard" replace />;
    }

    return <Outlet />;
};

export default PublicRoute;