import { Navigate, Outlet } from "react-router-dom";
import { useAppContext } from "../context/AppContext";

const ProtectedRoute = () => {
  const { activeUser } = useAppContext();

  if (!activeUser) {
    return <Navigate to="/" />;
  }

  if (activeUser.role === "user") {
    return <Navigate to="/restaurent-selection" />;
  }

  return <Outlet />; // Render child routes
};

export default ProtectedRoute;
