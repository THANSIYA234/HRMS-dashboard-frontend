import { useEffect, useRef, useState } from "react";
import {
  Avatar,
  Box,
  Button,
  Card,
  CardContent,
  Grid,
  TextField,
  Typography,
  IconButton,
} from "@mui/material";
import EditIcon from "@mui/icons-material/Edit";
import { useNavigate } from "react-router-dom";
import {
  useFetchMyProfile,
  useUpdateMyProfile,
} from "../../../queries/employee/profile.query";

const EditProfile = () => {
  const navigate = useNavigate();
  const fileRef = useRef(null);

  // API hooks
  const { data: profileData, isLoading } = useFetchMyProfile();
  const updateProfile = useUpdateMyProfile();

  const profile = profileData?.employee || profileData || {};

  // Form state
  const [form, setForm] = useState({
    name: "",
    email: "",
    phone: "",
    address: "",

    salary: "",
  });

  const [preview, setPreview] = useState("");
  const [profileFile, setProfileFile] = useState(null);

  // Prefill form when profile loads
  useEffect(() => {
    if (profile) {
      setForm({
        name: profile.name || "",
        email: profile.email || "",
        phone: profile.phone || "",
        address: profile.address || "",

        salary: profile.salary || "",
      });

      if (profile.profileImage) {
        setPreview(
          `http://localhost:5000/uploads/profilePics/${profile.profileImage}?t=${Date.now()}`,
        );
      }
    }
  }, [profileData]);

  const handleChange = (e) => {
    setForm((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  // Image change
  const handleImageChange = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setProfileFile(file);
    setPreview(URL.createObjectURL(file));
  };

  // Save profile
  const handleSave = () => {
    const formData = new FormData();
    formData.append("name", form.name);
    formData.append("phone", form.phone);
    formData.append("address", form.address);

    if (profileFile) {
      formData.append("profileImage", profileFile);
    }
    console.log("BODY:", formData);
    console.log("FILE:", profileFile);

    updateProfile.mutate(formData, {
      onSuccess: () => {
        navigate("/employee/profile");
        alert("Profile updated successfully");
      },
    });
  };

  if (isLoading) return <div>Loading...</div>;

  return (
    <Box sx={{ p: 2 }}>
      <Typography variant="h5" fontWeight={700} mb={2}>
        Edit Profile
      </Typography>

      <Box sx={{ display: "flex", justifyContent: "center" }}>
        <Card sx={{ width: "100%", maxWidth: 1200, borderRadius: 3 }}>
          <CardContent>
            <Box display="flex" alignItems="center" gap={3} mb={3}>
              <Box position="relative">
                <Avatar
                  src={
                    preview ||
                    (profile.profileImage
                      ? `${import.meta.env.VITE_API_URL}/uploads/profilePics/${profile.profileImage}?t=${Date.now()}`
                      : "")
                  }
                  sx={{ width: 90, height: 90 }}
                >
                  {form.name?.[0]}
                </Avatar>

                <IconButton
                  size="small"
                  onClick={() => fileRef.current.click()}
                  sx={{
                    position: "absolute",
                    bottom: 0,
                    right: 0,
                    bgcolor: "#fff",
                  }}
                >
                  <EditIcon fontSize="small" />
                </IconButton>

                <input
                  ref={fileRef}
                  hidden
                  type="file"
                  accept="image/*"
                  onChange={handleImageChange}
                />
              </Box>

              <Box>
                <Typography fontWeight={700}>{form.name}</Typography>
                <Typography color="text.secondary">
                  Click icon to change photo
                </Typography>
              </Box>
            </Box>

            {/* Form */}
            <Grid container spacing={2}>
              <Grid size={{ xs: 12, md: 6 }}>
                <TextField
                  fullWidth
                  label="Full Name"
                  name="name"
                  value={form.name}
                  onChange={handleChange}
                />
              </Grid>

              <Grid size={{ xs: 12, md: 6 }}>
                <TextField
                  fullWidth
                  label="Email"
                  name="email"
                  value={form.email}
                  disabled
                />
              </Grid>

              <Grid size={{ xs: 12, md: 6 }}>
                <TextField
                  fullWidth
                  label="Phone"
                  name="phone"
                  value={form.phone}
                  onChange={handleChange}
                />
              </Grid>

              <Grid size={{ xs: 12, md: 6 }}>
                <TextField
                  fullWidth
                  label="Salary"
                  name="salary"
                  value={form.salary}
                  onChange={handleChange}
                  disabled
                />
              </Grid>

              <Grid size={{ xs: 12, md: 6 }}>
                <TextField
                  fullWidth
                  label="Address"
                  name="address"
                  value={form.address}
                  onChange={handleChange}
                  multiline
                  rows={3}
                />
              </Grid>

              <Grid size={{ xs: 12 }}>
                <Box display="flex" justifyContent="flex-end" gap={2} mt={2}>
                  <Button
                    variant="outlined"
                    onClick={() => navigate("/employee/profile")}
                  >
                    Cancel
                  </Button>

                  <Button
                    variant="contained"
                    onClick={handleSave}
                    disabled={updateProfile.isLoading}
                  >
                    Save Changes
                  </Button>
                </Box>
              </Grid>
            </Grid>
          </CardContent>
        </Card>
      </Box>
    </Box>
  );
};

export default EditProfile;
