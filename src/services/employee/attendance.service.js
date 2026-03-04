import axiosInstance from "../../api/axios";

export const createPunchIn = async (data) => {
  const res = await axiosInstance.post("/attendance/punch-in", data);
  return res.data;
};

export const createPunchOut = async (data) => {
  const res = await axiosInstance.post("/attendance/punch-out", data);
  return res.data;
};

export const fetchTodayAttendance = async () => {
  const res = await axiosInstance.get("/attendance/today-attendance");
  return res.data;
};

export const attendanceHistory = async () => {
  const res = await axiosInstance.get("/attendance/my-history");
  return res.data;
};
