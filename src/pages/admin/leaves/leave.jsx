import { Box, TablePagination } from "@mui/material";
import PageTitleBar from "../../../components/common/page-title-bar";
import TableFilterBar from "../../../components/common/table-filter-bar";
import LeaveTable from "./leave-table";
import { useState } from "react";
import {
  useGetLeaves,
  useUpdateLeaveStatus,
} from "../../../queries/admin/leave.query";

const LeavePage = () => {
  const [filters, setFilters] = useState({
    search: "",
    status: "",
  });
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const leavesQuery = useGetLeaves(page + 1, rowsPerPage, filters);
  console.log("Leaves Data:", leavesQuery.data);
  const updateLeaveStatusMutation = useUpdateLeaveStatus();

  const handleFilterChange = (name, value) => {
    setFilters((prev) => ({ ...prev, [name]: value }));
    setPage(0);
  };

  const handleFilterClear = () => {
    setFilters({ search: "", status: "" });
    setPage(0);
  };

  const handleApprove = (id) => {
    updateLeaveStatusMutation.mutate({ id, status: "Approved" });
  };
  const handleReject = (id) => {
    updateLeaveStatusMutation.mutate({ id, status: "Rejected" });
  };

  return (
    <Box>
      <PageTitleBar
        title="Leaves"
        breadCrumbs={[
          { label: "Dashboard", href: "/admin" },
          { label: "Leaves" },
        ]}
      />
      <TableFilterBar
        searchPlaceHolder="Search Leave Requests"
        filters={[
          {
            label: "Status",
            name: "status",
            options: [
              { label: "Pending", value: "Pending" },
              { label: "Approved", value: "Approved" },
              { label: "Rejected", value: "Rejected" },
            ],
          },
        ]}
        values={filters}
        onchange={handleFilterChange}
        onclear={handleFilterClear}
      />
      <LeaveTable
        leaves={leavesQuery.data?.leaves || []}
        onApprove={handleApprove}
        onReject={handleReject}
      />
      <TablePagination
        component="div"
        count={leavesQuery.data?.total || 0}
        page={page}
        onPageChange={(e, newPage) => setPage(newPage)}
        rowsPerPage={rowsPerPage}
        onRowsPerPageChange={(e) => {
          setRowsPerPage(parseInt(e.target.value, 10));
          setPage(0);
        }}
      />
    </Box>
  );
};
export default LeavePage;
