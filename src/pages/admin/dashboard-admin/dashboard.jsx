import { Box } from "@mui/material";
import Grid from "@mui/material/Grid";
import {
  ApartmentOutlined,
  Cancel,
  CheckCircle,
  People,
} from "@mui/icons-material";
import StatCard from "../../../components/common/statCard";
import DepartmentChart from "./department-chart";

import QuickActions from "./quick-actions";

import {
  useGetAllAttendance,
  useGetAttendanceStats,
} from "../../../queries/admin/attendance.query";
import { useGetDepartments } from "../../../queries/admin/department.query";
import AttendanceTable from "../attendance/attendance-table";
import AttendanceTrendChart from "./attendence-chart";

const DashboardPage = () => {
  const { data: stats } = useGetAttendanceStats();
  const { data: department } = useGetDepartments();
  const { data } = useGetAllAttendance({ limit: 5 });
  const attendance = data?.records || [];
  return (
    <Box sx={{ p: 3, maxWidth: 1400, mx: "auto" }}>
      {/* ================= STAT CARDS ================= */}
      <Grid container spacing={3}>
        <Grid size={{ xs: 12, md: 3 }}>
          <StatCard
            title="Total Employees"
            value={stats?.totalEmployees}
            icon={<People />}
            iconBg="#e3f2fd"
            color="#1976d2"
            backgroundColor={"#1976d2"}
          />
        </Grid>

        <Grid size={{ xs: 12, md: 3 }}>
          <StatCard
            title="Present Today"
            value={stats?.present || 0}
            sx={{ color: "#2e7d32" }}
            icon={<CheckCircle />}
            iconBg="#e8f5e9"
            color="#2e7d32"
            backgroundColor={"#2e7d32"}
          />
        </Grid>

        <Grid size={{ xs: 12, md: 3 }}>
          <StatCard
            title="Absent Today"
            value={stats?.absent}
            icon={<Cancel />}
            iconBg="#fdecea"
            color="#d32f2f"
            backgroundColor={"#db523aff"}
          />
        </Grid>

        <Grid size={{ xs: 12, md: 3 }}>
          <StatCard
            title="Departments"
            value={department?.length}
            icon={<ApartmentOutlined />}
            iconBg="#fff3e0"
            color="#ed6c02"
            backgroundColor={"#ed6c02"}
          />
        </Grid>
      </Grid>

      {/* ================= CHARTS ROW ================= */}
      <Grid container spacing={3} mt={3}>
        <Grid size={{ xs: 12, md: 6 }}>
          <DepartmentChart />
        </Grid>

        <Grid size={{ xs: 12, md: 6 }}>
          <AttendanceTrendChart />
        </Grid>
      </Grid>

      {/* ================= QUICK ACTIONS ================= */}
      <Grid size={12} mt={3}>
        <QuickActions />
      </Grid>
      <Grid mt={3}>
        <AttendanceTable attendance={attendance} showActions={false} />
      </Grid>
    </Box>
  );
};

export default DashboardPage;
