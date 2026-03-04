//get my profile
import axiosInstance from "../../api/axios";

export const getMyProfile = async () => {
  try {
    const res = await axiosInstance.get("/employee/profile");
    return res.data;
  } catch (err) {
    console.error(
      "Failed to fetch profile:",
      err.response?.data || err.message,
    );
    throw err;
  }
};

//update my profile
export const updateMyProfile = async (data) => {
  try {
    const res = await axiosInstance.put("/employee/update-profile", data, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });

    return res.data;
  } catch (err) {
    console.error(
      "Failed to update profile:",
      err.response?.data || err.message,
    );
    throw err;
  }
};

//CHANGE PASSWORD
export const changePassword = async (data) => {
  try {
    const res = await axiosInstance.put("/employee/change-password", data);
    return res.data;
  } catch (err) {
    console.error(
      "Failed to change password:",
      err.response?.data || err.message,
    );
    throw err;
  }
};
