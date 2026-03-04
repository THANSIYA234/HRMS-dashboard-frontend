import {
  keepPreviousData,
  useMutation,
  useQuery,
  useQueryClient,
} from "@tanstack/react-query";
import {
  deleteAttendance,
  getAllAttendance,
  getAttendanceByFilters,
  getAttendanceStats,
  getAttendanceTrends,
  todayAttendance,
  updateAttendance,
} from "../../services/admin/attendance.service";

export const useGetAllAttendance = (filters) => {
  return useQuery({
    queryKey: ["attendance", filters],
    queryFn: () =>
      getAllAttendance({
        search: filters.search,
        department: filters.department,
        date: filters.date,
        page: filters.page,
        limit: filters.limit,
      }),
  });
};
export const useUpdateAttendance = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: updateAttendance,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["attendance"] });
    },
  });
};
export const useTodayAttendanceSnapshot = () => {
  return useQuery({
    queryKey: ["attendance", "today-snapshot"],
    queryFn: todayAttendance,
  });
  keepPreviousData: true;
};

export const useGetAttendanceStats = () => {
  return useQuery({
    queryKey: ["attendanceStats"],
    queryFn: getAttendanceStats,
  });
};
export const useGetAttendanceTrends = () => {
  return useQuery({
    queryKey: ["attendanceTrends"],
    queryFn: getAttendanceTrends,
  });
};

export const useDeleteAttendance = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: deleteAttendance,
    onSuccess: () => {
      queryClient.invalidateQueries(["attendance"]);
    },
  });
};
