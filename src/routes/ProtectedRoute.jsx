import { Navigate, Outlet } from "react-router-dom";
import { useState, useEffect } from "react";
import { getUser } from "../services/AuthAPI";
import Loading from "../components/loading";

const ProtectedRoute = () => {
  const [isAuthorized, setIsAuthorized] = useState(null); // Trạng thái loading

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const user = await getUser();
        setIsAuthorized(user?.role === "1" || false);
      } catch (error) {
        console.error("Lỗi khi lấy user:", error);
        setIsAuthorized(false);
      }
    };
    fetchUser();
  }, []);

  if (isAuthorized === null){
    return (
      <div className="d-flex justify-content-center align-items-center vh-100">
        <Loading />
      </div>
    );
  }

  return isAuthorized ? <Outlet /> : <Navigate to="/unauthorized" replace />;
};

export default ProtectedRoute;
