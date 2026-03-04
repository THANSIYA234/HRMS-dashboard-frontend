import {
  Drawer,
  List,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Typography,
  Box,
} from "@mui/material";

import DashboardIcon from "@mui/icons-material/Dashboard";
import PeopleIcon from "@mui/icons-material/People";
import ApartmentIcon from "@mui/icons-material/Apartment";
import EventNoteIcon from "@mui/icons-material/EventNote";
import AccessTimeIcon from "@mui/icons-material/AccessTime";
import { NavLink } from "react-router-dom";
import { Settings } from "@mui/icons-material";

const drawerWidth = 260;

const menuItems = [
  { label: "Dashboard", icon: <DashboardIcon />, path: "/employee/dashboard" },

  {
    label: "My Attendance",
    icon: <AccessTimeIcon />,
    path: "/employee/attendance",
  },
  { label: "My Leave", icon: <EventNoteIcon />, path: "/employee/leave" },
  { label: "My Profile", icon: <PeopleIcon />, path: "/employee/profile" },
  { label: "Settings", icon: <Settings />, path: "/employee/settings" },
];

const EmployeeSidebar = () => {
  return (
    <Drawer
      variant="permanent"
      sx={{
        width: drawerWidth,
        flexShrink: 0,
        "& .MuiDrawer-paper": {
          width: drawerWidth,
          backgroundColor: "#2563EB", // Figma blue
          color: "#fff",
          borderRight: "none",
        },
      }}
    >
      {/* LOGO / TITLE */}
      <Box sx={{ p: 3 }}>
        <Typography variant="h6" fontWeight="bold">
          HRMS Dashboard
        </Typography>
      </Box>

      {/* MENU */}
      <List sx={{ px: 2 }}>
        {menuItems.map((item) => (
          <ListItemButton
            key={item.label}
            component={NavLink}
            to={item.path}
            sx={{
              borderRadius: "10px",
              mb: 1,
              color: "#fff",

              "&.active": {
                backgroundColor: "#1E40AF",
              },

              "&:hover": {
                backgroundColor: "#1E3A8A",
              },
            }}
          >
            <ListItemIcon sx={{ color: "#fff", minWidth: 36 }}>
              {item.icon}
            </ListItemIcon>
            <ListItemText primary={item.label} />
          </ListItemButton>
        ))}
      </List>
    </Drawer>
  );
};

export default EmployeeSidebar;
