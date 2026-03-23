import { Navigate } from "react-router-dom";
import { useSelector } from "react-redux";

const ProtectedRoute = ({ children }) => {
  const { isAuthenticated, token } = useSelector((state) => state.auth);

  // 🔥 fallback from localStorage
  const localToken = localStorage.getItem("token");

  if (!isAuthenticated && !token && !localToken) {
    return <Navigate to="/" replace />;
  }

  return children;
};

export default ProtectedRoute;