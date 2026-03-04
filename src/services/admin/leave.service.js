import axiosInstance from "../../api/axios";

//get all leaves
export const getAllLeaves = async (params) => {
  const res = await axiosInstance.get("/leave/all-leaves", { params });
  return res.data;
};

// Update leave status
export const updateLeaveStatus = async (id, status) => {
  const res = await axiosInstance.put(`/leave/status/${id}`, { status });
  return res.data;
};
