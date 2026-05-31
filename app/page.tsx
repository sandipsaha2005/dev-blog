// 'use client';
// import { useColorMode } from "@/lib/theme-context";
// import { Button } from "@mui/material";

// export default function Home() {
//   const { toggleTheme } = useColorMode();
//   return <Button onClick={toggleTheme}>Toggle Theme</Button>
// }


import { Box, Button, Container, Typography } from "@mui/material"
import Link from "next/link"

export default function HomePage() {
  return (
    <Container maxWidth="md">
      <Box sx={{ display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", minHeight: '80vh', gap: 3, textAlign: "center" }}>
        <Typography sx={{ fontWeight: 800 }} variant="h2" >Dev Blog</Typography>
        <Typography variant="h6" color="text.secondary">A place for developers to write, share, and grow.</Typography>

        <Box sx={{ display: "flex", gap: 2 }}>
          <Link href="/blog">
            <Button variant="contained" size="large" >Read Blog</Button>
          </Link>
          <Link href="/register">
            <Button variant="outlined" size="large">Start Writing</Button>
          </Link>
        </Box>
      </Box>
    </Container>
  )
}