import { Navigate, Outlet } from "react-router-dom";
import { useAppContext } from "@/context/appContext";

const ProtectedRoute = () => {
  const { activeUser } = useAppContext();

  if (!activeUser) {
    return <Navigate to="/signin" />;
  }

  if (activeUser.role === "user") {
    return <Navigate to="/restaurent-selection" />;
  }

  return <Outlet />; // Render child routes
};

export default ProtectedRoute;
