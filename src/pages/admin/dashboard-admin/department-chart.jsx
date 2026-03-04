import { Card, CardContent, Typography, Box } from "@mui/material";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import { useGetDepartmentStats } from "../../../queries/admin/department.query";

const DepartmentChart = () => {
  const { data = [] } = useGetDepartmentStats();
  console.log("Department Data:", data);

  return (
    <Card sx={{ height: 280 }}>
      <CardContent sx={{ height: "100%" }}>
        <Typography variant="h6" fontWeight={600} mb={2}>
          Employees by Department
        </Typography>

        <Box sx={{ height: 220 }}>
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={data}>
              <XAxis dataKey="name" />
              <YAxis />
              <Tooltip />
              <Bar
                dataKey="value"
                fill="#3B82F6"
                radius={[6, 6, 0, 0]}
                barSize={32}
              />
            </BarChart>
          </ResponsiveContainer>
        </Box>
      </CardContent>
    </Card>
  );
};

export default DepartmentChart;
