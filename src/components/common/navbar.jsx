import {
  KeyboardArrowDown,
  NotificationsNoneOutlined,
} from "@mui/icons-material";
import {
  AppBar,
  Avatar,
  Badge,
  Box,
  IconButton,
  Menu,
  MenuItem,
  Toolbar,
  Typography,
} from "@mui/material";
import { useState } from "react";
import { useNavigate } from "react-router-dom";

import { logOut } from "../../services/auth.service";
import { useAuth } from "../../context/auth-context";
import { useGetUnreadCount } from "../../queries/notification.query";

export const Navbar = () => {
  const { user, logout } = useAuth();
  const [anchorEl, setAnchorEl] = useState(null);
  const navigate = useNavigate();
  const open = Boolean(anchorEl);

  const { data: unreadData } = useGetUnreadCount();

  const unreadCount = unreadData?.count ?? 0;
  console.log(unreadCount);

  const handleMenuOpen = (event) => {
    setAnchorEl(event.currentTarget);
  };
  const handleMenuClose = () => {
    setAnchorEl(null);
  };
  const handleLogout = async () => {
    handleMenuClose();
    try {
      await logOut();
    } catch (error) {
      console.error("Logout error", error);
    } finally {
      logout();
      navigate("/");
    }
  };

  return (
    <AppBar
      elevation={0}
      position={"static"}
      sx={{ backgroundColor: "#fff", borderBottom: "1px solid #e0e0e0" }}
    >
      <Toolbar>
        <Typography
          variant="h6"
          sx={{ color: "#000", fontWeight: 500, flexGrow: 1 }}
        >
          Welcome, {user?.name} 👋
        </Typography>
        <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
          <IconButton
            onClick={() => navigate(`/${user?.role}/notifications`)}
            aria-label="notifications"
          >
            <Badge
              badgeContent={unreadCount}
              color="error"
              max={99}
              sx={{
                "& .MuiBadge-badge": {
                  fontSize: "0.75rem",
                  minWidth: "18px",
                  height: "18px",
                },
              }}
            >
              <NotificationsNoneOutlined sx={{ color: "#000" }} />
            </Badge>
          </IconButton>
          <Box
            onClick={handleMenuOpen}
            sx={{
              display: "flex",
              alignItems: "center",
              cursor: "pointer",
              gap: 1,
            }}
          >
            <Avatar
              src={user?.role === "employee" ? user?.profileImage : undefined}
            >
              {user?.name?.charAt(0)}
            </Avatar>
            <Typography sx={{ fontWeight: 500, color: "#000" }}>
              {user?.name}
            </Typography>
            <KeyboardArrowDown />
          </Box>
          <Menu anchorEl={anchorEl} open={open} onClose={handleMenuClose}>
            <MenuItem
              onClick={() => {
                handleMenuClose();
                navigate(
                  user?.role === "admin"
                    ? "/admin/profile"
                    : "/employee/profile",
                );
              }}
            >
              My Profile
            </MenuItem>
            <MenuItem onClick={handleLogout}>Logout</MenuItem>
          </Menu>
        </Box>
      </Toolbar>
    </AppBar>
  );
};
