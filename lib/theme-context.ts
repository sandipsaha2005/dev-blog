import { createContext, useContext } from "react";

export const ColorModeContext = createContext({
  toggleTheme: () => {},
});

export const useColorMode = () => useContext(ColorModeContext);
