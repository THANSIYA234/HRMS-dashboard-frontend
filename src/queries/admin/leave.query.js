import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
  getAllLeaves,
  updateLeaveStatus,
} from "../../services/admin/leave.service";

// Get all leaves
export const useGetLeaves = (page, limit, filters) => {
  return useQuery({
    queryKey: ["leaves", page, limit, filters],
    queryFn: () =>
      getAllLeaves({
        status: filters?.status,
        search: filters?.search,
        page,
        limit,
      }),
  });
};

// Update leave status
export const useUpdateLeaveStatus = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, status }) => updateLeaveStatus(id, status),
    onSuccess: () => {
      queryClient.invalidateQueries(["leaves"]);
    },
  });
};
