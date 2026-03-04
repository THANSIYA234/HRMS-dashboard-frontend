import { Box, Button, Card, CardContent, TextField } from "@mui/material";
import PageTitleBar from "../../../components/common/page-title-bar";
import { useState } from "react";
import { useCreateDepartment } from "../../../queries/admin/department.query";
import { useNavigate } from "react-router-dom";

const CreateDepartment = () => {
  const [formData, setFormData] = useState({
    name: "",
    description: "",
  });
  const createDepartmentMutation = useCreateDepartment();
  const navigate = useNavigate();

  const handleChange = (e) =>
    setFormData({ ...formData, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    await createDepartmentMutation.mutateAsync(formData);
    navigate("/admin/departments");
  };

  return (
    <Box minHeight="100vh">
      <PageTitleBar
        title="Create Department"
        breadCrumbs={[
          { label: "Dashboard", href: "/admin" },
          { label: "Department", href: "/admin/departments" },
          { label: "Create Department" },
        ]}
      />
      <Box maxWidth={800} mx="auto">
        <Card sx={{ minHeight: 400, p: 3 }}>
          <CardContent sx={{ gap: 3 }}>
            <form onSubmit={handleSubmit}>
              <TextField
                label="Department Name"
                name="name"
                value={formData.name}
                onChange={handleChange}
                fullWidth
                required
                sx={{ mb: 4 }}
              />

              <TextField
                label="Description"
                name="description"
                value={formData.description}
                onChange={handleChange}
                fullWidth
                multiline
                rows={3}
                sx={{ mt: 2, mb: 3 }}
              />
              <Box
                sx={{
                  display: "flex",
                  justifyContent: "flex-end",
                  gap: 3,
                  mt: 3,
                }}
              >
                <Button type="submit" variant="contained">
                  Create
                </Button>
                <Button
                  variant="outlined"
                  onClick={() => navigate("/admin/departments")}
                >
                  Cancel
                </Button>
              </Box>
            </form>
          </CardContent>
        </Card>
      </Box>
    </Box>
  );
};
export default CreateDepartment;
