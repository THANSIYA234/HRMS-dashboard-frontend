import React from "react";
import {
  Card,
  CardContent,
  Typography,
  Box,
  Button,
  Divider,
  Grid,
} from "@mui/material";
import { useAdminProfile } from "../../../queries/admin/profile.queryjs";

const AdminProfile = () => {
  const { data, loading, error } = useAdminProfile();

  if (loading) return <div>Loading...</div>;
  if (error) return <div>Error loading profile</div>;

  return (
    <Box
      sx={{
        minHeight: "100vh",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",

        p: 1,
        mt: 2,
      }}
    >
      <Card
        sx={{ maxWidth: 500, width: "100%", borderRadius: 3, boxShadow: 4 }}
      >
        <CardContent sx={{ p: 4 }}>
          <Typography variant="h5" fontWeight="bold" gutterBottom>
            Admin Profile
          </Typography>

          <Divider sx={{ mb: 3 }} />

          <Grid container spacing={2}>
            <Grid size={{ xs: 12 }}>
              <Typography variant="subtitle2" color="text.secondary">
                Full Name
              </Typography>
              <Typography variant="body1">{data?.name}</Typography>
            </Grid>

            <Grid size={{ xs: 12 }}>
              <Typography variant="subtitle2" color="text.secondary">
                Email
              </Typography>
              <Typography variant="body1">{data?.email}</Typography>
            </Grid>

            <Grid size={{ xs: 12 }}>
              <Typography variant="subtitle2" color="text.secondary">
                Role
              </Typography>
              <Typography variant="body1" sx={{ textTransform: "capitalize" }}>
                {data?.role}
              </Typography>
            </Grid>

            <Grid size={{ xs: 12 }}>
              <Typography variant="subtitle2" color="text.secondary">
                Account Created
              </Typography>
              <Typography variant="body1">
                {data?.createdAt
                  ? new Date(data.createdAt).toLocaleDateString()
                  : ""}
              </Typography>
            </Grid>
          </Grid>

          <Button
            variant="contained"
            fullWidth
            sx={{ mt: 4, borderRadius: 2 }}
            onClick={() => window.history.back()}
          >
            Back
          </Button>
        </CardContent>
      </Card>
    </Box>
  );
};

export default AdminProfile;
