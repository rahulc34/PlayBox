import { useAuth } from "../contexts/AuthContext";
import { Navigate } from "react-router-dom";

function RedirectIfAuth({ children }) {
  const { isAuthenticated } = useAuth();
  if (isAuthenticated) return <Navigate to="/" replace />;
  return children;
}

export default RedirectIfAuth;
