"use client"
import {
  Box,
  Button,
  Container,
  TextField,
  Typography,
  Paper
} from "@mui/material"
import { register } from "@/lib/actions/auth"
import { ChangeEvent, SubmitEvent, useState } from "react"
import { useRouter } from "next/navigation"

export default function RegisterPage() {
  const router = useRouter();
  const [state, setState] = useState({
    username: "",
    fullName: "",
    email: "",
    password: "",
    confirmPassword: ""
  })

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target

    setState((prev) => ({
      ...prev,
      [name]: value,
    }))
  }

  const handleSubmit = async (e: SubmitEvent) => {
    e.preventDefault();

    if (state.password !== state.confirmPassword) {
      alert("Password doesn't match with Confirm password");
      return;
    }

    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { confirmPassword, ...payload } = state;
    const res = await register(payload);
    if (res.success) {
      return router.push("/login");
    }
  }

  return (
    <Container maxWidth="sm" sx={{ mt: 8 }}>
      <Paper elevation={3} sx={{ p: 4 }}>
        <Typography sx={{ fontWeight: 700, mb: 3 }} variant="h4" >Create account</Typography>
        <Box
          sx={{ display: "flex", flexDirection: "column", gap: 2 }}
          component={"form"}
          onSubmit={handleSubmit}
        >
          <TextField
            label="Username"
            fullWidth
            value={state.username}
            name="username"
            onChange={handleChange}
            required
          />
          <TextField
            label="Full name"
            fullWidth
            value={state.fullName}
            name="fullName"
            onChange={handleChange}
            required
          />
          <TextField
            label="Email"
            type="email"
            fullWidth
            value={state.email}
            name="email"
            onChange={handleChange}
            required
          />
          <TextField
            label="Password"
            type="password"
            fullWidth
            value={state.password}
            name="password"
            onChange={handleChange}
            required
          />
          <TextField
            label="Confirm password"
            type="password"
            fullWidth
            value={state.confirmPassword}
            name="confirmPassword"
            required
            onChange={handleChange}
          />
          <Button variant="contained" size="large" fullWidth type="submit">Register</Button>
        </Box>
      </Paper>
    </Container>
  )
}