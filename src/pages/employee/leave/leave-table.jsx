import { Delete, MoreVert, Visibility, Edit } from "@mui/icons-material";
import {
  Box,
  Chip,
  CircularProgress,
  Dialog,
  DialogTitle,
  DialogContent,
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
  DialogActions,
  Button,
  TextField,
} from "@mui/material";
import { useState, useEffect } from "react";
import {
  useDeleteLeave,
  useFetchMyLeaves,
  useGetLeaveById,
  useUpdateLeave,
} from "../../../queries/employee/leave.query";

const LeaveTable = () => {
  const [anchorEl, setAnchorEl] = useState(null);
  const [selectedId, setSelectedId] = useState(null);
  const [openDialog, setOpenDialog] = useState(false);
  const [isEdit, setIsEdit] = useState(false);
  const [formData, setFormData] = useState({
    type: "",
    startDate: "",
    endDate: "",
    reason: "",
  });

  const open = Boolean(anchorEl);
  const { data, isLoading } = useFetchMyLeaves();
  const { data: leaveData, isLoading: isLeaveLoading } = useGetLeaveById(
    selectedId,
    { enabled: !!selectedId },
  );
  const updateLeaveMutation = useUpdateLeave();
  const deleteLeaveMutation = useDeleteLeave(selectedId);

  const leaves = data?.leaves || [];
  const selectedLeave = leaveData?.leave;

  const toInputDate = (date) => {
    if (!date) return "";
    const d = new Date(date);
    return isNaN(d.getTime()) ? "" : d.toISOString().split("T")[0]; // YYYY-MM-DD
  };

  const formatDisplayDate = (date) =>
    date ? new Date(date).toLocaleDateString("en-GB") : "";

  useEffect(() => {
    if (!selectedLeave) return;
    setFormData({
      type: selectedLeave.type || "",
      startDate: toInputDate(selectedLeave.startDate),
      endDate: toInputDate(selectedLeave.endDate),
      reason: selectedLeave.reason || "",
    });
    setIsEdit(false);
  }, [selectedLeave]);

  const getStatusColor = (status) =>
    status === "Approved"
      ? "success"
      : status === "Pending"
        ? "warning"
        : "error";

  const handleMenuOpen = (e, id) => {
    setAnchorEl(e.currentTarget);
    setSelectedId(id);
  };
  const handleMenuClose = () => setAnchorEl(null);

  const handleView = () => {
    setOpenDialog(true);
    handleMenuClose();
  };

  const handleDelete = async () => {
    if (!window.confirm("Delete leave?")) return;
    await deleteLeaveMutation.mutateAsync(selectedId);
    handleMenuClose();
  };

  const handleCloseDialog = () => {
    setOpenDialog(false);
    setIsEdit(false);
  };

  const handleChange = (field, value) =>
    setFormData((prev) => ({ ...prev, [field]: value }));

  const handleSave = () => {
    // Convert formData to Date objects before sending to backend
    const payload = {
      type: formData.type,
      reason: formData.reason,
      startDate: formData.startDate ? new Date(formData.startDate) : null,
      endDate: formData.endDate ? new Date(formData.endDate) : null,
    };

    updateLeaveMutation.mutate(
      { id: selectedId, data: payload },
      {
        onSuccess: () => {
          alert("Leave updated successfully");
          setOpenDialog(false);
        },
        onError: (err) => {
          console.error(err);
          alert(err.response?.data?.message || "Update failed");
        },
      },
    );
  };

  if (isLoading)
    return (
      <Box display="flex" justifyContent="center" p={4}>
        <CircularProgress />
      </Box>
    );

  if (leaves.length === 0)
    return <Typography p={2}>No leave records available.</Typography>;

  return (
    <>
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
              <TableCell>Type</TableCell>
              <TableCell>Start</TableCell>
              <TableCell>End</TableCell>
              <TableCell>Status</TableCell>
              <TableCell>Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {leaves.map((l) => (
              <TableRow key={l._id}>
                <TableCell>{l.type}</TableCell>
                <TableCell>{formatDisplayDate(l.startDate)}</TableCell>
                <TableCell>{formatDisplayDate(l.endDate)}</TableCell>
                <TableCell>
                  <Chip label={l.status} color={getStatusColor(l.status)} />
                </TableCell>
                <TableCell>
                  <IconButton onClick={(e) => handleMenuOpen(e, l._id)}>
                    <MoreVert />
                  </IconButton>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>

      {/* Menu */}
      <Menu anchorEl={anchorEl} open={open} onClose={handleMenuClose}>
        <MenuItem onClick={handleView}>
          <Visibility sx={{ mr: 1 }} />
          View
        </MenuItem>
        <MenuItem onClick={handleDelete} sx={{ color: "error.main" }}>
          <Delete sx={{ mr: 1 }} />
          Delete
        </MenuItem>
      </Menu>

      {/* Dialog */}
      <Dialog
        open={openDialog}
        onClose={handleCloseDialog}
        fullWidth
        maxWidth="sm"
      >
        <DialogTitle>
          <Box
            display="flex"
            justifyContent="space-between"
            alignItems="center"
          >
            Leave Details
            {selectedLeave?.status === "Pending" && (
              <IconButton onClick={() => setIsEdit(!isEdit)}>
                <Edit />
              </IconButton>
            )}
          </Box>
        </DialogTitle>
        <DialogContent>
          {isLeaveLoading ? (
            <Box display="flex" justifyContent="center" py={5}>
              <CircularProgress />
            </Box>
          ) : (
            <Box display="flex" flexDirection="column" gap={2} mt={2}>
              {isEdit ? (
                <>
                  <TextField
                    label="Type"
                    value={formData.type}
                    onChange={(e) => handleChange("type", e.target.value)}
                  />
                  <Box display="flex" gap={2}>
                    <TextField
                      type="date"
                      label="Start Date"
                      value={formData.startDate || ""}
                      onChange={(e) =>
                        handleChange("startDate", e.target.value)
                      }
                      fullWidth
                    />
                    <TextField
                      type="date"
                      label="End Date"
                      value={formData.endDate || ""}
                      onChange={(e) => handleChange("endDate", e.target.value)}
                      fullWidth
                    />
                  </Box>
                  <TextField
                    label="Reason"
                    multiline
                    rows={3}
                    value={formData.reason}
                    onChange={(e) => handleChange("reason", e.target.value)}
                  />
                </>
              ) : (
                <>
                  <Typography>Type: {selectedLeave?.type || "-"}</Typography>
                  <Typography>
                    Start Date: {formatDisplayDate(selectedLeave?.startDate)}
                  </Typography>
                  <Typography>
                    End Date: {formatDisplayDate(selectedLeave?.endDate)}
                  </Typography>
                  <Typography>
                    Reason: {selectedLeave?.reason || "-"}
                  </Typography>
                </>
              )}
            </Box>
          )}
        </DialogContent>
        <DialogActions>
          {isEdit && (
            <>
              <Button variant="contained" onClick={handleSave}>
                Save
              </Button>
              <Button variant="outlined" onClick={() => setIsEdit(false)}>
                Cancel
              </Button>
            </>
          )}
          <Button variant="outlined" onClick={handleCloseDialog}>
            Close
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
};

export default LeaveTable;
