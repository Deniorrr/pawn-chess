import "./styles/App.css";

import { ThemeProvider, createTheme } from "@mui/material/styles";
import { brown, lime } from "@mui/material/colors";
import Home from "./pages/Home";
// import Room from "./pages/Room";
import LocalGame from "./pages/LocalGame";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Stockfish from "./pages/Stockfish";

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
        <BrowserRouter basename="/pawn-chess">
          <Routes path="/pawnchess">
            <Route path="/" element={<Home />} />
            <Route path="/local-game" element={<LocalGame />} />
            <Route path="/stockfish" element={<Stockfish />} />
          </Routes>
        </BrowserRouter>
      </ThemeProvider>
    </>
  );
}

export default App;
