import { createContext, useContext, useRef, useEffect } from "react";
import io from "socket.io-client";
import { useAlert } from "../contexts/AlertContext";

const SocketContext = createContext();

export const useSocket = () => {
  return useContext(SocketContext);
};

import PropTypes from "prop-types";

export const SocketProvider = ({ children }) => {
  SocketProvider.propTypes = {
    children: PropTypes.node.isRequired,
  };

  const socketUrl = "http://localhost:3000"; // Replace with your server URL, use .env file

  const socketRef = useRef(null);

  const addAlert = useAlert();

  const connectSocket = (roomCode) => {
    if (!socketRef.current) {
      const newSocket = io.connect(socketUrl, {
        query: { roomCode },
      });

      newSocket.on("connect", () => {
        addAlert("connected to server", "info");
      });

      newSocket.on("disconnect", () => {
        addAlert("disconnected from server", "info");
      });

      socketRef.current = newSocket;
    }
    return socketRef.current;
  };

  useEffect(() => {
    return () => {
      if (socketRef.current) {
        socketRef.current.disconnect();
      }
    };
  }, []);

  return (
    <SocketContext.Provider
      value={{ socket: socketRef.current, connectSocket }}
    >
      {children}
    </SocketContext.Provider>
  );
};
