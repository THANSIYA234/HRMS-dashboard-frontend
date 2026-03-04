import { Box } from "@mui/material";

import { Outlet } from "react-router-dom";

import Sidebar from "../components/admin/admin-sidebar";
import { Navbar } from "../components/common/navbar";

const AdminLayout = () => {
  return (
    <Box sx={{ display: "flex" }}>
      <Sidebar />
      <Box sx={{ flexGrow: 1 }}>
        <Navbar />
        <Box component="main" sx={{ flexGrow: 1, p: 2, background: "#F8FAFC" }}>
          <Outlet />
        </Box>
      </Box>
    </Box>
  );
};
export default AdminLayout;
