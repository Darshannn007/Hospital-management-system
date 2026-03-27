import { Navigate } from "react-router-dom";
import { useSelector } from "react-redux";

const ProtectedRoute = ({ children, allowedRoles }) => {
  const { isAuthenticated, role, token } = useSelector((state) => state.auth);

  // 🔒 AUTH CHECK (single source → Redux)
  if (!isAuthenticated || !token) {
    return <Navigate to="/" replace />;
  }

  // 🔥 ROLE CHECK (only Redux)
  if (allowedRoles && !allowedRoles.includes(role)) {
    return <Navigate to="/dashboard" replace />;
  }

  return children;
};

export default ProtectedRoute;