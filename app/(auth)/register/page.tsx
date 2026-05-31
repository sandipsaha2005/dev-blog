"use client"
import {
  Box,
  Button,
  Container,
  TextField,
  Typography,
  Paper
} from "@mui/material"

export default function RegisterPage() {
  return (
    <Container maxWidth="sm" sx={{ mt: 8 }}>
      <Paper elevation={3} sx={{ p: 4 }}>
        <Typography sx={{ fontWeight: 700, mb: 3 }} variant="h4" >Create account</Typography>
        <Box sx={{ display: "flex", flexDirection: "column", gap: 2 }} >
          <TextField label="Username" fullWidth />
          <TextField label="Full name" fullWidth />
          <TextField label="Email" type="email" fullWidth />
          <TextField label="Password" type="password" fullWidth />
          <TextField label="Confirm password" type="password" fullWidth />
          <Button variant="contained" size="large" fullWidth>Register</Button>
        </Box>
      </Paper>
    </Container>
  )
}