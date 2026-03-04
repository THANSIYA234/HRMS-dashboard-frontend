import { Route, Routes } from "react-router-dom";
import EmployeeRoute from "./employee-route";
import EmployeeLayout from "../../layouts/employee-layout";
import Dashboard from "../../pages/employee/dashboard/dashboard";
import Attendance from "../../pages/employee/attendance/attendance";
import Leave from "../../pages/employee/leave/leave";
import Profile from "../../pages/employee/profile/profile";
import EditProfile from "../../pages/employee/profile/profile-edit-page";
import ApplyLeavePage from "../../pages/employee/leave/leave-request";
import NotificationPage from "../../pages/notification";
import ChangePasswordPage from "../../pages/employee/settings/change-password";
import SettingsPage from "../../pages/employee/settings/settings";

const EmployeeRoutes = () => {
  return (
    <Routes>
      <Route element={<EmployeeRoute />}>
        <Route element={<EmployeeLayout />}>
          <Route index element={<Dashboard />} />
          <Route path="dashboard" element={<Dashboard />} />
          <Route path="attendance" element={<Attendance />} />
          <Route path="leave" element={<Leave />} />
          <Route path="leave/create" element={<ApplyLeavePage />} />
          <Route path="profile" element={<Profile />} />
          <Route path="profile/edit" element={<EditProfile />} />
          <Route path="notifications" element={<NotificationPage />} />
          <Route path="settings" element={<SettingsPage />} />
          <Route
            path="settings/change-password"
            element={<ChangePasswordPage />}
          />
        </Route>
      </Route>
    </Routes>
  );
};
export default EmployeeRoutes;
