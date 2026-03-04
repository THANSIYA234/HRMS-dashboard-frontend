import { Box } from "@mui/material";

import { Outlet } from "react-router-dom";

import { Navbar } from "../components/common/navbar";
import EmployeeSidebar from "../components/employee/employee-sidebar";

const EmployeeLayout = () => {
  console.log("Rendering EmployeeLayout");
  return (
    <Box sx={{ display: "flex" }}>
      <EmployeeSidebar />
      <Box sx={{ flexGrow: 1 }}>
        <Navbar />
        <Box
          component="main"
          sx={{ flexGrow: 1, p: 2, background: "#F8FAFC", height: "100vh" }}
        >
          <Outlet />
        </Box>
      </Box>
    </Box>
  );
};
export default EmployeeLayout;
