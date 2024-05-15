import { Button, Paper, Box, Container, Typography } from "@mui/material";
import { Outlet, Link } from "react-router-dom";

function Home() {
  return (
    <Container
      style={{
        height: "100vh",
        display: "flex",
        flexDirection: "column",
        justifyContent: "space-between",
        alignItems: "center",
        backgroundColor: "#bcd2da",
      }}
    >
      <Box display={"flex"}>
        <Typography variant="h2" gutterBottom>
          Welcome to&nbsp;
        </Typography>
        <Typography variant="h2" gutterBottom color={"primary"}>
          Pawn Chess♟
        </Typography>
      </Box>
      <Paper elevation={3}>
        <Box
          display={"flex"}
          flexDirection={"column"}
          alignItems={"center"}
          padding={5}
          gap={2}
        >
          {/* <Link to="/local-game">Local Game</Link> */}
          <Button
            component={Link}
            to="/local-game"
            variant="contained"
            size="large"
          >
            <Typography variant="h4">Local Game</Typography>
          </Button>
          {/* <Button variant="contained" size="large">
            <Typography variant="h4">Join room</Typography>
          </Button>
          <Button variant="contained" size="large">
            <Typography variant="h4">Play Locally</Typography>
          </Button> */}
          <Button
            variant="contained"
            component={Link}
            to="/stockfish"
            size="large"
            color="primary"
          >
            <Typography variant="h4">Play VS BOT</Typography>
          </Button>
        </Box>
      </Paper>
      <Outlet />
      <Typography variant="body1" color="textSecondary">
        &copy; 2024 Denis Poczęty, Paweł Oparczyk
      </Typography>
    </Container>
  );
}

export default Home;
