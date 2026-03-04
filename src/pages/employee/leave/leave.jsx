import { Box } from "@mui/material";
import React from "react";
import PageTitleBar from "../../../components/common/page-title-bar";
import { useNavigate } from "react-router-dom";
import { Add } from "@mui/icons-material";
import LeaveTable from "./leave-table";

const Leave = () => {
  const navigate = useNavigate();
  return (
    <Box>
      <PageTitleBar
        title="Leave Requests"
        breadCrumbs={[
          { label: "Dashboard", href: "/employee/dashboard" },
          { label: "Leave Requests" },
        ]}
        buttonLabel="Apply Leave"
        Icon={<Add />}
        onButtonClick={() => navigate("/employee/leave/create")}
      />
      <LeaveTable />
    </Box>
  );
};

export default Leave;
