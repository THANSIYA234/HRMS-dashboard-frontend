import axiosInstance from "../../api/axios";

export const applyLeave = async (data) => {
  try {
    const res = await axiosInstance.post("/leave/apply-leave", data);
    return res.data;
  } catch (err) {
    throw new Error(
      "Failed to apply for leave:",
      err.response?.data || err.message,
    );
  }
};

export const fetchMyLeaves = async () => {
  const res = await axiosInstance.get("/leave/my-history");
  return res.data;
};
export const getLeaveById = async (id) => {
  if (!id) throw new Error("User ID is required");
  const res = await axiosInstance.get(`/leave/my-leave/${id}`);
  return res.data;
};
export const getBalanceLeave = async () => {
  const res = await axiosInstance.get("/leave/balance-leave");
  return res.data;
};
//update leave
export const updateLeave = async (id, data) => {
  const res = await axiosInstance.put(`/leave/update-leave/${id}`, data);
  return res.data;
};

//delete leave
export const deleteLeave = async (id) => {
  const res = await axiosInstance.delete(`/leave/delete-leave/${id}`);
  return res.data;
};
