import { createContext, useContext, useRef, useEffect } from "react";
import io from "socket.io-client";

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

  const connectSocket = (roomCode) => {
    if (!socketRef.current) {
      const newSocket = io.connect(socketUrl, {
        query: { roomCode },
      });
      socketRef.current = newSocket;
    }
    return socketRef.current;
  };

  useEffect(() => {
    return () => {
      if (socketRef.current) {
        socketRef.current.disconnect();
        console.log("disconnected from server");
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
