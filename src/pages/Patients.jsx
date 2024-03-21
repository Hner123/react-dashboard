import Header from "../components/Header";
import SidePanel from "../components/SidePanel";
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import "../style/patients.css";
import axios from "axios";
import DataTable from "datatables.net-bs5";
import $ from "jquery";

export default function Patients() {
  const [sidePanelOPen, setSidePanelOPen] = useState(true);
  const navigate = useNavigate();

  const togglePanel = () => {
    setSidePanelOPen(!sidePanelOPen);
    console.log("dashboard " + sidePanelOPen);
  };

  const patientDetailsPage = (id_num) => {
    // Navigate to a different route
    navigate("/pages/patients/patient-details?id=" + id_num);
  };

  const fetchPatientsData = async () => {
    try {
      const response = await axios.post(process.env.REACT_APP_MYPATIENTS);
      console.log("Post successful:", response.data);

      const table = new DataTable("#myTable", {
        data: response.data.myPatients,
        dom: "Bfrtip",
        // buttons: ["colvis"],
        columns: [
          { title: "ID" },
          { title: "Name" },
          { title: "Address" },
          { title: "Phone Number" },
          { title: "Gender" },
          { title: "Date Created" },
          {
            title: "Actions",
            render: function (data, type, row) {
              // Assuming you have access to row data, you can create buttons dynamically
              if (type === "display") {
                return `
                            <div class='d-flex' style='gap:.3rem;'>
                                <button class='btn btn-primary btn-sm viewBtn'>View</button>
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
            .find(".viewBtn")
            .on("click", function () {
              // Retrieve data from the current row
              const rowData = table.row($(this).closest("tr")).data()[0];
              console.log("Data from current row:", rowData);
              patientDetailsPage(rowData);
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
    fetchPatientsData();
  }, []);

  return (
    <>
      <Header togglePanel={togglePanel} hamburgerClose={sidePanelOPen} />
      <SidePanel isOpen={sidePanelOPen} togglePanel={togglePanel} />

      <div className="patientsPage">
        <h1>My Patients</h1>
        <div className="patientsTable">
          <table id="myTable" className="row-border"></table>
        </div>
      </div>
    </>
  );
}
