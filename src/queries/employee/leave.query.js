import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
  applyLeave,
  deleteLeave,
  fetchMyLeaves,
  getBalanceLeave,
  getLeaveById,
  updateLeave,
} from "../../services/employee/leave.service";

export const useApplyLeave = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: applyLeave,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["leaves"] });
    },
  });
};

export const useFetchMyLeaves = () => {
  return useQuery({
    queryKey: ["leaves"],
    queryFn: fetchMyLeaves,
  });
};

export const useGetLeaveById = (id) => {
  return useQuery({
    queryKey: ["leave", id],
    queryFn: () => getLeaveById(id),
  });
};

//balance leave
export const useGetBalanceLeave = () => {
  return useQuery({
    queryKey: ["balanceLeave"],
    queryFn: getBalanceLeave,
  });
};

//update leave query
export const useUpdateLeave = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, data }) => updateLeave(id, data),

    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ["leaves"] });
      queryClient.invalidateQueries({
        queryKey: ["leave", variables.id],
      });
    },
  });
};

//delete leave query
export const useDeleteLeave = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id) => deleteLeave(id),

    onSuccess: (_, id) => {
      queryClient.invalidateQueries({ queryKey: ["leaves"] });
      queryClient.invalidateQueries({
        queryKey: ["leave", id],
      });
    },
  });
};
