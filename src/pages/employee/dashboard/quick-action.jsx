import * as React from "react";
import { Card, CardContent, Typography, Grid, Button } from "@mui/material";

import EventNoteIcon from "@mui/icons-material/EventNote";

import PersonIcon from "@mui/icons-material/Person";

import { useNavigate } from "react-router-dom";
import { ClockIcon } from "@mui/x-date-pickers";
import { Settings } from "@mui/icons-material";

export default function QuickActions() {
  const navigate = useNavigate();
  return (
    <Card sx={{ borderRadius: 3, boxShadow: 3, minHeight: "288px" }}>
      <CardContent>
        <Typography variant="h6" fontWeight="bold" mb={2}>
          Quick Actions
        </Typography>

        <Grid container spacing={2}>
          <ActionButton
            label="Apply Leave"
            icon={<EventNoteIcon />}
            color="primary"
            onClick={() => navigate("/employee/leave/create")}
          />

          <ActionButton
            label="Punch In/Out"
            icon={<ClockIcon />}
            onClick={() => navigate("/employee/attendance")}
            color="success"
          />

          <ActionButton
            label="Update Profile"
            icon={<PersonIcon />}
            color="warning"
            onClick={() => navigate("/employee/profile/edit")}
          />

          <ActionButton
            label="Settings"
            icon={<Settings />}
            color="secondary"
            onClick={() => navigate("/employee/settings")}
          />
        </Grid>
      </CardContent>
    </Card>
  );
}

function ActionButton({ label, icon, color, onClick }) {
  return (
    <Grid size={{ xs: 12, md: 6 }}>
      <Button
        fullWidth
        variant="contained"
        color={color}
        startIcon={icon}
        sx={{
          py: 1.5,
          borderRadius: 2,
          textTransform: "none",
          fontWeight: "bold",
          mt: 2,
        }}
        onClick={onClick}
      >
        {label}
      </Button>
    </Grid>
  );
}
