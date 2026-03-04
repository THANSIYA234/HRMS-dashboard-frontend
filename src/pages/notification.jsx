// pages/employee/notification.jsx
import { Box, Typography, List, ListItem, ListItemText } from "@mui/material";
import {
  useFetchNotifications,
  useMarkNotificationRead,
} from "../queries/notification.query";
import { useNavigate } from "react-router-dom";

export default function NotificationPage() {
  const navigate = useNavigate();
  const { data, isLoading } = useFetchNotifications();
  const notifications = data?.notifications || [];
  console.log("Notifications", notifications);

  const markAsRead = useMarkNotificationRead();

  if (isLoading) return <div>Loading...</div>;

  return (
    <Box p={3}>
      <Typography variant="h5" mb={2}>
        Notifications
      </Typography>

      <List>
        {notifications.map((n) => (
          <ListItem
            key={n._id}
            onClick={() => {
              markAsRead.mutate(n._id);
              if (n.link) navigate(n.link);
            }}
            sx={{
              bgcolor: n.isRead ? "white" : "#e3f2fd",
              borderRadius: 1,
              mb: 1,
              cursor: "pointer",
            }}
          >
            <ListItemText primary={n.title} secondary={n.message} />
          </ListItem>
        ))}
      </List>
    </Box>
  );
}
