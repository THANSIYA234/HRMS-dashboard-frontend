import { Card, CardContent, Typography, Grid } from "@mui/material";

import {
  PersonAdd,
  Apartment,
  CheckCircle,
  Assessment,
} from "@mui/icons-material";
import ActionButton from "../../../components/common/action-button";
import { useNavigate } from "react-router-dom";
const QuickActions = () => {
  const navigate = useNavigate();
  return (
    <Card>
      <CardContent>
        <Typography variant="h6" fontWeight={600} mb={2}>
          Quick Actions
        </Typography>

        <Grid
          container
          spacing={3}
          sx={{
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
          }}
        >
          <Grid size={{ xs: 12, md: 3 }}>
            <ActionButton
              icon={<PersonAdd />}
              label="Create Employee"
              color="#3b82f6"
              onClick={() => navigate("/admin/employees/create")}
            />
          </Grid>

          <Grid size={{ xs: 12, md: 3 }}>
            <ActionButton
              icon={<Apartment />}
              label="Manage Departments"
              color="#ef4444"
              onClick={() => navigate("/admin/departments")}
            />
          </Grid>

          <Grid size={{ xs: 12, md: 3 }}>
            <ActionButton
              icon={<CheckCircle />}
              label="Approve Leaves"
              color="#22c55e"
              onClick={() => navigate("/admin/leave")}
            />
          </Grid>

          <Grid size={{ xs: 12, md: 3 }}>
            <ActionButton
              icon={<Assessment />}
              label="Generate Reports"
              color="#8b5cf6"
              onClick={() => navigate("/admin/reports")}
            />
          </Grid>
        </Grid>
      </CardContent>
    </Card>
  );
};

export default QuickActions;
