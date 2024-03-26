import * as React from "react";
import Button from "@mui/material/Button";
import Snackbar from "@mui/material/Snackbar";
import Alert from "@mui/material/Alert";

export default function SnackbarMessage({ openSnack }) {
  const [open, setOpen] = React.useState(openSnack);

  const handleClick = () => {
    setOpen(openSnack);
  };

  const handleClose = (event, reason) => {
    if (reason === "clickaway") {
      return;
    }

    setOpen(false);
  };

  return (
    <div>
      <Snackbar
        open={open}
        autoHideDuration={3000}
        onClose={handleClose}
        anchorOrigin={{ vertical: "top", horizontal: "right" }}
      >
        <Alert onClose={handleClose} severity="success" variant="filled" sx={{ width: "100%" }}>
          Notes has been saved!
        </Alert>
      </Snackbar>
    </div>
  );
}
