"use client"
import {
  Alert,
  Box,
  Button,
  Container,
  TextField,
  Typography,
  Paper,
} from "@mui/material";
import { signIn } from "next-auth/react";
import { useRouter } from "next/navigation";
import { ChangeEvent, FormEvent, useState } from "react";
import { login } from "@/lib/actions/auth";

export default function LoginPage() {
  const router = useRouter();
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [state, setState] = useState({
    email: "",
    password: "",
  });

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    const result = await login(state);

    setLoading(false);

    if (!result.success) {
      setError(result.message);
      return;
    }

    router.push("/dashboard");
  };

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target

    setState((prev) => ({
      ...prev,
      [name]: value,
    }))
  }

  return (
    <Container maxWidth="sm" sx={{ mt: 8 }}>
      <Paper elevation={3} sx={{ p: 4 }}>
        <Typography variant="h4" sx={{ fontWeight: 700, mb: 3 }}>
          Sign in
        </Typography>

        {error && (
          <Alert severity="error" sx={{ mb: 2 }}>
            {error}
          </Alert>
        )}

        <Box
          sx={{ display: "flex", flexDirection: "column", gap: 2 }}
          component={"form"}
          onSubmit={handleSubmit}
        >
          <TextField
            label="Email"
            type="email"
            fullWidth
            value={state.email}
            required
            name="email"
            onChange={handleChange}
            disabled={loading}
          />
          <TextField
            label="Password"
            type="password"
            fullWidth
            value={state.password}
            required
            name="password"
            onChange={handleChange}
            disabled={loading}
          />
          <Button
            variant="contained"
            size="large"
            fullWidth
            type="submit"
            disabled={loading}
          >
            {loading ? "Signing in..." : "Login"}
          </Button>
          <Button
            variant="outlined"
            size="large"
            fullWidth
            onClick={() => signIn("github", { redirectTo: "/dashboard" })}
            disabled={loading}
          >
            Continue with GitHub
          </Button>

        </Box>
      </Paper>
    </Container>
  )
}