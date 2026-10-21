import { Box, Button, Container, Stack, Typography } from "@mui/material";
import { useNavigate } from "react-router-dom";

const NotFound = () => {
  const navigate = useNavigate();
  return (
    <Container maxWidth="sm">
      <Box
        sx={{
          minHeight: "70vh",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <Stack spacing={3} alignItems="center" textAlign="center">
          <Typography variant="h2" component="h1" fontWeight={700}>
            404
          </Typography>
          <Typography variant="h5" component="p" color="text.secondary">
            Page not found
          </Typography>
          <Typography variant="body1" color="text.secondary">
            The page you&rsquo;re looking for doesn&rsquo;t exist or has been
            moved.
          </Typography>
          <Button
            variant="contained"
            size="large"
            onClick={() => navigate("/", { replace: true })}
            aria-label="Go to home page"
          >
            Go home
          </Button>
        </Stack>
      </Box>
    </Container>
  );
};

export default NotFound;