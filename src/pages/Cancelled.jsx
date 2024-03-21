import Header from "../components/Header";
import SidePanel from "../components/SidePanel";
import { useState, useEffect } from "react";
import "../style/cancelled.css";
import axios from "axios";
import DataTable from "datatables.net-bs5";
import $ from "jquery";
import Modal from "react-bootstrap/Modal";
import { Button } from "react-bootstrap";

export default function Cancelled() {
  const [sidePanelOPen, setSidePanelOPen] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [firstRowData, setFirstRowData] = useState(0);

  const togglePanel = () => {
    setSidePanelOPen(!sidePanelOPen);
    console.log("dashboard " + sidePanelOPen);
  };

  const showModalFunction = () => setShowModal(true);

  const handleClose = () => {
    setShowModal(false);
  };

  const fetchCancelData = async () => {
    try {
      const response = await axios.post(process.env.REACT_APP_CANCELLEDLIST);
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
          { title: "Reasons for cancelling" },
          {
            title: "Actions",
            render: function (data, type, row) {
              // Assuming you have access to row data, you can create buttons dynamically
              if (type === "display") {
                return `
                            <div class='d-flex' style='gap:.3rem;'>
                                <button class='btn btn-danger btn-sm deleteBtn'>Delete</button>
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
            .find(".deleteBtn")
            .on("click", function () {
              // Retrieve data from the current row
              const rowData = table.row($(this).closest("tr")).data()[0];
              console.log("Data from current row:", rowData);
              showModalFunction();
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
          {
            target: 4,
            visible: false,
            searchable: false,
          },
          {
            target: 6,
            visible: false,
            searchable: false,
          },
          {
            target: 7,
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

  const deleteToHistory = async () => {
    const data = { firstRowData };

    try {
      const response = await axios.post(
        process.env.REACT_APP_DELETETOHISTORY,
        data
      );
      console.log("Fetch status response :", response.data);
      fetchCancelData();
      handleClose();
    } catch (error) {
      console.log("error from deleteToHistry :", error);
    }
  };

  useEffect(() => {
    fetchCancelData();
  }, []);

  return (
    <>
      <Header togglePanel={togglePanel} hamburgerClose={sidePanelOPen} />
      <SidePanel isOpen={sidePanelOPen} togglePanel={togglePanel} />

      <div className="cancelPage">
        <h1>Cancelled</h1>
        <div className="cancelTable">
          <table id="myTable" className="row-border"></table>
        </div>
      </div>

      <Modal
        size="sm"
        show={showModal}
        onHide={handleClose}
        aria-labelledby="contained-modal-title-vcenter"
        centered
      >
        <Modal.Header>
          <Modal.Title>Delete</Modal.Title>
        </Modal.Header>
        <Modal.Body>Are you sure you want to delete? {firstRowData}</Modal.Body>
        <Modal.Footer>
          <Button variant="primary" onClick={deleteToHistory}>
            Yes
          </Button>
          <Button variant="secondary" onClick={handleClose}>
            Cancel
          </Button>
        </Modal.Footer>
      </Modal>
    </>
  );
}
