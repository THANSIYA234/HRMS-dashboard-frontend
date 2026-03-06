import {
  Box,
  Chip,
  CircularProgress,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Typography,
} from "@mui/material";
import { useGetAttendanceHistory } from "../../../queries/employee/attendance.query";

const AttendanceTable = () => {
  const { data, isLoading } = useGetAttendanceHistory();
  const history = data?.attendence || [];

  const getStatusColor = (status) => {
    switch (status) {
      case "Present":
        return "success"; // green
      case "Half-Day":
        return "warning"; // yellow
      case "Late":
        return "error"; // red
      case "Absent":
        return "default"; // grey
      default:
        return "default";
    }
  };

  const formatTime = (time) => {
    if (!time) return "-";
    const date = new Date(time);
    let hours = date.getHours();
    let minutes = date.getMinutes();
    const ampm = hours >= 12 ? "PM" : "AM";
    hours = hours % 12 || 12;
    minutes = minutes.toString().padStart(2, "0");
    return `${hours}:${minutes} ${ampm}`;
  };

  if (isLoading)
    return (
      <Box display="flex" justifyContent="center" p={4}>
        <CircularProgress />
      </Box>
    );

  if (history.length === 0)
    return (
      <Typography p={2} variant="body1">
        No attendance records available.
      </Typography>
    );

  return (
    <Box>
      <Typography variant="h6" fontWeight={700} sx={{ p: 2 }}>
        Attendance Records
      </Typography>
      <TableContainer
        sx={{
          border: "1px solid #E5E7EB",
          borderRadius: 1.5,
          overflowX: "auto",
        }}
      >
        <Table>
          <TableHead>
            <TableRow sx={{ backgroundColor: "#f9fafb" }}>
              <TableCell sx={{ fontWeight: "bold" }}>Date</TableCell>
              <TableCell sx={{ fontWeight: "bold" }}>Punch In</TableCell>
              <TableCell sx={{ fontWeight: "bold" }}>Punch Out</TableCell>
              <TableCell sx={{ fontWeight: "bold" }}>Hours Worked</TableCell>
              <TableCell sx={{ fontWeight: "bold" }}>Status</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {history.map((record) => {
              const status =
                record.status || (record.punchIn ? "Present" : "Absent");

              return (
                <TableRow key={record._id} sx={{ background: "#fff" }}>
                  <TableCell>
                    {new Date(record.date).toLocaleDateString()}
                  </TableCell>
                  <TableCell>{formatTime(record.punchIn)}</TableCell>
                  <TableCell>{formatTime(record.punchOut)}</TableCell>
                  <TableCell>
                    {record.workHours ? `${record.workHours} hrs` : "-"}
                  </TableCell>
                  <TableCell>
                    <Chip label={status} color={getStatusColor(status)} />
                  </TableCell>
                </TableRow>
              );
            })}
          </TableBody>
        </Table>
      </TableContainer>
    </Box>
  );
};

export default AttendanceTable;
