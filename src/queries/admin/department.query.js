import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
  assignHeadToDepartment,
  createDepartment,
  deleteDepartment,
  getDepartmentById,
  getDepartments,
  getDepartmentStats,
  getEmployeesByDepartmentId,
  updateDepartment,
} from "../../services/admin/department.service";

// Get all departments
export const useGetDepartments = () => {
  return useQuery({
    queryKey: ["department"],
    queryFn: getDepartments,
  });
};

// Create a new department
export const useCreateDepartment = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: createDepartment,
    onSuccess: () => {
      queryClient.invalidateQueries(["department"]);
    },
  });
};

//GET department by ID
export const useGetDepartmentById = (id) => {
  const queryClient = useQueryClient();
  return useQuery({
    queryKey: ["department", id],
    queryFn: () => getDepartmentById(id),
    onSuccess: () => {
      queryClient.invalidateQueries(["department"]);
      queryClient.invalidateQueries(["department", id]);
    },
  });
};
//GET employees by department ID
export const useGetEmployeesByDepartmentId = (id) => {
  return useQuery({
    queryKey: ["department-employees", id],
    queryFn: () => getEmployeesByDepartmentId(id),
    enabled: !!id,
  });
};

//UPDATE department by ID
export const useUpdateDepartment = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, data }) => updateDepartment(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries(["department"]);
    },
  });
};

// Assign head to department
export const useAssignHeadToDepartment = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ departmentId, employeeId }) =>
      assignHeadToDepartment(departmentId, employeeId),
    onSuccess: () => {
      queryClient.invalidateQueries(["department"]);
    },
  });
};

//assign employee by department id
export const useAssignEmployeeToDepartment = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ departmentId, employeeId }) =>
      assignHeadToDepartment(departmentId, employeeId),
    onSuccess: () => {
      queryClient.invalidateQueries(["department"]);
    },
  });
};
export const useGetDepartmentStats = () => {
  return useQuery({
    queryKey: ["department-stats"],
    queryFn: getDepartmentStats,
  });
};
// Delete department by ID
export const useDeleteDepartment = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: deleteDepartment,
    onSuccess: () => {
      queryClient.invalidateQueries(["department"]);
    },
  });
};
