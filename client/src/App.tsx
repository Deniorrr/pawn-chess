import "./styles/App.css";

import { ThemeProvider, createTheme } from "@mui/material/styles";
import { brown, lime } from "@mui/material/colors";
import Home from "./pages/Home";
import LocalGame from "./pages/LocalGame";
import Multiplayer from "./pages/Multiplayer";
import MultiplayerLobby from "./pages/MultiplayerLobby";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Stockfish from "./pages/Stockfish";
import { AlertProvider } from "./contexts/AlertContext";

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
        <AlertProvider>
          <BrowserRouter>
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/local-game" element={<LocalGame />} />
              <Route path="/stockfish" element={<Stockfish />} />
              <Route
                path="/multiplayer
            "
                element={<Multiplayer />}
              />
              <Route path="/lobby/:roomCode" element={<MultiplayerLobby />} />
            </Routes>
          </BrowserRouter>
        </AlertProvider>
      </ThemeProvider>
    </>
  );
}

export default App;
