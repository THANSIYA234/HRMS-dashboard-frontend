// profile queries
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import {
  changePassword,
  getMyProfile,
  updateMyProfile,
} from "../../services/employee/profile.service";

export const useFetchMyProfile = () => {
  return useQuery({
    queryKey: ["my-profile"],
    queryFn: getMyProfile,
  });
};
export const useUpdateMyProfile = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: updateMyProfile,

    onSuccess: () => {
      queryClient.invalidateQueries(["my-profile"]);
    },
  });
};

export const useChangePassword = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: changePassword,

    onSuccess: () => {
      queryClient.invalidateQueries(["my-profile"]);
    },
  });
};
