import Header from "../components/Header";
import SidePanel from "../components/SidePanel";
import "../style/booking.css";
import axios from "axios";

import { useEffect, useState, useRef } from "react";
import DataTable from "datatables.net";
import $ from "jquery";
import "datatables.net-responsive";

import Button from "react-bootstrap/Button";
import Modal from "react-bootstrap/Modal";
import FloatingLabel from "react-bootstrap/FloatingLabel";
import Form from "react-bootstrap/Form";

export default function Test() {
  const [sidePanelOPen, setSidePanelOPen] = useState(true);
  const [show, setShow] = useState(false);
  const [firstRowData, setFirstRowData] = useState(0);
  const [showCancel, setShowCancel] = useState(false);
  const [reasons, setReasons] = useState("");

  const handleClose = () => {
    fetchBookingData();
    setShow(false);
    setShowCancel(false);
  };

  const acceptBooking = async () => {
    try {
      const dataAccept = { firstRowData };

      const response = await axios.post(process.env.REACT_APP_SENDACCEPTDATA, dataAccept);
      console.log("Accept data successfully: ", response.data);
      handleClose();
    } catch (error) {
      console.log("error fetching from accept booking: ", error);
    }
  };

  const reasonsValue = (event) => {
    setReasons(event.target.value);
  };

  const cancelBooking = async () => {
    try {
      const dataAccept = { firstRowData, reasons };

      const response = await axios.post(process.env.REACT_APP_SENDCANCELDATA, dataAccept);
      console.log("Cancel Data successfully: ", response.data);
      handleClose();
    } catch (error) {
      console.log("error fetching from accept booking: ", error);
    }
  };

  const cancelModal = () => setShowCancel(true);

  const handleShow = () => setShow(true);

  const togglePanel = () => {
    setSidePanelOPen(!sidePanelOPen);
    console.log("dashboard " + sidePanelOPen);
  };

  const fetchBookingData = async () => {
    try {
      const response = await axios.post(process.env.REACT_APP_BOOKINGLIST);
      console.log("Post successful:", response.data);

      const table = new DataTable("#myTable", {
        data: response.data.DateAndName,
        dom: "Bfrtip",
        buttons: ["colvis"],
        columns: [
          { title: "ID" },
          { title: "Schedule" },
          { title: "Name" },
          { title: "Email" },
          { title: "Phone Number" },
          { title: "Status" },
          { title: "Services" },
          { title: "Branch" },
          { title: "Notes" },
          {
            title: "Actions",
            render: function (data, type, row) {
              // Assuming you have access to row data, you can create buttons dynamically
              if (type === "display") {
                return `
                            <div class='d-flex' style='gap:.3rem;'>
                                <button class='btn btn-success btn-sm acceptBtn'>Accept</button>
                                <button class='btn btn-primary btn-sm cancelBtn'>Cancel</button>
                            </div>
                        `;
              }
              return null;
            },
          },
        ],
        createdRow: (row, data) => {
          // Attach event listeners to buttons when rows are created
          $(row)
            .find(".acceptBtn")
            .on("click", function () {
              // Retrieve data from the current row
              const rowData = table.row($(this).closest("tr")).data()[0];
              console.log("Data from current row:", rowData);
              handleShow();
              setFirstRowData(rowData);
            });
          $(row)
            .find(".cancelBtn")
            .on("click", function () {
              // Retrieve data from the current row
              const rowData = table.row($(this).closest("tr")).data()[0];
              console.log("Data from current row:", rowData);
              cancelModal();
              setFirstRowData(rowData);
            });
        },

        destroy: true, // I think some clean up is happening here
        responsive: true,
        deferRender: true,
        columnDefs: [
          {
            target: 0,
            visible: false,
            searchable: false,
          },
          {
            target: 3,
            visible: false,
            searchable: false,
          },
          { responsivePriority: 1, targets: -1 },
          { responsivePriority: 2, targets: 2 },
        ],
      });
      // Extra step to do extra clean-up.
      return function () {
        console.log("Table destroyed");
        table.destroy();
        // console.log("events to" + events);
      };
    } catch (error) {
      console.error("Error posting data:", error);
    }
  };

  useEffect(() => {
    fetchBookingData();
  }, []);

  return (
    <>
      <Header togglePanel={togglePanel} hamburgerClose={sidePanelOPen} />
      <SidePanel isOpen={sidePanelOPen} togglePanel={togglePanel} />

      <div className="bookingPage">
        <h1>Booking</h1>
        <div className="bookingTable">
          <table id="myTable" className="display" width="100%"></table>
        </div>
      </div>

      <Modal show={show} onHide={handleClose} aria-labelledby="contained-modal-title-vcenter" centered>
        <Modal.Header closeButton>{/* <Modal.Title>Modal heading</Modal.Title> */}</Modal.Header>
        <Modal.Body>Do you want to accept the booking? {firstRowData}</Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={acceptBooking}>
            Yes
          </Button>
          <Button variant="primary" onClick={handleClose}>
            Cancel
          </Button>
        </Modal.Footer>
      </Modal>
      {/* **********************Cancel Modal********************** */}
      <Modal show={showCancel} onHide={handleClose} aria-labelledby="contained-modal-title-vcenter" centered>
        <Modal.Header closeButton>{/* <Modal.Title>Modal heading</Modal.Title> */}</Modal.Header>
        <Modal.Body>
          <FloatingLabel controlId="floatingTextarea" label="Reasons for Cancelling" className="mb-3">
            <Form.Control
              as="textarea"
              placeholder="Leave a comment here"
              style={{ height: "80px" }}
              onChange={reasonsValue}
            />
          </FloatingLabel>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={cancelBooking}>
            Confirm
          </Button>
          <Button variant="primary" onClick={handleClose}>
            Cancel
          </Button>
        </Modal.Footer>
      </Modal>
    </>
  );
}