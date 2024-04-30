import { Container, Typography, Paper, Box } from "@mui/material";
import React from "react";

function Room() {
  return (
    <Container>
      <Paper elevation={3}>
        <Box padding={4}>
          <Typography variant="h2" gutterBottom>
            Room ID: 123456
          </Typography>
          <Typography variant="h4" gutterBottom>
            waiting for second player...
          </Typography>
        </Box>
      </Paper>
    </Container>
  );
}

export default Room;
