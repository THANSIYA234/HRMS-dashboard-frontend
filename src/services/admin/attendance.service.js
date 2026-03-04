import axiosInstance from "../../api/axios";

export const getAllAttendance = async (params) => {
  const res = await axiosInstance.get("/attendance", { params });
  return res.data;
};

export const getAttendanceStats = async () => {
  const res = await axiosInstance.get("/attendance/stats");
  return res.data;
};
export const todayAttendance = async () => {
  const res = await axiosInstance.get("/attendance/today-snapshot");
  return res.data.records;
};

export const getAttendanceTrends = async () => {
  const res = await axiosInstance.get("/attendance/trends");
  return res.data;
};

export const getAttendanceByFilters = async ({ department, search, date }) => {
  const params = {};
  if (department) params.department = department;
  if (search) params.search = search;
  if (date) params.date = date;

  const res = await axiosInstance.get("/attendance/filters", { params });
  return res.data;
};
export const updateAttendance = async ({ id, data }) => {
  const res = await axiosInstance.put(`/attendance/update/${id}`, {
    punchIn: data.punchIn,
    punchOut: data.punchOut,
  });
  return res.data;
};

export const deleteAttendance = async (id) => {
  await axiosInstance.delete(`/attendance/delete/${id}`);
  return;
};
