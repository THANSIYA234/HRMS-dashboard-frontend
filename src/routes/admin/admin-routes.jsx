import { Route, Routes } from "react-router-dom";
import AdminRoute from "./admin-route";
import AdminLayout from "../../layouts/admin-layout";
import DashboardPage from "../../pages/admin/dashboard-admin/dashboard";
import AttendancePage from "../../pages/admin/attendance/attendance";
import Departments from "../../pages/admin/department/department";
import EmployeesPage from "../../pages/admin/employee/employees";

import EmployeeDetailsPage from "../../pages/admin/employee/employee-details";
import CreateDepartment from "../../pages/admin/department/create-department";
import DepartmentDetailsPage from "../../pages/admin/department/department-details";
import LeavePage from "../../pages/admin/leaves/leave";
import CreateEmployeePage from "../../pages/admin/employee/create-employee";
import NotificationPage from "../../pages/notification";
import AdminProfile from "../../pages/admin/profile/admin-profile";

const AdminRoutes = () => {
  return (
    <Routes>
      <Route element={<AdminRoute />}>
        <Route path="/admin" element={<AdminLayout />}>
          <Route index element={<DashboardPage />} />
          <Route path="dashboard" element={<DashboardPage />} />
          <Route path="employees" element={<EmployeesPage />} />
          <Route path="employees/create" element={<CreateEmployeePage />} />
          <Route path="employees/:id" element={<EmployeeDetailsPage />} />
          <Route path="departments" element={<Departments />} />
          <Route path="departments/create" element={<CreateDepartment />} />
          <Route path="departments/:id" element={<DepartmentDetailsPage />} />
          <Route path="attendance" element={<AttendancePage />} />
          <Route path="leave" element={<LeavePage />} />
          <Route path="notifications" element={<NotificationPage />} />
          <Route path="profile" element={<AdminProfile />} />
        </Route>
      </Route>
    </Routes>
  );
};
export default AdminRoutes;
