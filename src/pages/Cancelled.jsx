import Header from '../components/Header';
import SidePanel from '../components/SidePanel';
import { useState, useEffect } from 'react';
import '../style/cancelled.css';
import axios from 'axios';
import DataTable from 'datatables.net-bs5';
import $ from 'jquery';
import Modal from 'react-bootstrap/Modal';
import { Button } from 'react-bootstrap';

import Snackbar from '@mui/material/Snackbar';
import Alert from '@mui/material/Alert';

export default function Cancelled() {
  const [sidePanelOPen, setSidePanelOPen] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [firstRowData, setFirstRowData] = useState(0);
  const [active, setActive] = useState('Cancelled');

  const [openS, setOPenS] = useState(false);
  const [snackSeverity, setSnackSeverity] = useState('');
  const [snackMessage, setSnackMessage] = useState('');

  const [preload, setPreload] = useState(true);

  const togglePanel = () => {
    setSidePanelOPen(!sidePanelOPen);
    console.log('dashboard ' + sidePanelOPen);
  };

  const handleCloseSnack = (event, reason) => {
    if (reason === 'clickaway') {
      return;
    }

    setOPenS(false);
  };

  const showModalFunction = () => setShowModal(true);

  const handleClose = () => {
    setShowModal(false);
  };

  const fetchCancelData = async () => {
    try {
      const response = await axios.post(process.env.REACT_APP_CANCELLEDLIST);
      console.log('Post successful:', response.data);

      const table = new DataTable('#myTable', {
        data: response.data.DateAndName,
        dom: 'Bfrtip',
        buttons: ['colvis'],
        columns: [
          { title: 'ID' },
          { title: 'Schedule' },
          { title: 'Name' },
          { title: 'Email' },
          { title: 'Phone Number' },
          { title: 'Status' },
          { title: 'Services' },
          { title: 'Branch' },
          { title: 'Notes' },
          { title: 'Reasons for cancelling' },
        ],
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
          { responsivePriority: 1, targets: -1 },
          { responsivePriority: 2, targets: 2 },
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

  const deleteToHistory = async () => {
    try {
      const response = await axios.post(process.env.REACT_APP_DELETETOHISTORY);
      console.log('Fetch status response :', response.data);
    } catch (error) {
      console.log('error from deleteToHistry :', error);
    }
  };

  useEffect(() => {
    fetchCancelData();
    deleteToHistory();
  }, []);

  return (
    <>
      <Header togglePanel={togglePanel} hamburgerClose={sidePanelOPen} preload={preload} />
      <SidePanel isOpen={sidePanelOPen} togglePanel={togglePanel} activeNav={active} />

      <div className="cancelPage">
        <div className="co-md d-flex justify-content-between">
          <h1>Cancelled</h1>
          <span
            style={{
              fontSize: '12px',
              marginRight: '40px',
              fontStyle: 'italic',
              position: 'relative',
              top: '28px',
            }}
          >
            Cancelled data will be automatically deleted 7 days after posting.
          </span>
        </div>

        <div className="cancelTable">
          <table id="myTable" className="row-border" width="100%"></table>
        </div>
      </div>

      {/* **********************SNACK BAR POP UP***************************** */}
      <Snackbar
        open={openS}
        autoHideDuration={2000}
        onClose={handleCloseSnack}
        anchorOrigin={{ vertical: 'top', horizontal: 'right' }}
      >
        <Alert onClose={handleCloseSnack} severity={snackSeverity} variant="filled" sx={{ width: '100%' }}>
          {snackMessage}
        </Alert>
      </Snackbar>
    </>
  );
}
