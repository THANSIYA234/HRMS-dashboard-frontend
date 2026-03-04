import { Navigate, Outlet } from "react-router-dom";
import { useAuth } from "../../context/auth-context";

export default function AdminRoute() {
  const { user, loading } = useAuth();

  if (loading) return null;
  console.log("ADMIN ROUTE USER:", user);
  console.log("ROLE:", user?.role);

  if (!user) return <Navigate to="/" replace />;

  if (user.role !== "admin")
    return <Navigate to="/employee/dashboard" replace />;

  return <Outlet />;
}
