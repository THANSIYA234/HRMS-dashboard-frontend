import {
  Avatar,
  Box,
  Chip,
  IconButton,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Typography,
  Paper,
} from "@mui/material";
import CheckCircleOutlineIcon from "@mui/icons-material/CheckCircleOutline";
import CancelOutlinedIcon from "@mui/icons-material/CancelOutlined";
import { formatDate } from "../../../utils/format-date";

const statusColor = (status) => {
  const s = (status || "").toString().toLowerCase();
  switch (s) {
    case "approved":
      return "success";
    case "rejected":
      return "error";
    default:
      return "warning";
  }
};

const LeaveTable = ({ leaves = [], onApprove, onReject }) => {
  if (!leaves.length) {
    return (
      <TableContainer component={Paper} sx={{ borderRadius: 3 }}>
        <Box p={3}>
          <Typography>No leave requests found.</Typography>
        </Box>
      </TableContainer>
    );
  }

  return (
    <TableContainer component={Paper} sx={{ borderRadius: 3 }}>
      <Table>
        <TableHead>
          <TableRow sx={{ backgroundColor: "#f9fafb", borderTop: "#E5E7EB" }}>
            <TableCell>Employee</TableCell>
            <TableCell>Department</TableCell>
            <TableCell>Leave Type</TableCell>
            <TableCell>From</TableCell>
            <TableCell>To</TableCell>
            <TableCell>Status</TableCell>
            <TableCell align="center">Actions</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {leaves.map((row) => {
            const id = row.id || row._id;
            const employee = row.employee || {};
            return (
              <TableRow key={id}>
                <TableCell>
                  <Box display="flex" alignItems="center" gap={1}>
                    <Avatar
                      src={
                        employee.profileImage
                          ? `${import.meta.env.VITE_API_URL}/${employee.profileImage}`
                          : null
                      }
                    >
                      {employee?.name?.[0] || "?"}
                    </Avatar>

                    <Typography noWrap>
                      {employee.name || employee.email || "—"}
                    </Typography>
                  </Box>
                </TableCell>
                <TableCell>{row.employee?.department?.name || "N/A"}</TableCell>
                <TableCell>{row.type}</TableCell>
                <TableCell>{formatDate(row.startDate)}</TableCell>
                <TableCell>{formatDate(row.endDate)}</TableCell>
                <TableCell>
                  <Chip
                    label={row.status}
                    color={statusColor(row.status)}
                    size="small"
                  />
                </TableCell>
                <TableCell align="center">
                  <IconButton
                    color="success"
                    onClick={() => onApprove && onApprove(id)}
                  >
                    <CheckCircleOutlineIcon />
                  </IconButton>
                  <IconButton
                    color="error"
                    onClick={() => onReject && onReject(id)}
                  >
                    <CancelOutlinedIcon />
                  </IconButton>
                </TableCell>
              </TableRow>
            );
          })}
        </TableBody>
      </Table>
    </TableContainer>
  );
};
export default LeaveTable;
