import { Box, Typography } from "@mui/material";
import { useSocket } from "../contexts/SocketContext";
import { useEffect, useState, useRef } from "react";
import { PlayerTurn } from "../types/PlayerTurnType";

type Message = {
  text: string;
  playerColor: PlayerTurn;
  messageTime: string;
};

function Chat() {
  const socketInstance = useSocket().socket;
  const [messages, setMessages] = useState<Message[]>([]);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const handleMessage = (message: Message) => {
    console.log(message);
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

  return (
    <Box position={"fixed"} bottom={0} right={0}>
      <Box
        style={{
          height: "300px",
          width: "300px",
          overflow: "auto",
          backgroundColor: "#ffffff44",
        }}
      >
        {messages.map((message, index) => (
          <Box key={index}>
            <Box display="flex" alignItems={"center"} gap={1}>
              <Typography variant="body2">{message.messageTime} </Typography>
              <Typography variant="body2"> [{message.playerColor}]</Typography>
              <Typography variant="body1">{message.text}</Typography>
            </Box>
          </Box>
        ))}
        <div ref={messagesEndRef} />
      </Box>
      <input
        style={{ width: "300px" }}
        type="text"
        onKeyPress={(e) => {
          if (e.key === "Enter") {
            if (e.target.value === "") return;
            socketInstance.emit("message", e.target.value);
            e.target.value = "";
          }
        }}
      />
    </Box>
  );
}

export default Chat;
