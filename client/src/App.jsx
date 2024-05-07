import "./styles/App.css";

import { ThemeProvider, createTheme } from "@mui/material/styles";
import { brown, lime } from "@mui/material/colors";
// import Home from "./pages/Home";
// import Room from "./pages/Room";
import LocalGame from "./pages/LocalGame";

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
        <LocalGame />
      </ThemeProvider>
    </>
  );
}

export default App;
