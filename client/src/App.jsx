import "./styles/App.css";

import { ThemeProvider, createTheme } from "@mui/material/styles";
import { brown, lime } from "@mui/material/colors";
import Home from "./pages/Home";
import Room from "./pages/Room";

function App() {
  const theme = createTheme({
    palette: {
      primary: brown,
      secondary: lime,
    },
  });

  return (
    <>
      <ThemeProvider theme={theme}>
        <Room />
      </ThemeProvider>
    </>
  );
}

export default App;
