import { Navigate, Outlet } from "react-router-dom";
import { useAuth } from "../../context/auth-context";
import { Box } from "@mui/material";

export default function EmployeeRoute() {
  const { user, loading } = useAuth();

  if (loading)
    return (
      <Box sx={{ display: "flex", justifyContent: "center", mt: 10 }}>
        Loading...
      </Box>
    );

  if (!user || !user.role) return <Navigate to="/" replace />;

  if (user.role !== "employee")
    return <Navigate to="/admin/dashboard" replace />;

  return <Outlet />;
}
