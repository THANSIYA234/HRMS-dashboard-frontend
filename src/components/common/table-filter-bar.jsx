import { Search } from "@mui/icons-material";
import {
  Box,
  MenuItem,
  TextField,
  Button,
  Grid,
  InputAdornment,
} from "@mui/material";
import { DatePicker, LocalizationProvider } from "@mui/x-date-pickers";
import { AdapterDateFns } from "@mui/x-date-pickers/AdapterDateFns";
import { DateRangePicker } from "@mui/x-date-pickers-pro";

const TableFilterBar = ({
  searchPlaceHolder = "Search",
  filters = [],
  values,
  onchange,
  onclear,
}) => {
  return (
    <Box
      sx={{
        mb: 2,
        px: 2,
        py: 1.5,
        backgroundColor: "#ffff",
        borderRadius: 1,
      }}
    >
      <Grid container spacing={2} alignItems="center">
        {/* Search */}
        <Grid size={{ xs: 12, sm: 4, md: 3 }}>
          <TextField
            fullWidth
            placeholder={searchPlaceHolder}
            size="small"
            value={values.search}
            onChange={(e) => onchange("search", e.target.value)}
            slotProps={{
              input: {
                startAdornment: (
                  <InputAdornment position="start">
                    <Search fontSize="small" color="action" />
                  </InputAdornment>
                ),
              },
            }}
          />
        </Grid>

        {filters.map((filter) => {
          // --- Date Range Picker ---
          if (filter.type === "date") {
            return (
              <Grid size={{ xs: 12, sm: 4, md: 3 }} key={filter.name}>
                <LocalizationProvider dateAdapter={AdapterDateFns}>
                  <DatePicker
                    value={values[filter.name] || null}
                    onChange={(newValue) => onchange(filter.name, newValue)}
                    slotProps={{
                      textField: {
                        size: "small",
                        fullWidth: true,
                      },
                    }}
                  />
                </LocalizationProvider>
              </Grid>
            );
          }

          // --- Normal select filter ---
          return (
            <Grid size={{ xs: 12, sm: 4, md: 3 }} key={filter.name}>
              <TextField
                select
                fullWidth
                size="small"
                label={filter.label}
                value={values[filter.name] ?? ""}
                onChange={(e) => onchange(filter.name, e.target.value)}
              >
                <MenuItem value="">All</MenuItem>
                {filter.options?.map((opt) => (
                  <MenuItem key={opt.value} value={opt.value}>
                    {opt.label}
                  </MenuItem>
                ))}
              </TextField>
            </Grid>
          );
        })}

        {/* Buttons (RIGHT SIDE) */}
        <Grid
          item
          xs={12}
          md={3}
          sx={{
            display: "flex",
            justifyContent: { xs: "flex-start", md: "flex-end" },
            gap: 1,
          }}
        >
          <Button
            variant="outlined"
            sx={{ height: 36, textTransform: "none" }}
            onClick={onclear}
          >
            Clear
          </Button>
        </Grid>
      </Grid>
    </Box>
  );
};

export default TableFilterBar;
