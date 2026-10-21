import axiosInstance from "../api/axios";

//login
export const loginUser = async (data) => {
  const res = await axiosInstance.post("/auth/login", data);
  localStorage.setItem("accessToken", res.data.accessToken);
  localStorage.setItem("user", JSON.stringify(res.data.user));
  return res.data;
};

//logout
export const logOut = async () => {
  return await axiosInstance.post("/auth/logout");
};

//register
export const registerUser = async (payload) => {
  const response = await axiosInstance.post("/auth/register", payload, {
    headers: { "Content-Type": "application/json" },
  });
  return response.data;
};
