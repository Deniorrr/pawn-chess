import { createContext, useContext, useState } from "react";
import AlertBox from "../components/AlertBox";
import { Box } from "@mui/material";
import PropTypes from "prop-types";

const AlertContext = createContext();

export const useAlert = () => {
  return useContext(AlertContext);
};

export const AlertProvider = ({ children }) => {
  AlertProvider.propTypes = {
    children: PropTypes.node.isRequired,
  };
  const [alerts, setAlerts] = useState([]);

  const addAlert = (_message, _severity) => {
    setAlerts((prevAlerts) => [
      ...prevAlerts,
      { severity: _severity, message: _message },
    ]);
  };

  const deleteAlert = (key) => {
    setAlerts((prevAlerts) => prevAlerts.filter((_, index) => index !== key));
  };

  const renderAlerts = () => {
    return alerts.map((alert, index) => {
      return (
        <AlertBox
          key={index}
          id={index}
          severity={alert.severity}
          message={alert.message}
          deleteAlert={(_id) => deleteAlert(_id)}
        />
      );
    });
  };

  return (
    <AlertContext.Provider value={addAlert}>
      {children}
      <Box sx={{ position: "fixed", bottom: 0 }}>{renderAlerts()}</Box>
    </AlertContext.Provider>
  );
};
