import { Box, Typography } from "@mui/material";
import actionButton from ".";

const ActionButton = ({ icon, label, color, onClick }) => {
  return (
    <Box
      onClick={onClick}
      sx={{
        backgroundColor: color,
        borderRadius: 2,
        padding: 2,
        display: "flex",
        alignItems: "center",
        gap: 2,
        cursor: "pointer",
        color: "#fff",

        width: 240,
        transition: "0.3s",
        "&:hover": {
          opacity: 0.9,
          transform: "translateY(-2px)",
        },
      }}
    >
      <Box
        sx={{
          backgroundColor: "#fff",
          color: color,
          width: 36,
          height: 36,
          borderRadius: "50%",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        {icon}
      </Box>

      <Typography fontWeight={600}>{label}</Typography>
    </Box>
  );
};
export default ActionButton;
