import { Box } from "@mui/material";
import React, { useState } from "react";
import PageTitleBar from "../../../components/common/page-title-bar";
import AttendanceTable from "./attendance-table";
import TodayPunchBox from "./punch-box";
import {
  useCreatePunchIn,
  useCreatePunchOut,
  useGetTodayAttendance,
} from "../../../queries/employee/attendance.query";

const Attendance = () => {
  const punchInMutation = useCreatePunchIn();
  const punchOutMutation = useCreatePunchOut();
  const { data } = useGetTodayAttendance();

  const attendance = data?.attendence;

  const punchInTime = attendance?.punchIn ? new Date(attendance.punchIn) : null;

  const punchOutTime = attendance?.punchOut
    ? new Date(attendance.punchOut)
    : null;

  const formatTime = (date) => {
    if (!date) return null;
    const hours = date.getHours().toString().padStart(2, "0");
    const minutes = date.getMinutes().toString().padStart(2, "0");
    return `${hours}:${minutes}`;
  };
  const status = punchInTime
    ? punchOutTime
      ? "Completed"
      : "Working"
    : "Not Punched";

  return (
    <Box>
      <PageTitleBar
        title="Attendance"
        breadCrumbs={[
          { label: "Dashboard", href: "/employee/dashboard" },
          { label: "Attendance" },
        ]}
      />
      <TodayPunchBox
        status={status}
        punchIn={formatTime(punchInTime)}
        punchOut={formatTime(punchOutTime)}
        onPunchIn={() =>
          punchInMutation.mutate(undefined, {
            onError: (err) => {
              alert(err.response?.data?.message);
            },
          })
        }
        onPunchOut={() => punchOutMutation.mutate()}
        disablePunchIn={!!punchInTime && !punchOutTime}
        disablePunchOut={!punchInTime || !!punchOutTime}
        loading={punchInMutation.isLoading || punchOutMutation.isLoading}
      />
      <AttendanceTable />
    </Box>
  );
};

export default Attendance;
