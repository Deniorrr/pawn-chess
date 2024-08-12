// SocketContext.js
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
  const socketRef = useRef();

  useEffect(() => {
    socketRef.current = io("http://your-server-url"); // Replace with your server URL

    return () => {
      socketRef.current.disconnect();
    };
  }, []);

  return (
    <SocketContext.Provider value={socketRef.current}>
      {children}
    </SocketContext.Provider>
  );
};
