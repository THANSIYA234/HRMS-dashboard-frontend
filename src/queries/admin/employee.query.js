import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
  createEmployees,
  deleteEmployee,
  getEmployeeById,
  getEmployees,
  updateEmployees,
} from "../../services/admin/employee.service";

export const useEmployees = (page, limit, filters) => {
  return useQuery({
    queryKey: ["employee", page, limit, filters],
    queryFn: () =>
      getEmployees({
        page,
        limit,
        search: filters?.search,
        department: filters?.department,
      }),
  });
};

export const useEmployeeById = (id) => {
  return useQuery({
    queryKey: ["employee", id],
    queryFn: () => getEmployeeById(id),
    enabled: !!id, // only run if id exists
  });
};

export const useCreateEmployee = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: createEmployees,
    onSuccess: () => {
      queryClient.invalidateQueries(["employee"]);
    },
  });
};
export const useUpdateEmployee = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, data }) => updateEmployees(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries(["employee"]);
    },
  });
};
export const useDeleteEmployee = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: deleteEmployee,
    onSuccess: () => {
      queryClient.invalidateQueries(["employees"]);
    },
  });
};
