import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Button,
} from "@mui/material";
import { useState, useEffect } from "react";
import { useUpdateAttendance } from "../../../queries/admin/attendance.query";

const EditAttendanceDialog = ({ open, onClose, record, onSave }) => {
  const [form, setForm] = useState({ punchIn: "", punchOut: "" });

  const updateFormMutation = useUpdateAttendance();

  // ✅ Format date properly for datetime-local (without UTC shift)
  const formatDateTimeLocal = (date) => {
    if (!date) return "";
    const d = new Date(date);
    const offset = d.getTimezoneOffset();
    const localDate = new Date(d.getTime() - offset * 60000);
    return localDate.toISOString().slice(0, 16);
  };

  useEffect(() => {
    if (record) {
      setForm({
        punchIn: formatDateTimeLocal(record.punchIn),
        punchOut: formatDateTimeLocal(record.punchOut),
      });
    }
  }, [record]);

  const handleChange = (name, value) => {
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleSave = () => {
    if (!record?._id) return;

    updateFormMutation.mutate(
      {
        id: record._id,
        data: {
          punchIn: form.punchIn ? new Date(form.punchIn) : null,
          punchOut: form.punchOut ? new Date(form.punchOut) : null,
        },
      },
      {
        onSuccess: (data) => {
          onSave?.(data);
          handleClose();
        },
      },
    );
  };

  const handleClose = () => {
    setForm({ punchIn: "", punchOut: "" });
    onClose?.();
  };

  return (
    <Dialog open={open} onClose={handleClose} maxWidth="sm" fullWidth>
      <DialogTitle>Edit Attendance</DialogTitle>

      <DialogContent
        sx={{
          display: "flex",
          flexDirection: "column",
          gap: 2,
          mt: 2,
        }}
      >
        <TextField
          label="Punch In"
          type="datetime-local"
          size="small"
          value={form.punchIn}
          onChange={(e) => handleChange("punchIn", e.target.value)}
          fullWidth
          sx={{ mt: 1 }}
        />

        <TextField
          label="Punch Out"
          type="datetime-local"
          size="small"
          value={form.punchOut}
          onChange={(e) => handleChange("punchOut", e.target.value)}
          fullWidth
        />
      </DialogContent>

      <DialogActions>
        <Button onClick={handleClose}>Cancel</Button>
        <Button
          variant="contained"
          onClick={handleSave}
          disabled={updateFormMutation.isLoading}
        >
          {updateFormMutation.isLoading ? "Saving..." : "Save"}
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default EditAttendanceDialog;
