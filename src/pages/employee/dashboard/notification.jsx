import * as React from "react";
import {
  Card,
  CardContent,
  Typography,
  Stack,
  Box,
  Chip,
  Divider,
} from "@mui/material";
import CampaignIcon from "@mui/icons-material/Campaign";

export default function AnnouncementBox() {
  const announcements = [
    {
      id: 1,
      title: "Office closed on Friday",
      date: "Feb 3",
      type: "Holiday",
    },
    {
      id: 2,
      title: "New HR policy update released",
      date: "Feb 1",
      type: "Policy",
    },
    {
      id: 3,
      title: "Team meeting at 4 PM",
      date: "Jan 30",
      type: "Meeting",
    },
  ];

  const getColor = (type) => {
    if (type === "Holiday") return "success";
    if (type === "Policy") return "primary";
    if (type === "Meeting") return "warning";
    return "default";
  };

  return (
    <Card sx={{ borderRadius: 3, boxShadow: 3 }}>
      <CardContent>
        <Typography variant="h6" fontWeight="bold" mb={2}>
          📢 Announcements
        </Typography>

        <Stack spacing={2}>
          {announcements.map((item, index) => (
            <Box key={item.id}>
              <Stack direction="row" spacing={2} alignItems="center">
                <CampaignIcon color="action" />

                <Box flex={1}>
                  <Typography fontWeight="500">{item.title}</Typography>

                  <Typography variant="caption" color="text.secondary">
                    {item.date}
                  </Typography>
                </Box>

                <Chip
                  label={item.type}
                  size="small"
                  color={getColor(item.type)}
                />
              </Stack>

              {index !== announcements.length - 1 && <Divider sx={{ mt: 2 }} />}
            </Box>
          ))}
        </Stack>
      </CardContent>
    </Card>
  );
}
