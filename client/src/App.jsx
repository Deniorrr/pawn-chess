import "./styles/App.css";

import { ThemeProvider, createTheme } from "@mui/material/styles";
import { brown, lime } from "@mui/material/colors";
import Home from "./pages/Home";
// import Room from "./pages/Room";
import LocalGame from "./pages/LocalGame";
import { BrowserRouter, Routes, Route } from "react-router-dom";

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
        <BrowserRouter>
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/local-game" element={<LocalGame />} />
          </Routes>
        </BrowserRouter>
      </ThemeProvider>
    </>
  );
}

export default App;
