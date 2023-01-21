import { useContext } from "react";
import { AuthContext } from "../context/AuthContext";
import { useLocation, Navigate } from "react-router-dom";

export const ProtectedRoute = ({ children }) => {
  const { user } = useContext(AuthContext);
  const location = useLocation();

  if (!user) {
    return <Navigate to="/" state={{ from: location }} />;
  }

  return children;
};
