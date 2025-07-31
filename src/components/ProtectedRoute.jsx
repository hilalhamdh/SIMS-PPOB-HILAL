import { useSelector } from "react-redux";
import { Navigate } from "react-router-dom";

function ProtectedRoute({ children }) {
  const token = useSelector((state) => state.auth.token);

  if (!token) {
    // Jika tidak ada token, redirect ke login
    return <Navigate to="/login" replace />;
  }

  // Jika ada token, render komponen anak
  return children;
}

export default ProtectedRoute;
