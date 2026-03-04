import axiosInstance from "../../api/axios";

//get departments
export const getDepartments = async () => {
  const res = await axiosInstance.get("/department");
  return res.data;
};

//create department by id
export const createDepartment = async (data) => {
  const res = await axiosInstance.post("/department", data);
  return res.data;
};

//get department by id
export const getDepartmentById = async (id) => {
  const res = await axiosInstance.get(`/department/${id}`);
  return res.data;
};

//update department by id
export const updateDepartment = async (id, data) => {
  const res = await axiosInstance.put(`/department/${id}`, data);
  return res.data;
};

//assign head to department
export const assignHeadToDepartment = async (departmentId, employeeId) => {
  const res = await axiosInstance.post("/department/assign-head", {
    departmentId,
    employeeId,
  });
  return res.data;
};

//assign employee to department
export const assignEmployeeToDepartment = async (id, employeeId) => {
  const res = await axiosInstance.post(`/department/${id}/assign`, {
    employeeId,
  });
  return res.data;
};

//get employees by department id
export const getEmployeesByDepartmentId = async (id) => {
  const res = await axiosInstance.get(`/department/${id}/employees`);
  return res.data.employees;
};
//delete department by id
export const deleteDepartment = async (id) => {
  await axiosInstance.delete(`/department/${id}`);
  return;
};
export const getDepartmentStats = async () => {
  const res = await axiosInstance.get("/department/stats");
  return res.data;
};
