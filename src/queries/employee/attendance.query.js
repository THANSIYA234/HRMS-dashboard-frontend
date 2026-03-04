import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
  attendanceHistory,
  createPunchIn,
  createPunchOut,
  fetchTodayAttendance,
} from "../../services/employee/attendance.service";

//punch-in
export const useCreatePunchIn = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: createPunchIn,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["attendance"] });
    },
  });
};

//punch-out
export const useCreatePunchOut = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: createPunchOut,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["attendance"] });
    },
  });
};

//get today-attendance
export const useGetTodayAttendance = () => {
  return useQuery({
    queryKey: ["attendance", "today"],
    queryFn: fetchTodayAttendance,
  });
};

//get attendance history
export const useGetAttendanceHistory = () => {
  return useQuery({
    queryKey: ["attendance", "history"],
    queryFn: attendanceHistory,
  });
};
