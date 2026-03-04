import axiosInstance from "../api/axios";

//login
export const loginUser = async (data) => {
  try {
    const res = await axiosInstance.post("/auth/login", data);
    localStorage.setItem("accessToken", res.data.accessToken);
    localStorage.setItem("user", JSON.stringify(res.data.user));
    return res.data;
  } catch (error) {
    console.error("Login failed:", error.response?.data || error.message);
    throw error;
  }
};

//logout
export const logOut = async () => {
  return await axiosInstance.post("/auth/logout");
};

//register
export const registerUser = async (payload) => {
  try {
    const response = await axiosInstance.post("/auth/register", payload, {
      headers: { "Content-Type": "application/json" },
    });
    return response.data;
  } catch (error) {
    console.error(
      "Register user failed:",
      error.response?.data || error.message
    );
    throw error;
  }
};
