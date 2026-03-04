import { useState } from "react";
import {
  Box,
  Button,
  MenuItem,
  TextField,
  Typography,
  Grid,
  Paper,
  CircularProgress,
} from "@mui/material";
import { LocalizationProvider, DatePicker } from "@mui/x-date-pickers";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import dayjs from "dayjs";
import { useApplyLeave } from "../../../queries/employee/leave.query";
import { useNavigate } from "react-router-dom";

const leaveTypes = ["Paid", "Sick", "Casual", "Unpaid"];

const ApplyLeavePage = () => {
  const [leaveType, setLeaveType] = useState("");
  const [startDate, setStartDate] = useState(null);
  const [endDate, setEndDate] = useState(null);
  const [reason, setReason] = useState("");

  const navigate = useNavigate();

  const applyLeave = useApplyLeave();
  const handleSubmit = (e) => {
    e.preventDefault();

    if (!startDate || !endDate) {
      alert("Select dates");
      return;
    }

    applyLeave.mutate(
      {
        startDate: dayjs(startDate).format("YYYY/MM/DD"),
        endDate: dayjs(endDate).format("YYYY/MM/DD"),
        type: leaveType,
        reason,
      },
      {
        onSuccess: () => {
          navigate("/employee/leave");
        },
        onError: (err) => {
          alert(err.response?.data?.message || "Failed to apply for leave");
        },
      },
    );
  };

  const handleCancel = () => {
    setLeaveType("");
    setStartDate(null);
    setEndDate(null);
    setReason("");
  };

  return (
    <LocalizationProvider dateAdapter={AdapterDayjs}>
      <Box display="flex" justifyContent="center" mt={4} p={2}>
        <Paper sx={{ p: 4, maxWidth: 500, width: "100%" }} elevation={3}>
          <Typography variant="h5" fontWeight="bold">
            Apply For Leave
          </Typography>

          <Typography variant="body2" color="text.secondary" mb={2}>
            Submit your leave request
          </Typography>

          <Box component="form" onSubmit={handleSubmit}>
            {/* Leave Type */}
            <TextField
              select
              label="Leave Type"
              fullWidth
              value={leaveType}
              onChange={(e) => setLeaveType(e.target.value)}
              sx={{ mb: 2 }}
              required
            >
              {leaveTypes.map((type) => (
                <MenuItem key={type} value={type}>
                  {type}
                </MenuItem>
              ))}
            </TextField>

            {/* Dates */}
            <Grid container spacing={2} mb={2}>
              <Grid size={{ xs: 6 }}>
                <DatePicker
                  label="Start Date"
                  value={startDate}
                  onChange={(val) => setStartDate(val)}
                />
              </Grid>

              <Grid size={{ xs: 6 }}>
                <DatePicker
                  label="End Date"
                  value={endDate}
                  onChange={(val) => setEndDate(val)}
                />
              </Grid>
            </Grid>

            {/* Reason */}
            <TextField
              label="Reason"
              multiline
              rows={4}
              fullWidth
              value={reason}
              onChange={(e) => setReason(e.target.value)}
              sx={{ mb: 3 }}
              required
            />

            {/* Buttons */}
            <Grid container spacing={2}>
              <Grid size={{ xs: 6 }}>
                <Button fullWidth variant="outlined" onClick={handleCancel}>
                  Cancel
                </Button>
              </Grid>

              <Grid size={{ xs: 6 }}>
                <Button
                  type="submit"
                  fullWidth
                  variant="contained"
                  disabled={applyLeave.isPending}
                >
                  {applyLeave.isPending ? (
                    <CircularProgress size={20} />
                  ) : (
                    "Submit"
                  )}
                </Button>
              </Grid>
            </Grid>
          </Box>
        </Paper>
      </Box>
    </LocalizationProvider>
  );
};

export default ApplyLeavePage;
