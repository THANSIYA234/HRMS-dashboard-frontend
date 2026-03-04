import { Box, TablePagination, Typography } from "@mui/material";
import PageTitleBar from "../../../components/common/page-title-bar";
import AttendanceStats from "./attendance-stats";
import TableFilterBar from "../../../components/common/table-filter-bar";
import AttendanceTable from "./attendance-table";
import { useState } from "react";
import {
  useGetAllAttendance,
  useGetAttendanceStats,
  useTodayAttendanceSnapshot,
  useUpdateAttendance,
} from "../../../queries/admin/attendance.query";

import { useGetDepartments } from "../../../queries/admin/department.query";
import EditAttendanceDialog from "./attendance-edit";

const AttendancePage = () => {
  const [filters, setFilters] = useState({
    search: "",
    department: "",
    dateRange: null,
  });
  const [editRecord, setEditRecord] = useState(null);
  const [modalOpen, setModalOpen] = useState(false);
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);

  const { data: departments = [], isLoading: deptLoading } =
    useGetDepartments();
  const { data } = useGetAllAttendance({
    ...filters,
    date:
      filters.dateRange instanceof Date
        ? filters.dateRange.toISOString()
        : null,
    page: page + 1,
    limit: rowsPerPage,
  });

  const { data: stats } = useGetAttendanceStats();
  const updateAttendance = useUpdateAttendance();

  const handleEditClick = (record) => {
    if (!record) return;
    setEditRecord(record);
    setModalOpen(true);
  };

  const handleSaveAttendance = (updated) => {
    if (!editRecord) return;

    updateAttendance.mutate(
      {
        id: editRecord._id,
        data: updated,
      },
      {
        onSuccess: () => {
          setModalOpen(false);
          setEditRecord(null);
        },
        onError: (err) => {
          console.error("Update failed:", err);
        },
      },
    );
  };

  const handleFilterChange = (name, value) => {
    if (name === "dateRange") {
      // Convert to Date object if value exists
      setFilters((prev) => ({
        ...prev,
        [name]: value ? new Date(value) : null,
      }));
    } else {
      setFilters((prev) => ({ ...prev, [name]: value }));
    }
  };
  const handleFilterClear = () => {
    setFilters({ search: "", department: "", dateRange: null });
  };

  if (deptLoading) return <p>Loading departments...</p>;

  return (
    <Box>
      <PageTitleBar
        title="Attendance"
        breadCrumbs={[
          { label: "Dashboard", href: "/admin" },
          { label: "Attendance" },
        ]}
      />

      <AttendanceStats
        stats={{
          totalEmployees: stats?.totalEmployees,
          present: stats?.present,
          absent: stats?.absent,
          leave: stats?.leave,
        }}
      />

      <TableFilterBar
        searchPlaceHolder="Search Attendance"
        filters={[
          {
            label: "Department",
            name: "department",
            options: [
              ...departments.map((dept) => ({
                label: dept.name,
                value: dept._id,
              })),
            ],
          },

          {
            label: "Date",
            name: "dateRange",
            type: "date",
          },
        ]}
        values={filters}
        onchange={handleFilterChange}
        onclear={handleFilterClear}
      />

      <AttendanceTable
        attendance={data?.records || []}
        onEdit={handleEditClick}
        showActions={true}
      />

      {editRecord && (
        <EditAttendanceDialog
          open={modalOpen}
          onClose={() => {
            setModalOpen(false);
            setEditRecord(null);
          }}
          record={editRecord}
          onSave={handleSaveAttendance}
        />
      )}

      <TablePagination
        component="div"
        count={data?.total || 0}
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

export default AttendancePage;
