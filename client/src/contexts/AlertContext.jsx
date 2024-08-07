import { createContext, useContext, useEffect, useState } from "react";
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
    console.log(alerts);
    console.log([...alerts, { severity: _severity, message: _message }]);
    setAlerts((prevAlerts) => [
      ...prevAlerts,
      { severity: _severity, message: _message },
    ]);
  };

  const deleteAlert = (key) => {
    setAlerts((prevAlerts) => prevAlerts.filter((_, index) => index !== key));
  };

  useEffect(() => {
    // console.log("alert changed", alerts);
  }, [alerts]);

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
