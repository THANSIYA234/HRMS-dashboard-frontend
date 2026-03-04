//getNotifications
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
  getNotifications,
  getUnreadCount,
  markNotificationRead,
} from "../services/notification.service";

export const useFetchNotifications = () => {
  return useQuery({
    queryKey: ["notifications"],
    queryFn: getNotifications,
  });
};

// markNotificationRead

export const useMarkNotificationRead = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: markNotificationRead,
    onSuccess: () => {
      queryClient.invalidateQueries(["notifications"]);
    },
  });
};

// markUnRead
export const useGetUnreadCount = () => {
  return useQuery({
    queryKey: ["unreadCount"],
    queryFn: getUnreadCount,
    // prevents running before role exists
    refetchInterval: 10000,
  });
};
