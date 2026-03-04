import { Box, Grid } from "@mui/material";
import StatCard from "../../../components/common/statCard";
import { Cancel, CheckCircle, TimeToLeave } from "@mui/icons-material";
import { ClockIcon } from "@mui/x-date-pickers";
import LeaveRequestStatus from "./leave-request-stats";
import QuickActions from "./quick-action";
import AnnouncementBox from "./notification";
import AttendanceTable from "../attendance/attendance-table";
import { useGetTodayAttendance } from "../../../queries/employee/attendance.query";
import {
  useFetchMyLeaves,
  useGetBalanceLeave,
} from "../../../queries/employee/leave.query";

const Dashboard = () => {
  const { data } = useGetTodayAttendance();
  const attendence = data?.attendence;
  const { data: leaves } = useFetchMyLeaves();
  const { data: balanceLeave } = useGetBalanceLeave();

  const pendingLeaves =
    leaves?.leaves?.filter((l) => l.status === "Pending").length || 0;

  return (
    <Box p={3}>
      <Box sx={{ p: 3, maxWidth: 1400, mx: "auto" }}>
        <Grid container spacing={3}>
          <Grid size={{ xs: 12, md: 3 }}>
            <StatCard
              title="Today Status"
              value={attendence?.status || "absent"}
              sx={{ color: "#2e7d32" }}
              icon={<CheckCircle />}
              iconBg="#e8f5e9"
              color="#2e7d32"
              backgroundColor={"#2e7d32"}
            />
          </Grid>
          <Grid size={{ xs: 12, md: 3 }}>
            <StatCard
              title="Hours Worked"
              value={`${attendence?.workHours || 0} hrs`}
              icon={<ClockIcon />}
              iconBg="#fff3e0"
              color="#ed6c02"
              backgroundColor={"#ed6c02"}
            />
          </Grid>
          <Grid size={{ xs: 12, md: 3 }}>
            <StatCard
              title="Pending Leave"
              value={pendingLeaves}
              icon={<Cancel />}
              iconBg="#fdecea"
              color="#d32f2f"
              backgroundColor={"#db523aff"}
            />
          </Grid>
          <Grid size={{ xs: 12, md: 3 }}>
            <StatCard
              title="Remaining Leaves"
              value={balanceLeave?.remaining || 0}
              color="#1976d2"
              icon={<TimeToLeave />}
              iconBg={"#e3f2fd"}
              backgroundColor={"#1976d2"}
            />
          </Grid>
        </Grid>
      </Box>
      <Grid container spacing={3} mt={3}>
        <Grid size={{ xs: 12, md: 6 }}>
          <LeaveRequestStatus />
        </Grid>
        <Grid size={{ xs: 12, md: 6 }}>
          <QuickActions />
        </Grid>
      </Grid>
      <Grid container spacing={3} mt={3}>
        <Grid size={{ xs: 12, md: 12 }}>
          <AttendanceTable />
        </Grid>
      </Grid>
    </Box>
  );
};

export default Dashboard;
