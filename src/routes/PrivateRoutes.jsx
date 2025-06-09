import { Navigate, Outlet } from "react-router-dom";

const PrivateRoute = () => {
    const role = localStorage.getItem("role");

    if (role !== "1") {
        return <Navigate to="/unauthorized" replace />;
    }
    
    return <Outlet />;
};

export default PrivateRoute;
