import { Box, Card, CardContent, Typography } from "@mui/material";

const StatCard = ({ title, value, icon, iconBg, color, backgroundColor }) => {
  return (
    <Card
      sx={{
        borderRadius: 2,
        width: { xs: "100%", sm: 220, md: 250 },
        minHeight: 80,
        display: "flex",
        alignItems: "center",
        p: { xs: 1, md: 2 },
        backgroundColor, // responsive padding
      }}
    >
      <CardContent sx={{ width: "100%", p: 0 }}>
        <Box>
          <Typography
            variant="body2"
            sx={{ mb: 0.5, fontSize: { xs: 12, md: 14, color: "white" } }} // responsive font
          >
            {title}
          </Typography>

          <Box
            sx={{
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              gap: { xs: 1, md: 2 }, // responsive gap
            }}
          >
            <Typography
              variant="h5"
              sx={{ color: "white", fontSize: { xs: 16, md: 20 } }} // responsive font
            >
              {value}
            </Typography>

            <Box
              sx={{
                width: { xs: 36, md: 48 },
                height: { xs: 36, md: 48 },
                borderRadius: "50%",
                backgroundColor: iconBg,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                color,
              }}
            >
              {icon}
            </Box>
          </Box>
        </Box>
      </CardContent>
    </Card>
  );
};

export default StatCard;
