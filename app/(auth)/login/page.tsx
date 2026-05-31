"use client"
import {
  Box,
  Button,
  Container,
  TextField,
  Typography,
  Paper
} from "@mui/material"

export default function LoginPage() {
  return (
    <Container maxWidth="sm" sx={{ mt: 8 }}>
      <Paper elevation={3} sx={{ p: 4 }}>
        <Typography variant="h4" sx={{ fontWeight: 700, mb: 3 }} >Sign in</Typography>
        <Box sx={{ display: 'flex', flexDirection: "column", gap: 2 }} >
          <TextField label="Email" type="email" fullWidth />
          <TextField label="Password" type="password" fullWidth />
          <Button variant="contained" size="large" fullWidth>Login</Button>
          <Button variant="outlined" size="large" fullWidth>Continue with GitHub</Button>
        </Box>
      </Paper>
    </Container>
  )
}