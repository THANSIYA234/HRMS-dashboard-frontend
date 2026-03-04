import { Delete, Edit, MoreVert, Visibility } from "@mui/icons-material";
import {
  IconButton,
  Menu,
  MenuItem,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
} from "@mui/material";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useDeleteDepartment } from "../../../queries/admin/department.query";

const DepartmentTable = ({ department = [] }) => {
  const navigate = useNavigate();
  const [anchorEl, setAnchorEl] = useState(null);
  const [selectedDepartment, setSelectedDepartment] = useState(null);
  const deleteDepartmentMutation = useDeleteDepartment();

  const open = Boolean(anchorEl);

  const handleMenuOpen = (event, department) => {
    setAnchorEl(event.currentTarget);
    setSelectedDepartment(department);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
    setSelectedDepartment(null);
  };
  const handleView = () => {
    if (!selectedDepartment?._id) return;
    navigate(`/admin/departments/${selectedDepartment._id}`);
    handleMenuClose();
  };

  const handleEdit = () => {
    if (!selectedDepartment?._id) return;
    navigate(`/admin/departments/${selectedDepartment._id}?edit=true`);
    handleMenuClose();
  };
  const handleDelete = async () => {
    if (!window.confirm("Are you sure you want to delete this department?"))
      return;

    await deleteDepartmentMutation.mutateAsync(selectedDepartment._id);
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
            <TableCell>Name</TableCell>

            <TableCell>Head</TableCell>
            <TableCell>Employees</TableCell>
            <TableCell>Created At</TableCell>
            <TableCell align="right">Actions</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {department.map((dep) => (
            <TableRow key={dep._id} hover sx={{ background: "#fff" }}>
              <TableCell>{dep.name}</TableCell>
              <TableCell>{dep.head?.name || "N/A"}</TableCell>
              <TableCell>{dep.employeeCount || 0}</TableCell>
              <TableCell>
                {new Date(dep.createdAt).toLocaleDateString()}
              </TableCell>

              <TableCell align="right">
                <IconButton onClick={(e) => handleMenuOpen(e, dep)}>
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

export default DepartmentTable;
