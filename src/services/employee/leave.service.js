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
  try {
    const res = await axiosInstance.get("/leave/my-history");
    return res.data;
  } catch (err) {
    console.error("Failed to fetch leaves:", err.response?.data || err.message);
    throw err;
  }
};
export const getLeaveById = async (id) => {
  if (!id) throw new Error("User ID is required");

  try {
    const res = await axiosInstance.get(`/leave/my-leave/${id}`);
    return res.data;
  } catch (err) {
    console.error("Failed to fetch leaves:", err.response?.data || err.message);
    throw err;
  }
};
export const getBalanceLeave = async () => {
  try {
    const res = await axiosInstance.get("/leave/balance-leave");
    return res.data;
  } catch (err) {
    console.error(
      "Failed to fetch balance leave:",
      err.response?.data || err.message,
    );
    throw err;
  }
};
//update leave
export const updateLeave = async (id, data) => {
  try {
    const res = await axiosInstance.put(`/leave/update-leave/${id}`, data);
    return res.data;
  } catch (err) {
    console.error("Failed to update leave:", err.response?.data || err.message);
    throw err;
  }
};

//delete leave
export const deleteLeave = async (id) => {
  try {
    const res = await axiosInstance.delete(`/leave/delete-leave/${id}`);
    return res.data;
  } catch (err) {
    console.error("Failed to delete leave:", err.response?.data || err.message);
    throw err;
  }
};
