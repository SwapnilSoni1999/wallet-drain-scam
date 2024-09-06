import { CssBaseline } from "@mui/material";
import {
  createTheme,
  ThemeProvider,
  StyledEngineProvider,
} from "@mui/material/styles";
import { useSelector } from "react-redux";
import palette from "./palette";
import typography from "./typography";
import breakpoints from "./breakpoints";

export default function ThemeConfig({ children }) {
  const { mode } = useSelector((state) => state.userReducer);
  const themeOptions = {
    palette:
      mode === "dark"
        ? { ...palette.dark, mode: "dark" }
        : { ...palette.light, mode: "light" },
    typography,
    breakpoints,
  };

  const theme = createTheme(themeOptions);

  return (
    <StyledEngineProvider injectFirst>
      <ThemeProvider theme={theme}>
        <CssBaseline />
        {children}
      </ThemeProvider>
    </StyledEngineProvider>
  );
}
