import React from "react";
import { Route, Routes } from "react-router-dom";
import Login from "./auth/login";
import AdminRoutes from "./routes/admin/admin-routes";
import EmployeeRoutes from "./routes/employee/employee-routes";

function App() {
  return (
    <Routes>
      <Route path="/" element={<Login />} />
      <Route path="/*" element={<AdminRoutes />} />
      <Route path="/employee/*" element={<EmployeeRoutes />} />
    </Routes>
  );
}
export default App;
