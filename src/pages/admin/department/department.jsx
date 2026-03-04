import { Add } from "@mui/icons-material";
import PageTitleBar from "../../../components/common/page-title-bar";
import { useNavigate } from "react-router-dom";
import TableFilterBar from "../../../components/common/table-filter-bar";
import { Box, CircularProgress, Typography } from "@mui/material";
import { useGetDepartments } from "../../../queries/admin/department.query";
import { useState } from "react";
import DepartmentTable from "./department-table";

const Departments = () => {
  const navigate = useNavigate();
  const {
    data: department = [],
    isLoading,
    isError,
    error,
  } = useGetDepartments();

  const [filters, setFilters] = useState({
    search: "",
  });
  const handleFilterChange = (name, value) => {
    setFilters((prev) => ({ ...prev, [name]: value }));
  };

  const handleFilterClear = () => {
    setFilters({
      search: "",
    });
  };

  const filterdDepartment = department.filter((dep) => {
    const matchesSearch =
      dep.name?.toLowerCase().includes(filters.search.toLowerCase()) ||
      dep.head?.name?.toLowerCase().includes(filters.search.toLowerCase());
    return matchesSearch;
  });
  return (
    <Box>
      <PageTitleBar
        title="Departments"
        breadCrumbs={[
          { label: "Dashboard", href: "/admin" },
          { label: "Deapartments" },
        ]}
        buttonLabel="Add Department"
        Icon={<Add />}
        onButtonClick={() => navigate("/admin/departments/create")}
      />
      <TableFilterBar
        searchPlaceHolder="Search Department"
        values={filters}
        onchange={handleFilterChange}
        onclear={handleFilterClear}
      />

      {isLoading && <CircularProgress />}
      {isError && (
        <Typography color="error">
          {error?.message || "Failed to load department"}
        </Typography>
      )}
      {!isLoading && !isError && (
        <DepartmentTable department={filterdDepartment} />
      )}
    </Box>
  );
};
export default Departments;
