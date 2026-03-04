import { Card, CardContent, Typography, Box } from "@mui/material";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import { useGetAttendanceTrends } from "../../../queries/admin/attendance.query";

const AttendanceTrendChart = () => {
  const { data = [] } = useGetAttendanceTrends();
  console.log("Attendance Trend Data:", data);
  return (
    <Card sx={{ height: 280 }}>
      <CardContent sx={{ height: "100%" }}>
        <Typography variant="h6" fontWeight={600} mb={2}>
          Attendance Trend (Last 30 Days)
        </Typography>

        <Box sx={{ height: 220 }}>
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={data}>
              <XAxis dataKey="day" />
              <YAxis />
              <Tooltip />
              <Line
                type="monotone"
                dataKey="value"
                stroke="#6366F1"
                strokeWidth={3}
                dot={{ r: 4 }}
              />
            </LineChart>
          </ResponsiveContainer>
        </Box>
      </CardContent>
    </Card>
  );
};

export default AttendanceTrendChart;
