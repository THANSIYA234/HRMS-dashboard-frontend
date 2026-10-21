import React from "react";
import { Route, Routes } from "react-router-dom";
import Login from "./auth/login";
import AdminRoutes from "./routes/admin/admin-routes";
import EmployeeRoutes from "./routes/employee/employee-routes";
import NotFound from "./pages/common/not-found";

function App() {
  return (
    <Routes>
      <Route path="/" element={<Login />} />
      <Route path="/admin/*" element={<AdminRoutes />} />
      <Route path="/employee/*" element={<EmployeeRoutes />} />
      <Route path="*" element={<NotFound />} />
    </Routes>
  );
}
export default App;