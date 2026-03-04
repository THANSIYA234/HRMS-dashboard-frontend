import {
  Box,
  Button,
  Card,
  CardContent,
  Grid,
  MenuItem,
  TextField,
  Typography,
} from "@mui/material";

import { useEffect, useState } from "react";
import { useNavigate, useParams, useSearchParams } from "react-router-dom";

import PageTitleBar from "../../../components/common/page-title-bar";
import {
  useAssignHeadToDepartment,
  useGetDepartmentById,
  useGetEmployeesByDepartmentId,
  useUpdateDepartment,
} from "../../../queries/admin/department.query";

const DepartmentDetailsPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();

  const [isEditMode, setIsEditMode] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    description: "",
  });
  const [selectedHead, setSelectedHead] = useState("");

  const { data: department, isLoading: deptLoading } = useGetDepartmentById(id);

  const { data: employees = [] } = useGetEmployeesByDepartmentId(id);

  const updateDepartmentMutation = useUpdateDepartment();
  const assignHeadMutation = useAssignHeadToDepartment();

  useEffect(() => {
    setIsEditMode(searchParams.get("edit") === "true");
  }, [searchParams]);

  useEffect(() => {
    if (department) {
      setFormData({
        name: department.name || "",
        description: department.description || "",
      });
      setSelectedHead(department.head?._id || "");
    }
  }, [department]);

  const handleChange = (e) =>
    setFormData({ ...formData, [e.target.name]: e.target.value });

  const handleSubmit = async () => {
    await updateDepartmentMutation.mutateAsync({ id, data: formData });

    if (selectedHead) {
      await assignHeadMutation.mutateAsync({
        departmentId: id,
        employeeId: selectedHead,
      });
    }

    setIsEditMode(false);
  };

  if (deptLoading || !department) {
    return <Typography>Loading department...</Typography>;
  }

  return (
    <Box>
      <PageTitleBar
        title="Department Details"
        breadCrumbs={[
          { label: "Dashboard", href: "/admin" },
          { label: "Departments", href: "/admin/departments" },
          { label: department.name },
        ]}
      />

      <Card sx={{ maxWidth: 900, mx: "auto", p: 3 }}>
        <CardContent>
          <Grid container spacing={2}>
            {/* Name */}
            <Grid size={{ xs: 12 }}>
              {isEditMode ? (
                <TextField
                  label="Department Name"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  fullWidth
                />
              ) : (
                <Typography>
                  <b>Name:</b> {department.name}
                </Typography>
              )}
            </Grid>

            {/* Description */}
            <Grid size={{ xs: 12 }}>
              {isEditMode ? (
                <TextField
                  label="Description"
                  name="description"
                  value={formData.description}
                  onChange={handleChange}
                  fullWidth
                  multiline
                  rows={3}
                />
              ) : (
                <Typography>
                  <b>Description:</b> {department.description || "—"}
                </Typography>
              )}
            </Grid>

            {/* Department Head */}
            <Grid size={{ xs: 12, md: 6 }}>
              {isEditMode ? (
                <TextField
                  select
                  label="Department Head"
                  value={selectedHead}
                  onChange={(e) => setSelectedHead(e.target.value)}
                  fullWidth
                >
                  {employees.length === 0 ? (
                    <MenuItem disabled>
                      No employees in this department
                    </MenuItem>
                  ) : (
                    employees.map((emp) => (
                      <MenuItem key={emp._id} value={emp._id}>
                        {emp.name}
                      </MenuItem>
                    ))
                  )}
                </TextField>
              ) : (
                <Typography>
                  <b>Head:</b>{" "}
                  {department.head ? department.head.name : "Not Assigned"}
                </Typography>
              )}
            </Grid>

            {/* Employee Count */}
            <Grid size={{ xs: 12, md: 6 }}>
              <Typography>
                <b>Employees:</b> {department.employeeCount || 0}
              </Typography>
            </Grid>

            {/* Created At */}
            <Grid size={{ xs: 12, md: 6 }}>
              <Typography color="text.secondary">
                <b>Created At:</b>{" "}
                {new Date(department.createdAt).toLocaleDateString()}
              </Typography>
            </Grid>

            {/* Actions */}
            <Grid
              size={{ xs: 12 }}
              display="flex"
              justifyContent="flex-end"
              gap={2}
            >
              {isEditMode ? (
                <>
                  <Button variant="contained" onClick={handleSubmit}>
                    Save
                  </Button>
                  <Button
                    variant="outlined"
                    onClick={() => setIsEditMode(false)}
                  >
                    Cancel
                  </Button>
                </>
              ) : (
                <>
                  <Button
                    variant="contained"
                    onClick={() => setIsEditMode(true)}
                  >
                    Edit
                  </Button>
                  <Button variant="outlined" onClick={() => navigate(-1)}>
                    Back
                  </Button>
                </>
              )}
            </Grid>
          </Grid>
        </CardContent>
      </Card>
    </Box>
  );
};

export default DepartmentDetailsPage;
