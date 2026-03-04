import {
  Box,
  Button,
  Card,
  TextField,
  Typography,
  CardContent,
  Link,
  InputAdornment,
  IconButton,
} from "@mui/material";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { loginUser } from "../services/auth.service";
import { useAuth } from "../context/auth-context"; // ✅ ADD
import { Visibility, VisibilityOff } from "@mui/icons-material";

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  const navigate = useNavigate();
  const { setUser, setToken } = useAuth();

  const handleLogin = async (event) => {
    event.preventDefault();
    try {
      setError("");

      const res = await loginUser({ email, password });

      const { user, token } = res;

      localStorage.setItem("user", JSON.stringify(user));
      localStorage.setItem("token", token);

      setUser(user);
      setToken(token);

      if (user.role === "admin") {
        navigate("/admin/dashboard", { replace: true });
      } else {
        navigate("/employee/dashboard", { replace: true });
      }
    } catch (err) {
      setError(err.response?.data?.message || "Login failed");
    }
  };
  const handleTogglePasswordVisibility = () => {
    setShowPassword((prev) => !prev);
  };

  return (
    <Box
      sx={{
        minHeight: "100vh",
        background: "linear-gradient(135deg, #eaf2ff, #f7faff)",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        px: 2,
      }}
    >
      <form onSubmit={handleLogin} style={{ maxWidth: 400, width: "100%" }}>
        <Card
          sx={{
            width: "100%",
            p: { xs: 2, sm: 3 },
            borderRadius: 3,
            boxShadow: 6,
          }}
        >
          <CardContent>
            <Typography variant="h5" align="center" fontWeight={600} mb={2}>
              Login
            </Typography>

            {error && (
              <Typography color="error" align="center" mb={2}>
                {error}
              </Typography>
            )}

            <TextField
              fullWidth
              label="Email"
              margin="normal"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />

            <TextField
              fullWidth
              label="Password"
              type={showPassword ? "text" : "password"}
              margin="normal"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              InputProps={{
                endAdornment: (
                  <InputAdornment position="end">
                    <IconButton
                      onClick={handleTogglePasswordVisibility}
                      edge="end"
                      size="small"
                    >
                      {showPassword ? <Visibility /> : <VisibilityOff />}
                    </IconButton>
                  </InputAdornment>
                ),
              }}
            />

            <Box sx={{ display: "flex", justifyContent: "flex-end", mt: 2 }}>
              <Link underline="none" variant="body2">
                Forgot password?
              </Link>
            </Box>

            <Button
              fullWidth
              variant="contained"
              sx={{ mt: 2, py: 1.2 }}
              type="submit"
            >
              Login
            </Button>
          </CardContent>
        </Card>
      </form>
    </Box>
  );
}
