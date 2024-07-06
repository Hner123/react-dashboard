import Header from '../components/Header';
import SidePanel from '../components/SidePanel';
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import '../style/patients.css';
import axios from 'axios';
import AddPatients from '../components/AddPatients';

import PersonAddIcon from '@mui/icons-material/PersonAdd';
import Button from '@mui/material/Button';

import $ from 'jquery';
import DataTable from 'datatables.net-bs5';

import Modal from 'react-bootstrap/Modal';
import { ButtonToolbar } from 'react-bootstrap';
import DeletePatient from '../components/DeletePatient';

export default function Patients() {
  const [sidePanelOPen, setSidePanelOPen] = useState(true);
  const navigate = useNavigate();
  const [active, setActive] = useState('Patients');

  const [addPatientModal, setAddPatientModal] = useState(false);
  const [deletePatientModal, setDeletePatientModal] = useState(false);
  const [totalPatient, setTotalPatient] = useState(0);
  const [deleteId, setDeleteId] = useState(0);
  const [deleteModal, setDeleteModal] = useState(false);

  const [preload, setPreload] = useState(true);

  const handleClose = () => {
    setAddPatientModal(false);
    setDeletePatientModal(false);
  };

  const togglePanel = () => {
    setSidePanelOPen(!sidePanelOPen);
    console.log('dashboard ' + sidePanelOPen);
  };

  const patientDetailsPage = (id_num) => {
    // Navigate to a different route
    navigate('/pages/patients/patient-details?id=' + id_num);
  };

  const fetchPatientsData = async () => {
    try {
      const response = await axios.post(process.env.REACT_APP_MYPATIENTS);
      console.log('Post successful:', response.data);
      setTotalPatient(response.data.count);
      const table = new DataTable('#myTable', {
        data: response.data.myPatients,
        hover: true,

        columns: [
          { title: 'ID' },
          { title: 'Name' },
          { title: 'Address' },
          { title: 'Phone Number' },
          { title: 'Gender' },
          { title: 'Date Created' },
          {
            title: 'Actions',
            render: function (data, type, row) {
              // Assuming you have access to row data, you can create buttons dynamically
              if (type === 'display') {
                return `
                            <div class='d-flex' style='gap:.3rem;'>
                           
                                <button class='viewBtn d-flex justify-content-center align-items-center'>
                                View
                                  </button>
                                  <button class='deleteBtn d-flex justify-content-center align-items-center'>
                                Delete
                                  </button>
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
            .find('.viewBtn')
            .on('click', function () {
              // Retrieve data from the current row
              const rowData = table.row($(this).closest('tr')).data()[0];
              console.log('Data from current row:', rowData);
              patientDetailsPage(rowData);
            });
          $(row)
            .find('.deleteBtn')
            .on('click', function () {
              // Retrieve data from the current row
              const rowData = table.row($(this).closest('tr')).data()[0];
              console.log('Data from current row:', rowData);
              setDeleteId(rowData);
              setDeletePatientModal(true);
            });
        },

        destroy: true, // I think some clean up is happening here
        responsive: true,
        columnDefs: [
          {
            target: 0,
            visible: false,
            searchable: false,
          },
          { responsivePriority: 1, targets: -1 },
          { responsivePriority: 2, targets: 1 },
        ],
      });
      // Extra step to do extra clean-up.
      return function () {
        console.log('Table destroyed');
        table.destroy();
        // console.log("events to" + events);
      };
    } catch (error) {
      console.error('Error posting data:', error);
    } finally {
      setPreload(false);
    }
  };

  useEffect(() => {
    fetchPatientsData();
  }, []);

  return (
    <>
      <Header togglePanel={togglePanel} hamburgerClose={sidePanelOPen} preload={preload} />
      <SidePanel isOpen={sidePanelOPen} togglePanel={togglePanel} activeNav={active} />
      <div className="patientsPage">
        <h1>My Patients</h1>

        <div className="">
          <div className="row" style={{ maxWidth: '1100px', margin: 'auto' }}>
            <div className="col">
              <div>
                <span style={{ fontSize: '32px', fontWeight: '500', marginRight: '10px', color: '#2266D7' }}>{totalPatient}</span>
                <span style={{ color: '#6C757D' }}>Total Patients</span>
              </div>
            </div>
            <div className="col d-flex justify-content-end mb-3">
              <Button onClick={() => setAddPatientModal(true)} size="small" variant="contained" color="primary" startIcon={<PersonAddIcon />}>
                Add Patient
              </Button>
            </div>
          </div>
        </div>
        <div className="">
          <div className="patientsTable">
            <table id="myTable" className="row-border" width="100%"></table>
          </div>
        </div>
      </div>

      {/* ***************************ADD PATIENT MODAL*********************** */}
      <AddPatients patientModalOpen={addPatientModal} patientModalClose={handleClose} refetchData={fetchPatientsData} />
      {/* ***************************Delete PATIENT MODAL*********************** */}
      <DeletePatient refetchData={fetchPatientsData} deleteModalOpen={deletePatientModal} deleteModalClose={handleClose} id={deleteId} />
    </>
  );
}
