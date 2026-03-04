import { Add, NavigateNext } from "@mui/icons-material";
import {
  Box,
  Breadcrumbs,
  Link,
  Typography,
  Button,
  Stack,
} from "@mui/material";
import { Link as RouterLink } from "react-router-dom";

const PageTitleBar = ({
  title,
  breadCrumbs = [],
  buttonLabel,
  onButtonClick,
  buttonIcon,
}) => {
  return (
    <Stack
      direction={{ xs: "column", sm: "row" }}
      justifyContent="space-between"
      alignItems={{ xs: "flex-start", sm: "center" }}
      spacing={2}
      sx={{ mb: 3 }}
    >
      {/* Left side */}
      <Box>
        <Typography variant="h5" fontWeight={600}>
          {title}
        </Typography>

        <Breadcrumbs
          separator={<NavigateNext fontSize="small" />}
          sx={{ mt: 0.5 }}
        >
          {breadCrumbs.map((item, index) =>
            item.href ? (
              <Link
                key={index}
                component={RouterLink}
                to={item.href}
                underline="hover"
                color="text.secondary"
                fontSize={14}
              >
                {item.label}
              </Link>
            ) : (
              <Typography key={index} fontSize={14} color="text.secondary">
                {item.label}
              </Typography>
            )
          )}
        </Breadcrumbs>
      </Box>

      {/* Right side */}
      {buttonLabel && (
        <Button
          variant="contained"
          startIcon={buttonIcon}
          onClick={onButtonClick}
          sx={{
            height: 40,

            textTransform: "none",
            fontWeight: 600,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <Box
            sx={{
              display: "flex",
              alignItems: "center",

              width: 32,
              height: 32,
            }}
          >
            {<Add />}
          </Box>
          {buttonLabel}
        </Button>
      )}
    </Stack>
  );
};

export default PageTitleBar;
