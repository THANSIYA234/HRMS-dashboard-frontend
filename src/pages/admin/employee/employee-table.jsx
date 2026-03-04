import { Delete, Edit, MoreVert, Visibility } from "@mui/icons-material";
import {
  Avatar,
  Box,
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
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useDeleteEmployee } from "../../../queries/admin/employee.query";

const EmployeeTable = ({ employees = [] }) => {
  const navigate = useNavigate();
  const [anchorEl, setAnchorEl] = useState(null);
  const [selectedEmployee, setSelectedEmployee] = useState(null);
  const deleteEmployeeMutation = useDeleteEmployee();

  const open = Boolean(anchorEl);

  const handleMenuOpen = (event, employee) => {
    setAnchorEl(event.currentTarget);
    setSelectedEmployee(employee);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
    setSelectedEmployee(null);
  };
  const handleView = () => {
    if (!selectedEmployee?._id) return;
    navigate(`/admin/employees/${selectedEmployee._id}`);
    handleMenuClose();
  };

  const handleEdit = () => {
    if (!selectedEmployee?._id) return;
    navigate(`/admin/employees/${selectedEmployee._id}?edit=true`);
    handleMenuClose();
  };
  const handleDelete = async () => {
    if (!window.confirm("Are you sure you want to delete this employee?"))
      return;

    await deleteEmployeeMutation.mutateAsync(selectedEmployee._id);
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

            <TableCell>Department</TableCell>
            <TableCell>Position</TableCell>
            <TableCell>Phone</TableCell>
            <TableCell align="right">Actions</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {employees.map((emp) => (
            <TableRow key={emp._id} hover sx={{ background: "#fff" }}>
              <TableCell>
                <Box display="flex" alignItems="center" gap={2}>
                  <Avatar
                    src={
                      emp.profileImage
                        ? `http://localhost:5000/uploads/profilePics/${emp.profileImage}`
                        : null
                    }
                  >
                    {emp.name[0]}
                  </Avatar>
                  <Box>
                    <Typography fontWeight={600}>{emp.name}</Typography>
                    <Typography variant="body2" color="text.secondary">
                      {emp.email}
                    </Typography>
                  </Box>
                </Box>
              </TableCell>

              <TableCell>
                {emp.department?.name || emp.department || "N/A"}
              </TableCell>
              <TableCell>{emp.position}</TableCell>
              <TableCell>{emp.phone}</TableCell>

              <TableCell align="right">
                <IconButton onClick={(e) => handleMenuOpen(e, emp)}>
                  <MoreVert />
                </IconButton>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
      {/* MENU */}
      <Menu anchorEl={anchorEl} open={open} onClose={handleMenuClose}>
        <MenuItem onClick={handleView}>
          <Visibility fontSize="small" sx={{ mr: 1 }} />
          View
        </MenuItem>
        <MenuItem onClick={handleEdit}>
          <Edit fontSize="small" sx={{ mr: 1 }} />
          Edit
        </MenuItem>
        <MenuItem onClick={handleDelete} sx={{ color: "error.main" }}>
          <Delete fontSize="small" sx={{ mr: 1 }} />
          Delete
        </MenuItem>
      </Menu>
    </TableContainer>
  );
};
export default EmployeeTable;
