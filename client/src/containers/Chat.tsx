import { Box, TextField, Typography, Paper } from "@mui/material";
import { useSocket } from "../contexts/SocketContext";
import { useEffect, useState, useRef } from "react";
import { PlayerTurn } from "../types/PlayerTurnType";
import { brown } from "@mui/material/colors";

type Message = {
  text: string;
  playerColor: PlayerTurn;
  messageTime: string;
};

function Chat() {
  const socketInstance = useSocket().socket;
  const [messages, setMessages] = useState<Message[]>([]);
  const [inputValue, setInputValue] = useState("");
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const handleMessage = (message: Message) => {
    setMessages((prev) => [...prev, message]);
  };

  useEffect(() => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [messages]);

  useEffect(() => {
    if (!socketInstance) return;

    socketInstance.emit("getMessages");
    socketInstance.on("getMessages", (messages: Message[]) => {
      setMessages(messages);
    });

    socketInstance.on("message", handleMessage);

    return () => {
      socketInstance.off("message", handleMessage);
    };
  }, [socketInstance]);

  const handleKeyDown = (event: React.KeyboardEvent<HTMLInputElement>) => {
    if (event.key === "Enter") {
      socketInstance.emit("message", inputValue);
      setInputValue("");
    }
  };

  return (
    <Paper
      style={{
        width: "300px",
        position: "fixed",
        bottom: 15,
        right: 15,
        display: "flex",
        flexDirection: "column",
        backgroundColor: brown[100],
      }}
      elevation={12}
    >
      <Paper
        style={{
          backgroundColor: brown[200],
        }}
      >
        <Typography variant="h5" style={{ textAlign: "center" }}>
          Chat
        </Typography>
      </Paper>
      <Box
        style={{
          height: "300px",
          overflow: "auto",
          overflowY: "scroll",
          padding: "5px",
        }}
      >
        {messages.map((message, index) => (
          <Box key={index}>
            <Typography
              variant="body2"
              style={{
                wordWrap: "break-word",
              }}
            >
              {message.messageTime} [{message.playerColor}]{" "}
              <span style={{ fontWeight: "bold" }}>{message.text}</span>
            </Typography>
          </Box>
        ))}
        <div ref={messagesEndRef} />
      </Box>
      <TextField
        hiddenLabel
        variant="filled"
        type="text"
        size="small"
        value={inputValue}
        onChange={(e) => setInputValue(e.target.value)}
        onKeyDown={handleKeyDown}
        style={{
          margin: "10px",
          backgroundColor: brown[200],
        }}
      />
    </Paper>
  );
}

export default Chat;
