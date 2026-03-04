// src/pages/settings/SettingsPage.jsx
import {
  Box,
  Paper,
  Typography,
  List,
  ListItemButton,
  ListItemText,
  Divider,
} from "@mui/material";
import { useNavigate } from "react-router-dom";
import PageTitleBar from "../../../components/common/page-title-bar";
import ChevronRightIcon from "@mui/icons-material/ChevronRight";

export default function SettingsPage() {
  const navigate = useNavigate();

  return (
    <Box>
      <PageTitleBar
        title="Settings"
        breadCrumbs={[
          { label: "Dashboard", href: "/employee/dashboard" },
          { label: "Settings" },
        ]}
      />

      <Box display="flex" justifyContent="center" mt={5}>
        <Paper sx={{ width: 400, borderRadius: 2 }}>
          {/* Title inside card (optional but clean) */}
          <Box sx={{ p: 2 }}>
            <Typography variant="h6">Account Settings</Typography>
          </Box>

          <Divider />

          <List disablePadding>
            <ListItemButton
              onClick={() => navigate("/employee/settings/change-password")}
              sx={{ px: 3, py: 2 }}
            >
              <ListItemText primary="Change Password" />
              <ChevronRightIcon fontSize="small" />
            </ListItemButton>
          </List>
        </Paper>
      </Box>
    </Box>
  );
}
