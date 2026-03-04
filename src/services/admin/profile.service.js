import axiosInstance from "../../api/axios";

export const getAdminProfile = async () => {
  const res = await axiosInstance.get("/auth/profile");
  return res.data;
};
