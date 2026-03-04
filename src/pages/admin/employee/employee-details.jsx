import {
  Avatar,
  Box,
  Button,
  Card,
  CardContent,
  Grid,
  MenuItem,
  TextField,
  Typography,
} from "@mui/material";

import {
  useEmployeeById,
  useUpdateEmployee,
} from "../../../queries/admin/employee.query";
import { useEffect, useState } from "react";
import { useGetDepartments } from "../../../queries/admin/department.query";
import { useNavigate, useParams, useSearchParams } from "react-router-dom";
import PageTitleBar from "../../../components/common/page-title-bar";

const EmployeeDetailsPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const [isEditMode, setIsEditMode] = useState(false);

  useEffect(() => {
    setIsEditMode(searchParams.get("edit") === "true");
  }, [searchParams]);

  const [profileImage, setProfileImage] = useState(null);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    position: "",
    salary: "",
    department: "",
  });

  const { data: employee = [], isLoading } = useEmployeeById(id);
  const { data: departments = [] } = useGetDepartments();
  const updateEmployeeMutation = useUpdateEmployee();
  useEffect(() => {
    if (employee) {
      setFormData({
        name: employee.name || "",
        email: employee.email || "",
        phone: employee.phone || "",
        position: employee.position || "",
        salary: employee.salary || "",
        department: employee.department?._id || "",
      });
    }
  }, [employee]);

  const handleChange = (e) =>
    setFormData({ ...formData, [e.target.name]: e.target.value });

  const handleSubmit = async () => {
    const data = new FormData();
    Object.entries(formData).forEach(([k, v]) => data.append(k, v));
    if (profileImage) data.append("profileImage", profileImage);

    await updateEmployeeMutation.mutateAsync({ id, data });
    setIsEditMode(false);
  };

  if (isLoading) return null;
  const deptName =
    departments.find((d) => d._id === employee.department)?.name || "N/A";

  return (
    <Box>
      <PageTitleBar
        title="Employee Details"
        breadCrumbs={[
          { label: "Dashboard", href: "/admin" },
          { label: "Employees", href: "/admin/employees" },
          { label: employee.name },
        ]}
      />
      <Box sx={{ maxWidth: 1100, mx: "auto", p: 3, maxHeight: 700 }}>
        <Card sx={{ p: 3 }}>
          <CardContent>
            <Grid container spacing={2}>
              <Grid size={{ xs: 12 }}>
                <Avatar
                  src={
                    employee.profileImage
                      ? `http://localhost:5000/${employee.profileImage}`
                      : null
                  }
                  sx={{ width: 100, height: 100 }}
                />
                {isEditMode && (
                  <Button component="label" size="small">
                    Change Prfile Image
                    <input
                      hidden
                      type="file"
                      onChange={(e) => setProfileImage(e.target.files[0])}
                    />
                  </Button>
                )}
              </Grid>
              <Grid size={{ xs: 12, md: 6 }}>
                {isEditMode ? (
                  <TextField
                    label="Name"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    fullWidth
                  />
                ) : (
                  <Typography>
                    <b>Name:</b> {employee.name}
                  </Typography>
                )}
              </Grid>

              {/* EMAIL */}
              <Grid size={{ xs: 12, md: 6 }}>
                {isEditMode ? (
                  <TextField
                    label="Email"
                    name="email"
                    value={formData.email}
                    disabled
                    fullWidth
                  />
                ) : (
                  <Typography>
                    <b>Email:</b> {employee.email}
                  </Typography>
                )}
              </Grid>
              <Grid size={{ xs: 12, md: 6 }}>
                {isEditMode ? (
                  <TextField
                    label="Salary"
                    name="salary"
                    value={formData.salary}
                    onChange={handleChange}
                    fullWidth
                  />
                ) : (
                  <Typography>
                    <b>Salary:</b> {employee.salary}
                  </Typography>
                )}
              </Grid>
              <Grid size={{ xs: 12, md: 6 }}>
                {isEditMode ? (
                  <TextField
                    label="Phone"
                    name="phone"
                    value={formData.phone}
                    onChange={handleChange}
                    fullWidth
                  />
                ) : (
                  <Typography>
                    <b>Phone:</b> {employee.phone}
                  </Typography>
                )}
              </Grid>

              {/* POSITION */}
              <Grid size={{ xs: 12, md: 6 }}>
                {isEditMode ? (
                  <TextField
                    label="Position"
                    name="position"
                    value={formData.position}
                    onChange={handleChange}
                    fullWidth
                  />
                ) : (
                  <Typography>
                    <b>Position:</b> {employee.position}
                  </Typography>
                )}
              </Grid>
              {/* DEPARTMENT */}
              <Grid size={{ xs: 12, md: 6 }}>
                {isEditMode ? (
                  <TextField
                    select
                    label="Department"
                    name="department"
                    value={formData.department}
                    onChange={handleChange}
                    fullWidth
                  >
                    {departments.map((d) => (
                      <MenuItem key={d._id} value={d._id}>
                        {d.name}
                      </MenuItem>
                    ))}
                  </TextField>
                ) : (
                  <Typography>
                    <b>Department:</b> {deptName}
                  </Typography>
                )}
              </Grid>
              {/* ACTION BUTTONS */}
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
    </Box>
  );
};
export default EmployeeDetailsPage;
