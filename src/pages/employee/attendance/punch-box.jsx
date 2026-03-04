import React from "react";
import {
  Box,
  Button,
  Card,
  CardContent,
  Chip,
  Divider,
  Typography,
} from "@mui/material";
import AccessTimeIcon from "@mui/icons-material/AccessTime";
import LogoutIcon from "@mui/icons-material/Logout";

const TodayPunchBox = ({
  status = "Not Punched", // Not Punched | Working | Completed
  punchIn = "--",
  punchOut = "--",
  onPunchIn,
  onPunchOut,
  disablePunchIn = false,
  disablePunchOut = false,
}) => {
  const getChipColor = () => {
    if (status === "Completed") return "#dff1e0";
    if (status === "Working") return "#fff3cd";
    return "#e0e0e0";
  };

  return (
    <Card
      sx={{
        borderRadius: 3,
        boxShadow: 1,
        border: "1px solid #eee",
        mb: 3,
      }}
    >
      <CardContent>
        {/* Title */}
        <Typography variant="h6" fontWeight="bold" mb={2}>
          Today Punch
        </Typography>

        {/* MAIN CONTAINER */}
        <Box
          sx={{
            bgcolor: "#fafafa",
            borderRadius: 2,
            border: "1px solid #eee",
            p: 2.5,
            display: "grid",
            gridTemplateColumns: { xs: "1fr", md: "max-content auto" },
            columnGap: 6,
            alignItems: "center",
          }}
        >
          {/* LEFT — TEXT INFO */}
          <Box sx={{ minWidth: 260 }}>
            {/* Status */}
            <Box display="flex" alignItems="center" gap={1} mb={2}>
              <Typography fontWeight={600}>Status:</Typography>
              <Chip
                label={status}
                sx={{
                  bgcolor: getChipColor(),
                  fontWeight: 500,
                  borderRadius: 2,
                }}
              />
            </Box>

            <Divider sx={{ mb: 2 }} />

            {/* Punch In */}
            <Box display="flex" justifyContent="space-between" mb={1} gap={1}>
              <Typography>Punch In:</Typography>
              <Typography fontWeight="bold">{punchIn}</Typography>
            </Box>

            <Divider sx={{ mb: 1 }} />

            {/* Punch Out */}
            <Box display="flex" justifyContent="space-between">
              <Typography>Punch Out:</Typography>
              <Typography fontWeight="bold">{punchOut}</Typography>
            </Box>

            <Typography
              variant="caption"
              color="text.secondary"
              sx={{ display: "block", mt: 2 }}
            >
              * Punch In once per day. Punch Out after work completes.
            </Typography>
          </Box>

          {/* RIGHT — BUTTONS */}
          <Box display="flex" gap={2} alignItems="center">
            <Button
              variant="contained"
              startIcon={<AccessTimeIcon />}
              onClick={onPunchIn}
              disabled={disablePunchIn}
              sx={{
                bgcolor: "#2e7d32",
                px: 5,
                py: 1.3,
                borderRadius: 2,
                fontWeight: "bold",
                minWidth: 200,
                boxShadow: 2,
                "&:hover": { bgcolor: "#1b5e20" },
              }}
            >
              Punch In
            </Button>

            <Button
              variant="contained"
              startIcon={<LogoutIcon />}
              onClick={onPunchOut}
              disabled={disablePunchOut}
              sx={{
                bgcolor: "#d32f2f",
                px: 5,
                py: 1.3,
                minWidth: 180,
                borderRadius: 2,
                fontWeight: "bold",
                boxShadow: 2,
                "&:hover": { bgcolor: "#b71c1c" },
              }}
            >
              Punch Out
            </Button>
          </Box>
        </Box>
      </CardContent>
    </Card>
  );
};

export default TodayPunchBox;
