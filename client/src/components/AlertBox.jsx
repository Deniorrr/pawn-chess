import PropTypes from "prop-types";
import { Box, Alert, IconButton } from "@mui/material";
import Collapse from "@mui/material/Collapse";
import CloseIcon from "@mui/icons-material/Close";
import { useState, useEffect } from "react";

export default function AlertBox(props) {
  const [open, setOpen] = useState(false);

  useEffect(() => {
    setOpen(true);
    const timer = setTimeout(() => {
      setOpen(false);
      props.deleteAlert(props.id);
    }, 3000); // Close alert after 3 seconds

    return () => {
      clearTimeout(timer); // Cleanup the timer on unmount
    };
  }, []);

  return (
    <Box xs={8}>
      <Collapse in={open}>
        <Alert
          severity={props.severity}
          action={
            <IconButton
              aria-label="close"
              color="inherit"
              size="small"
              onClick={() => {
                setOpen(false);
              }}
            >
              <CloseIcon fontSize="inherit" />
            </IconButton>
          }
          sx={{ mb: 2 }}
        >
          {props.message}
        </Alert>
      </Collapse>
    </Box>
  );
}

AlertBox.propTypes = {
  severity: PropTypes.string.isRequired,
  message: PropTypes.string.isRequired,
  deleteAlert: PropTypes.func.isRequired,
  id: PropTypes.number.isRequired,
};
