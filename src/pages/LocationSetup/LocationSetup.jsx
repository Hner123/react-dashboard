import Header from '../../components/Header';
import SidePanel from '../../components/SidePanel';
import { Button, Modal, Row, Form, Col } from 'react-bootstrap';
import { useState, useContext } from 'react';
import './locationSetup.css';
import Table from 'react-bootstrap/Table';
import MyContext from '../../MyContext';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import Tooltip from '@mui/material/Tooltip';
import AddNewCategory from './AddNewLocation';
import EditBranch from './EditBranch';
import Swal from 'sweetalert2';
import { useQueryClient, useMutation } from '@tanstack/react-query';
import { deleteLocation } from '../../reactQueryApi/api';
import BuildIcon from '@mui/icons-material/Build';
import ConstructionIcon from '@mui/icons-material/Construction';
import EngineeringIcon from '@mui/icons-material/Engineering';
import HandymanIcon from '@mui/icons-material/Handyman';
import SettingsIcon from '@mui/icons-material/Settings';
import { Box } from '@mui/material';

export default function LocationSetup() {
  const [sidePanelOPen, setSidePanelOPen] = useState(true);
  const [showAddNewModal, setShowAddNewModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [editData, setEditData] = useState([]);

  const { branchList } = useContext(MyContext);

  const togglePanel = () => {
    setSidePanelOPen(!sidePanelOPen);
  };

  const closeModal = () => {
    setShowAddNewModal(false);
    setShowEditModal(false);
  };

  const queryClient = useQueryClient();
  const deleteID = useMutation({
    mutationFn: deleteLocation,
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ['fetchBranch'] });
      if (data.message !== 'success') {
        Swal.fire({
          title: 'error!',
          text: data,
          icon: 'error',
        });
      }
    },
    onError: (error) => {
      // Handle error, e.g., display a notification to the user
      console.error('Error adding location:', error);
      Swal.fire({
        title: 'Error!',
        text: 'Failed to add new branch. ' + error,
        icon: 'error',
      });
    },
  });

  const deleteBranch = (id) => {
    Swal.fire({
      title: 'Are you sure?',
      text: 'You want to delete this branch?',
      icon: 'warning',
      showCancelButton: true,
      reverseButtons: true, // Add this line to swap the buttons
      cancelButtonColor: '#C8C8C8',
      confirmButtonColor: '#d33',
      confirmButtonText: 'Yes, delete it!',
    }).then((result) => {
      if (result.isConfirmed) {
        deleteID.mutate({ id });
      }
    });
  };

  return (
    <>
      <Header togglePanel={togglePanel} hamburgerClose={sidePanelOPen} />
      <SidePanel isOpen={sidePanelOPen} togglePanel={togglePanel} />
      <AddNewCategory showAddNewModal={showAddNewModal} closeModal={closeModal} />
      <EditBranch showEditModal={showEditModal} closeModal={closeModal} editData={editData} />

      <div className="locationMain">
        <div className="row">
          <div className="col">
            <h5>Manage Locations</h5>
          </div>
          <div className="col d-flex justify-content-end">
            <Button variant="primary" onClick={() => setShowAddNewModal(true)}>
              + Add New
            </Button>
          </div>
        </div>
        <div className="locationContent">
          <Table hover>
            <thead>
              <tr className="trStyling">
                <th>Branch</th>
                <th>Location</th>
                <th>Action</th>
              </tr>
            </thead>
            <tbody className="dataStyle">
              {branchList?.map((branch, index) => (
                <tr key={index}>
                  <td>{branch.branchName}</td>
                  <td className="locationBranch">{branch.location}</td>
                  <td>
                    <Tooltip title="Edit">
                      <EditIcon
                        onClick={() => {
                          setShowEditModal(true);
                          setEditData(branch);
                        }}
                        sx={{ cursor: 'pointer', fontSize: '18px', color: '#4099FF', marginRight: '25px' }}
                      />
                    </Tooltip>
                    <Tooltip title="Delete">
                      <DeleteIcon onClick={() => deleteBranch(branch.id)} sx={{ cursor: 'pointer', fontSize: '18px', color: '#FF5370' }} />
                    </Tooltip>
                  </td>
                </tr>
              ))}
            </tbody>
          </Table>
        </div>
      </div>
    </>
  );
}
