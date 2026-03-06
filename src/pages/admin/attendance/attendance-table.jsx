import { Delete, Edit, MoreVert } from "@mui/icons-material";
import {
  Avatar,
  Box,
  Chip,
  IconButton,
  Menu,
  MenuItem,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Typography,
} from "@mui/material";
import React, { useState } from "react";
import { formatTime } from "../../../utils/format-time";
import { formatDate } from "../../../utils/format-date";

import { useDeleteAttendance } from "../../../queries/admin/attendance.query";

function AttendanceTable({ attendance = [], onEdit, showActions = true }) {
  const [anchorEl, setAnchorEl] = useState(null);
  const [selectedAttendance, setSelectedAttendance] = useState(null);
  const open = Boolean(anchorEl);

  const deleteAttendanceMutation = useDeleteAttendance();

  const handleMenuOpen = (event, attendance) => {
    setAnchorEl(event.currentTarget);
    setSelectedAttendance(attendance);
  };
  const handleMenuClose = () => {
    setAnchorEl(null);
    setSelectedAttendance(null);
  };

  const handleEdit = () => {
    if (!selectedAttendance?._id) return;
    onEdit(selectedAttendance);
    handleMenuClose();
  };
  const handleDelete = async () => {
    if (
      !window.confirm("Are you sure you want to delete this attendance record?")
    )
      return;
    await deleteAttendanceMutation.mutateAsync(selectedAttendance._id);
    handleMenuClose();
  };

  return (
    <TableContainer
      sx={{
        border: "1px solid #E5E7EB",
        borderRadius: 1.5,
        overflow: "hidden",
      }}
    >
      <Table>
        <TableHead>
          <TableRow sx={{ backgroundColor: "#f9fafb", borderTop: "#E5E7EB" }}>
            <TableCell>Employee</TableCell>
            <TableCell>Date</TableCell>
            <TableCell>Punch In</TableCell>
            <TableCell>Punch Out</TableCell>
            <TableCell>Status</TableCell>
            {showActions && <TableCell>Actions</TableCell>}
          </TableRow>
        </TableHead>
        <TableBody>
          {Array.isArray(attendance) &&
            attendance.map((att) => {
              const emp = att.employee || {}; // fallback for absent/leave
              return (
                <TableRow hover sx={{ background: "#fff" }} key={att._id}>
                  <TableCell>
                    <Box display="flex" alignItems="center" gap={1}>
                      <Avatar
                        src={
                          emp.profileImage
                            ? emp.profileImage.startsWith("uploads")
                              ? `${import.meta.env.VITE_API_URL}/${emp.profileImage}`
                              : `${import.meta.env.VITE_API_URL}/uploads/profilePics/${emp.profileImage}`
                            : ""
                        }
                      >
                        {emp.name?.[0]}
                      </Avatar>
                      <Typography noWrap>
                        {emp.name || "Unknown Employee"}
                      </Typography>
                    </Box>
                  </TableCell>
                  <TableCell>{formatDate(att.date)}</TableCell>
                  <TableCell>{formatTime(att.punchIn) || "-"}</TableCell>
                  <TableCell>{formatTime(att.punchOut) || "-"}</TableCell>
                  <TableCell>
                    <Chip
                      label={att.status || "Absent"}
                      size="small"
                      color={
                        att.status === "Present"
                          ? "success"
                          : att.status === "Absent"
                            ? "error"
                            : "warning"
                      }
                    />
                  </TableCell>
                  {showActions && (
                    <TableCell>
                      <IconButton
                        size="small"
                        onClick={(e) => handleMenuOpen(e, att)}
                      >
                        <MoreVert fontSize="small" />
                      </IconButton>
                    </TableCell>
                  )}
                </TableRow>
              );
            })}
        </TableBody>
      </Table>
      {showActions && (
        <Menu anchorEl={anchorEl} open={open} onClose={handleMenuClose}>
          <MenuItem onClick={handleEdit}>
            <Edit fontSize="small" sx={{ mr: 1 }} />
            Edit
          </MenuItem>
          <MenuItem onClick={handleDelete} sx={{ color: "error.main" }}>
            <Delete fontSize="small" sx={{ mr: 1 }} />
            Delete
          </MenuItem>
        </Menu>
      )}
    </TableContainer>
  );
}

export default AttendanceTable;
