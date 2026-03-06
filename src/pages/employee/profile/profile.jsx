import React from "react";
import {
  Avatar,
  Box,
  Card,
  CardContent,
  Divider,
  Grid,
  IconButton,
  Tooltip,
  Typography,
} from "@mui/material";
import EditIcon from "@mui/icons-material/Edit";
import { useNavigate } from "react-router-dom";
import PageTitleBar from "../../../components/common/page-title-bar";
import { useFetchMyProfile } from "../../../queries/employee/profile.query";

const InfoRow = ({ label, value }) => {
  return (
    <Box sx={{ py: 1.2 }}>
      <Grid container spacing={2}>
        <Grid size={{ xs: 12, sm: 4 }}>
          <Typography sx={{ color: "text.secondary", fontWeight: 600 }}>
            {label}
          </Typography>
        </Grid>

        <Grid size={{ xs: 12, sm: 8 }}>
          <Typography sx={{ fontWeight: 500 }}>{value || "-"}</Typography>
        </Grid>
      </Grid>
    </Box>
  );
};

const Profile = () => {
  const navigate = useNavigate();

  const { data, isLoading } = useFetchMyProfile();
  const user = data?.employee || {};

  if (isLoading) {
    return <div>Loading...</div>;
  }

  return (
    <Box sx={{ p: 2 }}>
      <PageTitleBar
        title="My Profile"
        breadCrumbs={[
          { label: "Dashboard", href: "/employee/dashboard" },
          { label: "Profile" },
        ]}
      />
      <Box sx={{ display: "flex", justifyContent: "center", mt: 2 }}>
        <Card
          sx={{
            borderRadius: 3,
            boxShadow: 3,
            p: 3,
            width: "100%",
            maxWidth: 1100,
          }}
        >
          <CardContent sx={{ position: "relative" }}>
            <Tooltip title="Edit Profile">
              <IconButton
                sx={{
                  position: "absolute",
                  top: 16,
                  right: 16,
                  bgcolor: "#F1F5F9",
                  "&:hover": { bgcolor: "#E2E8F0" },
                }}
                onClick={() => navigate("/employee/profile/edit")}
              >
                <EditIcon />
              </IconButton>
            </Tooltip>

            <Box
              sx={{
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                gap: 1,
                py: 3,
              }}
            >
              <Avatar
                src={
                  user.profileImage
                    ? `${import.meta.env.VITE_API_URL}/${user.profileImage}?t=${Date.now()}`
                    : ""
                }
                sx={{
                  width: 110,
                  height: 110,
                  bgcolor: "#E2E8F0",
                  fontSize: 40,
                  fontWeight: 700,
                }}
              >
                {user.name?.[0]}
              </Avatar>

              <Typography variant="h5" fontWeight={700}>
                {user.name}
              </Typography>

              <Typography sx={{ color: "text.secondary", fontWeight: 600 }}>
                {user.role}
              </Typography>
            </Box>

            <Divider sx={{ my: 2 }} />

            {/* Personal Info */}
            <Typography variant="h6" fontWeight={700} mb={1}>
              Personal Information
            </Typography>

            <InfoRow label="Email:" value={user.email} />
            <InfoRow label="Phone:" value={user.phone} />
            <InfoRow label="Address:" value={user.address} />

            <Divider sx={{ my: 2 }} />

            {/* Job Info */}
            <Typography variant="h6" fontWeight={700} mb={1}>
              Job Information
            </Typography>

            <InfoRow label="Employee ID:" value={user._id} />
            <InfoRow label="Department:" value={user.department.name} />
            <InfoRow label="Position:" value={user.position} />
            <InfoRow label="Salary:" value={user.salary} />
          </CardContent>
        </Card>
      </Box>
    </Box>
  );
};

export default Profile;
