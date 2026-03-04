import axiosInstance from "../api/axios";

export const getNotifications = async () => {
  const res = await axiosInstance.get("/notifications");
  return res.data;
};

export const markNotificationRead = async (id) => {
  await axiosInstance.put(`/notifications/${id}/read`);
  return;
};

export const getUnreadCount = async () => {
  const res = await axiosInstance.get("/notifications/unread-count");
  return res.data;
};
