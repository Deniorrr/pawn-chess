import { Button, Paper, Box, Container, Typography } from "@mui/material";

function Home() {
  return (
    <Container
      style={{
        height: "100vh",
        display: "flex",
        flexDirection: "column",
        justifyContent: "space-between",
        alignItems: "center",
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
          <Button variant="contained">Create Room</Button>
          <Button variant="contained">Join room</Button>
          <Button variant="contained">Play Locally</Button>
          <Button variant="contained" color="primary" disabled>
            Play VS BOT
          </Button>
        </Box>
      </Paper>
      <Typography variant="body1" color="textSecondary">
        &copy; 2024 Denis Poczęty
      </Typography>
    </Container>
  );
}

export default Home;
