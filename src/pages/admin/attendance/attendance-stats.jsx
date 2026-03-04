import { Grid } from "@mui/material";
import StatCard from "../../../components/common/statCard";

import { Cancel, EventBusy, Groups, HowToReg } from "@mui/icons-material";

function AttendanceStats({ stats }) {
  return (
    <Grid
      container
      spacing={3}
      sx={{
        mb: 3,
      }}
    >
      <Grid size={{ xs: 12, md: 3, sm: 6 }}>
        <StatCard
          title="Total Employees"
          value={stats?.totalEmployees ?? "—"}
          icon={<Groups />}
          color="#1976d2"
          iconBg="#e3f2fd"
          backgroundColor={"#1976d2"}
        />
      </Grid>
      <Grid size={{ xs: 12, md: 3, sm: 6 }}>
        <StatCard
          title="Present Today"
          value={stats?.present ?? "—"}
          icon={<HowToReg />}
          color="#2e7d32"
          iconBg="#e8f5e9"
          backgroundColor={"#2e7d32"}
        />
      </Grid>

      <Grid size={{ xs: 12, md: 3, sm: 6 }}>
        <StatCard
          title="Absent Today"
          value={stats?.absent ?? "—"}
          icon={<Cancel />}
          color="#d32f2f"
          iconBg="#fdecea"
          backgroundColor={"#db523aff"}
        />
      </Grid>

      <Grid size={{ xs: 12, md: 3, sm: 6 }}>
        <StatCard
          title="On Leave"
          value={stats?.leave ?? "—"}
          icon={<EventBusy />}
          color="#ed6c02"
          iconBg="#fff3e0"
          backgroundColor={"#ed6c02"}
        />
      </Grid>
    </Grid>
  );
}

export default AttendanceStats;
