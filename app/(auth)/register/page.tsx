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

export default function RegisterPage() {

  const [state, setState] = useState({
    username: "",
    fullName: "",
    email: "",
    password: "",
    confPassword: ""
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

    if (state.password != state.confPassword) {
      alert("Password doesn't match with Confirm password");
      return;
    }

    const res = await register(state);

    console.log({ res });
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
          />
          <TextField
            label="Full name"
            fullWidth
            value={state.fullName}
            name="fullName"
            onChange={handleChange}
          />
          <TextField
            label="Email"
            type="email"
            fullWidth
            value={state.email}
            name="email"
            onChange={handleChange}
          />
          <TextField
            label="Password"
            type="password"
            fullWidth
            value={state.password}
            name="password"
            onChange={handleChange}
          />
          <TextField
            label="Confirm password"
            type="password"
            fullWidth
            value={state.confPassword}
            name="confPassword"
            onChange={handleChange}
          />
          <Button variant="contained" size="large" fullWidth type="submit">Register</Button>
        </Box>
      </Paper>
    </Container>
  )
}