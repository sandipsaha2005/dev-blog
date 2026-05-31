"use client"
import { AppRouterCacheProvider } from "@mui/material-nextjs/v15-appRouter";
import { ThemeProvider, CssBaseline } from "@mui/material"
import { ReactNode, useMemo, useState } from "react"
import { createTheme } from "@mui/material/styles";
import { ColorModeContext } from "@/lib/theme-context";

const MuiThemeProvider = ({ children }: { children: ReactNode }) => {
  const [mode, setMode] = useState<"light" | "dark">("light");

  const toggleTheme = () => {
    setMode(mode === "dark" ? "light" : "dark");
  }

  const theme = useMemo(() => createTheme({
    palette: {
      mode,
      primary: { main: "#1976d2" },
      secondary: { main: "#9c27b0" },
    },
    typography: { fontFamily: "Inter, sans-serif" },
    spacing: 8,
  }), [mode])

  return (
    <ColorModeContext.Provider value={{ toggleTheme }}>
      <AppRouterCacheProvider>
        <ThemeProvider theme={theme} >
          <CssBaseline />
          {children}
        </ThemeProvider>
      </AppRouterCacheProvider>
    </ColorModeContext.Provider>
  )
}

export default MuiThemeProvider;
