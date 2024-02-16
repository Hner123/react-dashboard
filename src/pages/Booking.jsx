import Header from "../components/Header";
import SidePanel from "../components/SidePanel";
import "../style/booking.css";
import axios from "axios";
import { useEffect, useState, useRef } from "react";
import DataTable from "datatables.net-bs5";
import $ from "jquery";
// import "datatables.net-responsive-dt";

import Button from "react-bootstrap/Button";
import Modal from "react-bootstrap/Modal";

import "datatables.net-responsive-bs5/js/responsive.bootstrap5.js";
import "datatables.net-buttons/js/buttons.colVis.mjs";

export default function Booking() {
  const [sidePanelOPen, setSidePanelOPen] = useState(true);
  const [events, setEvents] = useState([]);
  const [show, setShow] = useState(false);
  const [firstRowData, setFirstRowData] = useState(0);

  const handleClose = () => {
    fetchBookingData();
    setShow(false);
  };
  const handleShow = () => setShow(true);

  const acceptBooking = async () => {
    try {
      const dataAccept = { firstRowData };

      const response = await axios.post(
        process.env.REACT_APP_SENDACCEPTDATA,
        dataAccept
      );
      console.log("Accept data successfully: ", response.data);
      handleClose();
      fetchBookingData();
    } catch (error) {
      console.log("error fetching from accept booking: ", error);
    }
  };

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
                                <button class='btn btn-success btn-sm acceptBtn' data-bs-toggle='modal' data-bs-target='#confirm_modal'>Accept</button>
                                <button class='btn btn-primary btn-sm cancelBtn' data-bs-toggle='modal' data-bs-target='#cancel_modal'>Cancel</button>
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
              const rowData = table.row($(this).closest("tr")).data();
              console.log("Data from current row:", rowData);
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
        console.log("events to" + events);
      };
    } catch (error) {
      console.error("Error posting data:", error);
    }
  };

  useEffect(() => {
    fetchBookingData();
    // console.log("dataSet daya " + data);
    console.log("events to" + events);
  }, []);
  return (
    <>
      <Header togglePanel={togglePanel} hamburgerClose={sidePanelOPen} />
      <SidePanel isOpen={sidePanelOPen} togglePanel={togglePanel} />
      <div className="bookingPage">
        <h5>Booking</h5>
        <div className="bookingTable">
          <table id="myTable" className="row-border"></table>
        </div>

        <Modal show={show} onHide={handleClose}>
          <Modal.Header closeButton>
            {/* <Modal.Title>Modal heading</Modal.Title> */}
          </Modal.Header>
          <Modal.Body>
            Do you want to accept the booking? {firstRowData}
          </Modal.Body>
          <Modal.Footer>
            <Button variant="secondary" onClick={acceptBooking}>
              Yes
            </Button>
            <Button variant="primary" onClick={handleClose}>
              Save Changes
            </Button>
          </Modal.Footer>
        </Modal>
      </div>
    </>
  );
}
