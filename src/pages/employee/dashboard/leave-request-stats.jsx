import * as React from "react";
import { Card, CardContent, Typography, Stack, Box, Chip } from "@mui/material";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import CancelIcon from "@mui/icons-material/Cancel";
import HourglassEmptyIcon from "@mui/icons-material/HourglassEmpty";
import { useFetchMyLeaves } from "../../../queries/employee/leave.query";

export default function LeaveRequestStatus() {
  const { data, isLoading } = useFetchMyLeaves();
  const leaves = data?.leaves || [];

  // Calculate counts
  const approved = leaves.filter((l) => l.status === "Approved").length;
  const pending = leaves.filter((l) => l.status === "Pending").length;
  const rejected = leaves.filter((l) => l.status === "Rejected").length;

  const stats = { approved, pending, rejected };
  if (isLoading) {
    return <div>Loading...</div>;
  }
  return (
    <Card sx={{ borderRadius: 3, boxShadow: 3 }}>
      <CardContent>
        <Typography variant="h6" fontWeight="bold" mb={2}>
          Leave Request Status
        </Typography>

        <Stack spacing={2}>
          {/* Approved */}
          <StatusRow
            icon={<CheckCircleIcon color="success" />}
            label="Approved"
            value={stats.approved}
            color="success"
          />

          {/* Pending */}
          <StatusRow
            icon={<HourglassEmptyIcon sx={{ color: "#f9a825" }} />}
            label="Pending"
            value={stats.pending}
            color="warning"
          />

          {/* Rejected */}
          <StatusRow
            icon={<CancelIcon color="error" />}
            label="Rejected"
            value={stats.rejected}
            color="error"
          />
        </Stack>
      </CardContent>
    </Card>
  );
}

function StatusRow({ icon, label, value, color }) {
  return (
    <Box
      display="flex"
      alignItems="center"
      justifyContent="space-between"
      sx={{
        p: 1.5,
        borderRadius: 2,
        bgcolor: "#f7f9fc",
      }}
    >
      <Stack direction="row" spacing={1.5} alignItems="center">
        {icon}
        <Typography>{label}</Typography>
      </Stack>

      <Chip
        label={value}
        color={color}
        variant="filled"
        sx={{ fontWeight: "bold" }}
      />
    </Box>
  );
}
