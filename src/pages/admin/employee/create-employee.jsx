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
import PageTitleBar from "../../../components/common/page-title-bar";
import { useNavigate } from "react-router-dom";
import { useState } from "react";
import { registerUser } from "../../../services/auth.service";
import { useCreateEmployee } from "../../../queries/admin/employee.query";
import { useGetDepartments } from "../../../queries/admin/department.query";

const CreateEmployeePage = () => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    role: "employee",
    position: "",
    salary: "",
    phone: "",
    department: "",
  });
  const [profileImage, setProfileImage] = useState(null);
  const [loading, setLoading] = useState(false);
  const createEmployeeMutation = useCreateEmployee();
  const { data: departments = [], isLoading } = useGetDepartments();
  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleFileChange = (e) => {
    setProfileImage(e.target.files[0]);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      //  CREATE USER
      const userPayload = {
        name: formData.name,
        email: formData.email,
        password: formData.password,
        role: formData.role,
      };

      const userRes = await registerUser(userPayload);
      console.log("registerUser response:", userRes);

      const userId =
        userRes?.userWithoutPassword?._id ||
        userRes?.userWithoutPassword?.id ||
        userRes?.user?._id ||
        userRes?.user?.id;

      if (!userId) {
        throw new Error("User creation failed");
      }

      // CREATE EMPLOYEE
      const employeeFormData = new FormData();
      employeeFormData.append("userId", userId);
      employeeFormData.append("name", formData.name);
      employeeFormData.append("email", formData.email);
      employeeFormData.append("position", formData.position);
      employeeFormData.append("salary", formData.salary);
      employeeFormData.append("phone", formData.phone);
      employeeFormData.append("department", formData.department);

      if (profileImage) {
        employeeFormData.append("profileImage", profileImage);
      }

      await createEmployeeMutation.mutateAsync(employeeFormData);

      //SUCCESS
      navigate("/admin/employees");
    } catch (error) {
      console.error(error);
      alert(
        error?.response?.data?.message ||
          "Something went wrong while creating employee",
      );
    } finally {
      setLoading(false);
    }
  };

  const navigate = useNavigate();
  return (
    <Box>
      <PageTitleBar
        title="Create Employee"
        breadCrumbs={[
          { label: "Dashboard", href: "/admin" },
          { label: "Employees", href: "/admin/employees" },
          { label: "Create Employee" },
        ]}
      />
      <Box sx={{ maxWidth: 1100, mx: "auto", p: 3, maxHeight: 700 }}>
        <Card sx={{ p: 2 }}>
          <CardContent>
            <form onSubmit={handleSubmit}>
              <Typography variant="subtitle1" fontWeight={600} mb={1}>
                Account Information
              </Typography>
              <Grid container spacing={3}>
                <Grid size={{ xs: 12, md: 6 }}>
                  <TextField
                    label="Name"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    fullWidth
                    required
                  />
                </Grid>
                <Grid size={{ xs: 12, md: 6 }}>
                  <TextField
                    label="Email"
                    name="email"
                    type="email"
                    value={formData.email}
                    onChange={handleChange}
                    fullWidth
                    required
                  />
                </Grid>
                <Grid size={{ xs: 12, md: 6 }}>
                  <TextField
                    label="Password"
                    name="password"
                    type="password"
                    value={formData.password}
                    onChange={handleChange}
                    fullWidth
                    required
                  />
                </Grid>
                <Grid size={{ xs: 12, md: 6 }}>
                  <TextField
                    label="Address"
                    name="address"
                    type="text"
                    value={formData.address}
                    onChange={handleChange}
                    fullWidth
                    required
                  />
                </Grid>
                <Grid size={{ xs: 12, md: 6 }}>
                  <TextField
                    label="Role"
                    name="role"
                    value={formData.role}
                    fullWidth
                    required
                  />
                </Grid>
                <Grid size={{ xs: 12, md: 12 }}>
                  <Typography
                    variant="subtitle1"
                    fontWeight={600}
                    mt={3}
                    mb={1}
                  >
                    Employee Details
                  </Typography>
                </Grid>
                <Grid size={{ xs: 12, md: 6 }}>
                  <TextField
                    label="Position"
                    name="position"
                    value={formData.position}
                    onChange={handleChange}
                    fullWidth
                    required
                  />
                </Grid>

                <Grid size={{ xs: 12, md: 6 }}>
                  <TextField
                    label="Salary"
                    name="salary"
                    value={formData.salary}
                    onChange={handleChange}
                    fullWidth
                    required
                  />
                </Grid>
                <Grid size={{ xs: 12, md: 6 }}>
                  <TextField
                    label="Phone"
                    name="phone"
                    value={formData.phone}
                    onChange={handleChange}
                    fullWidth
                    required
                  />
                </Grid>
                <Grid size={{ xs: 12, md: 6 }}>
                  <TextField
                    select
                    label="Department"
                    name="department"
                    value={formData.department}
                    onChange={handleChange}
                    disabled={isLoading}
                    fullWidth
                    required
                  >
                    {departments.map((dept) => (
                      <MenuItem key={dept._id} value={dept._id}>
                        {dept.name}
                      </MenuItem>
                    ))}
                  </TextField>
                </Grid>
                <Grid size={{ xs: 12 }}>
                  <Button variant="outlined" component="label">
                    Upload Profile Image
                    <input type="file" hidden onChange={handleFileChange} />
                  </Button>
                </Grid>
                <Grid
                  size={{ xs: 12, md: 12 }}
                  display="flex"
                  justifyContent="flex-end"
                  gap={2}
                >
                  <Button type="submit" variant="contained" disabled={loading}>
                    {loading ? "Creating..." : "Create Employee"}
                  </Button>

                  <Button
                    type="button"
                    variant="outlined"
                    onClick={() => navigate(-1)} // goes back to previous page
                  >
                    Cancel
                  </Button>
                </Grid>
              </Grid>
            </form>
          </CardContent>
        </Card>
      </Box>
    </Box>
  );
};
export default CreateEmployeePage;
