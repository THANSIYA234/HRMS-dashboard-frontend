import axiosInstance from "../../api/axios";

export const getEmployees = async (params) => {
  const res = await axiosInstance.get("/employee", {
    params,
  });
  return res.data;
};
export const createEmployees = async (data) => {
  const res = await axiosInstance.post("/employee", data);
  return res.data;
};
export const updateEmployees = async (id, data) => {
  const res = await axiosInstance.put(`/employee/${id}`, data);
  return res.data;
};

export const getEmployeeById = async (id) => {
  const res = await axiosInstance.get(`/employee/${id}`);
  return res.data;
};
export const deleteEmployee = async (id) => {
  await axiosInstance.delete(`/employee/${id}`);
  return;
};
