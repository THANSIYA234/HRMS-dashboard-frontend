//get my profile
import axiosInstance from "../../api/axios";

export const getMyProfile = async () => {
  const res = await axiosInstance.get("/employee/profile");
  return res.data;
};

//update my profile
export const updateMyProfile = async (data) => {
  const res = await axiosInstance.put("/employee/update-profile", data, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });

  return res.data;
};

//CHANGE PASSWORD
export const changePassword = async (data) => {
  const res = await axiosInstance.put("/employee/change-password", data);
  return res.data;
};
