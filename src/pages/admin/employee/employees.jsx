import {
  Box,
  CircularProgress,
  TablePagination,
  Typography,
} from "@mui/material";

import { useNavigate } from "react-router-dom";
import { Add } from "@mui/icons-material";

import EmployeeTable from "./employee-table";
import { useEmployees } from "../../../queries/admin/employee.query";
import { useState } from "react";
import PageTitleBar from "../../../components/common/page-title-bar";
import TableFilterBar from "../../../components/common/table-filter-bar";
import { useGetDepartments } from "../../../queries/admin/department.query";

const EmployeesPage = () => {
  const [filters, setFilters] = useState({
    search: "",
    department: "",
  });
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const navigate = useNavigate();
  const { data, isLoading, isError, error } = useEmployees(
    page + 1,
    rowsPerPage,
    filters,
  );
  const employees = data?.data || [];
  const { data: departmentData } = useGetDepartments();
  const departments = departmentData || [];
  const handleFilterChange = (name, value) => {
    setFilters((prev) => ({ ...prev, [name]: value }));
    setPage(0); // Reset to first page on filter change
  };

  const handleFilterClear = () => {
    setFilters({
      search: "",
      department: "",
    });
    setPage(0);
  };

  return (
    <Box>
      <PageTitleBar
        title="Employees"
        breadCrumbs={[
          { label: "Dashboard", href: "/admin" },
          { label: "Employees" },
        ]}
        buttonLabel="Add Employee"
        Icon={<Add />}
        onButtonClick={() => navigate("/admin/employees/create")}
      />
      <TableFilterBar
        searchPlaceHolder="Search Employee"
        filters={[
          {
            label: "Department",
            name: "department",
            options: departments.map((dep) => ({
              label: dep.name,
              value: dep._id,
            })),
          },
        ]}
        values={filters}
        onchange={handleFilterChange}
        onclear={handleFilterClear}
      />
      {isLoading && <CircularProgress />}
      {isError && (
        <Typography color="error">
          {error?.message || "Failed to load employees"}
        </Typography>
      )}
      {!isLoading && !isError && <EmployeeTable employees={employees} />}
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
export default EmployeesPage;
