import { Button, Modal, Row, Col } from "react-bootstrap";
import Form from "react-bootstrap/Form";
import { useState } from "react";
import axios from "axios";
import Snackbar from "@mui/material/Snackbar";
import Alert from "@mui/material/Alert";

export default function DeletePatient({ refetchData, deleteModalOpen, deleteModalClose, id }) {
  const [openS, setOPenS] = useState(false);
  const [snackSeverity, setSnackSeverity] = useState("");
  const [snackMessage, setSnackMessage] = useState("");

  const handleCloseSnack = (event, reason) => {
    if (reason === "clickaway") {
      return;
    }

    setOPenS(false);
  };
  const deleteData = async () => {
    try {
      const data = { id };
      const response = await axios.post(process.env.REACT_APP_DELETEPATIENT, data);
      console.log("Patient deleted success :" + response.data);
      deleteModalClose();
      refetchData();

      setOPenS(true);
      setSnackMessage("Succesfully deleted patient!");
      setSnackSeverity("success");
    } catch (error) {
      console.log("Delete patient failed :", error);
      setOPenS(true);
      setSnackMessage("Error deleting patient!");
      setSnackSeverity("error");
    }
  };

  return (
    <>
      <Modal
        size="sm"
        show={deleteModalOpen}
        onHide={deleteModalClose}
        aria-labelledby="contained-modal-title-vcenter"
        centered
      >
        <Modal.Header>
          <Modal.Title style={{ fontSize: "20px" }}>
            <p className="mb-0">Delete </p>
          </Modal.Title>
        </Modal.Header>
        <Modal.Body>Are you sure you want to delete this patient?</Modal.Body>
        <Modal.Footer>
          <Button variant="primary" onClick={deleteData}>
            Yes
          </Button>
          <Button variant="secondary" onClick={deleteModalClose}>
            Cancel
          </Button>
        </Modal.Footer>
      </Modal>
      {/* **********************SNACK BAR POP UP***************************** */}
      <Snackbar
        open={openS}
        autoHideDuration={2000}
        onClose={handleCloseSnack}
        anchorOrigin={{ vertical: "top", horizontal: "right" }}
      >
        <Alert onClose={handleCloseSnack} severity={snackSeverity} variant="filled" sx={{ width: "100%" }}>
          {snackMessage}
        </Alert>
      </Snackbar>
    </>
  );
}
