import Header from '../../components/Header';
import SidePanel from '../../components/SidePanel';
import './myPatients.css';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import axios from 'axios';
import Swal from 'sweetalert2';
import InputAdornment from '@mui/material/InputAdornment';
import SearchIcon from '@mui/icons-material/Search';
import { useQueryClient, useMutation } from '@tanstack/react-query';
import {
  ListItemIcon,
  IconButton,
  TextField,
  Typography,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Checkbox,
  Paper,
  TableSortLabel,
  TablePagination,
  Menu,
  MenuItem,
} from '@mui/material';
import MoreHorizIcon from '@mui/icons-material/MoreHoriz';
import Button from '@mui/material/Button';
import VisibilityIcon from '@mui/icons-material/Visibility';
import AddIcon from '@mui/icons-material/Add';
import DeleteIcon from '@mui/icons-material/Delete';
import PersonAddIcon from '@mui/icons-material/PersonAdd';
import { deletePatientArray } from '../../reactQueryApi/api';
import AddPatient from './AddPatient';

export default function MyPatients() {
  const [sidePanelOPen, setSidePanelOPen] = useState(true);
  const [selected, setSelected] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [order, setOrder] = useState('asc');
  const [orderBy, setOrderBy] = useState('');
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [showModal, setShowModal] = useState(false);
  const navigate = useNavigate();
  const [anchorEl, setAnchorEl] = useState(null);
  const [viewPatient, setViewPatient] = useState(null);

  const togglePanel = () => {
    setSidePanelOPen(!sidePanelOPen);
  };

  const closeModal = () => {
    setShowModal(false);
  };

  const descendingComparator = (a, b, orderBy) => {
    if (b[orderBy] < a[orderBy]) {
      return -1;
    }
    if (b[orderBy] > a[orderBy]) {
      return 1;
    }
    return 0;
  };

  const getComparator = (order, orderBy) => {
    return order === 'desc' ? (a, b) => descendingComparator(a, b, orderBy) : (a, b) => -descendingComparator(a, b, orderBy);
  };

  const stableSort = (array, comparator) => {
    const stabilizedThis = array.map((el, index) => [el, index]);
    stabilizedThis.sort((a, b) => {
      const order = comparator(a[0], b[0]);
      if (order !== 0) return order;
      return a[1] - b[1];
    });
    return stabilizedThis.map((el) => el[0]);
  };

  const filteredData = () => {
    const queries = searchQuery.toString().toLowerCase().split(' ');

    return patientList.patientList.filter((list) =>
      queries.every(
        (query) =>
          list.name.toLowerCase().includes(query) ||
          list.email.toLowerCase().includes(query) ||
          list.address.toLowerCase().includes(query) ||
          list.phoneNumber.toString().toLowerCase().includes(query) ||
          list.gender.toLowerCase().includes(query) ||
          list.dateCreated.toLowerCase().includes(query)
      )
    );
  };

  const escapeRegExp = (string) => {
    return string.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
  };

  const highlightText = (text, queries) => {
    if (!queries) {
      return text;
    }

    const terms = queries.toString().toLowerCase().split(' ');
    const escapedQueries = terms.map((term) => escapeRegExp(term));
    const combinedPattern = new RegExp(`(${escapedQueries.join('|')})`, 'gi');
    const parts = text.split(combinedPattern);

    return parts.map((part, index) =>
      terms.includes(part.toLowerCase()) ? (
        <span key={index} style={{ backgroundColor: 'yellow' }}>
          {part}
        </span>
      ) : (
        part
      )
    );
  };

  const fetchPatientList = async () => {
    const response = await axios.post(process.env.REACT_APP_FETCHPATIENTLIST);
    return response.data;
  };

  const {
    data: patientList,
    error: error,
    isLoading: loading,
  } = useQuery({
    queryKey: ['patientList'],
    queryFn: fetchPatientList,
  });

  const handleClick = (event, id) => {
    const selectedIndex = selected.indexOf(id);
    let newSelected = [];

    if (selectedIndex === -1) {
      newSelected = newSelected.concat(selected, id);
    } else if (selectedIndex === 0) {
      newSelected = newSelected.concat(selected.slice(1));
    } else if (selectedIndex === selected.length - 1) {
      newSelected = newSelected.concat(selected.slice(0, -1));
    } else if (selectedIndex > 0) {
      newSelected = newSelected.concat(selected.slice(0, selectedIndex), selected.slice(selectedIndex + 1));
    }

    setSelected(newSelected);
  };

  const handleSelectAllClick = (event) => {
    if (event.target.checked) {
      const newSelecteds = filteredData()?.map((list) => list.id);
      setSelected(newSelecteds);
      console.log(newSelecteds);
      return;
    }
    setSelected([]);
  };

  const isSelected = (id) => selected.indexOf(id) !== -1;

  const handleRequestSort = (event, property) => {
    const isAsc = orderBy === property && order === 'asc';
    setOrder(isAsc ? 'desc' : 'asc');
    setOrderBy(property);
  };

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  const handleDeletePatient = () => {
    console.log({ selected });
    mutationDeletePatient.mutate({ selected });
  };

  const queryClient = useQueryClient();
  const mutationDeletePatient = useMutation({
    mutationFn: deletePatientArray,
    onSuccess: (data) => {
      if (data.message !== 'success') {
        Swal.fire({
          title: 'ERROR!',
          text: JSON.stringify(data),
          icon: 'error',
        });
      } else {
        setSelected([]);
        queryClient.invalidateQueries({ querqueryKey: ['patientList'] });
      }
    },
    onError: (error) => {
      console.error('Error changing status:', error);
      Swal.fire({
        title: 'Error!',
        text: 'Error..' + error,
        icon: 'error',
      });
    },
  });

  const handleClickElips = (e, id) => {
    setViewPatient(id);
    // navigate('/pages/patients/patient-details?id=' + id);
    setAnchorEl(e.currentTarget);
    e.stopPropagation();
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  if (loading) {
    return <div className="trigError">YAWA...</div>;
  }

  if (error) {
    return <div>Error: {error.message}</div>;
  }

  return (
    <>
      <Header togglePanel={togglePanel} hamburgerClose={sidePanelOPen} />
      <SidePanel isOpen={sidePanelOPen} togglePanel={togglePanel} />
      <AddPatient showModal={showModal} closeModal={closeModal} />

      <div className="myPatientsMain">
        <div className="row">
          <div className="col">
            <h5>My Patients</h5>
          </div>
          <div className="col d-flex justify-content-end">
            <Button
              className="iconDeleteMobile"
              onClick={() => {
                Swal.fire({
                  title: 'Are you sure?',
                  text: 'You want to delete this patients info? ',
                  icon: 'warning',
                  showCancelButton: true,
                  reverseButtons: true, // Add this line to swap the buttons
                  cancelButtonColor: '#C8C8C8',
                  confirmButtonColor: '#d33',
                  confirmButtonText: 'Yes, delete it!',
                }).then((result) => {
                  if (result.isConfirmed) {
                    handleDeletePatient();
                  }
                });
              }}
              disabled={selected.length === 0 ? true : false}
              variant="contained"
              sx={{ backgroundColor: '#FF5370' }}
              startIcon={<DeleteIcon />}
            >
              {selected.length === 0 ? '' : ` (${selected.length})`}
            </Button>
            <Button
              className="iconAddMobile"
              onClick={() => setShowModal(true)}
              variant="contained"
              color="primary"
              startIcon={<PersonAddIcon />}
              style={{ marginLeft: '10px' }}
            ></Button>
          </div>
        </div>

        <div className="myPatientContent">
          <div className="managePatient">
            <TextField
              className="searchField"
              sx={{ width: '40%' }}
              label="Search"
              variant="outlined"
              margin="normal"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="end">
                    <SearchIcon />
                  </InputAdornment>
                ),
              }}
            />

            <div className="addDelete">
              <Button
                className="iconDelete"
                onClick={() => {
                  Swal.fire({
                    title: 'Are you sure?',
                    text: 'You want to delete this patients info? ',
                    icon: 'warning',
                    showCancelButton: true,
                    reverseButtons: true, // Add this line to swap the buttons
                    cancelButtonColor: '#C8C8C8',
                    confirmButtonColor: '#d33',
                    confirmButtonText: 'Yes, delete it!',
                  }).then((result) => {
                    if (result.isConfirmed) {
                      handleDeletePatient();
                    }
                  });
                }}
                disabled={selected.length === 0 ? true : false}
                variant="contained"
                sx={{ backgroundColor: '#FF5370' }}
                startIcon={<DeleteIcon />}
              >
                Delete {selected.length === 0 ? '' : ` (${selected.length})`}
              </Button>
              <Button
                className="iconAdd"
                onClick={() => setShowModal(true)}
                variant="contained"
                color="primary"
                startIcon={<PersonAddIcon />}
                style={{ marginLeft: '10px' }}
              >
                Add Patient
              </Button>
            </div>
          </div>

          <TableContainer component={Paper}>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell padding="checkbox">
                    <Checkbox
                      indeterminate={selected.length > 0 && selected.length < filteredData().length}
                      checked={filteredData().length > 0 && selected.length === filteredData().length}
                      onChange={handleSelectAllClick}
                    />
                  </TableCell>
                  <TableCell>
                    <TableSortLabel
                      active={orderBy === 'name'}
                      direction={orderBy === 'name' ? order : 'asc'}
                      onClick={(event) => handleRequestSort(event, 'name')}
                    >
                      Patient Info
                    </TableSortLabel>
                  </TableCell>
                  <TableCell>
                    <TableSortLabel
                      active={orderBy === 'phoneNumber'}
                      direction={orderBy === 'phoneNumber' ? order : 'asc'}
                      onClick={(event) => handleRequestSort(event, 'phoneNumber')}
                    >
                      Phone Number
                    </TableSortLabel>
                  </TableCell>
                  <TableCell>
                    <TableSortLabel
                      active={orderBy === 'address'}
                      direction={orderBy === 'address' ? order : 'asc'}
                      onClick={(event) => handleRequestSort(event, 'address')}
                    >
                      Address
                    </TableSortLabel>
                  </TableCell>
                  <TableCell>
                    <TableSortLabel
                      active={orderBy === 'gender'}
                      direction={orderBy === 'gender' ? order : 'asc'}
                      onClick={(event) => handleRequestSort(event, 'gender')}
                    >
                      Gender
                    </TableSortLabel>
                  </TableCell>
                  <TableCell>
                    <TableSortLabel
                      active={orderBy === 'dateCreated'}
                      direction={orderBy === 'dateCreated' ? order : 'asc'}
                      onClick={(event) => handleRequestSort(event, 'dateCreated')}
                    >
                      Register Date
                    </TableSortLabel>
                  </TableCell>
                  <TableCell></TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {stableSort(filteredData(), getComparator(order, orderBy))
                  .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                  .map((list) => {
                    const isItemSelected = isSelected(list.id);
                    const labelId = `enhanced-table-checkbox-${list.id}`;

                    return (
                      <TableRow
                        sx={{ fontSize: '12px !important' }}
                        hover
                        role="checkbox"
                        onClick={(event) => handleClick(event, list.id)}
                        aria-checked={isItemSelected}
                        tabIndex={-1}
                        key={list.id}
                        selected={isItemSelected}
                      >
                        <TableCell padding="checkbox">
                          <Checkbox checked={isItemSelected} inputProps={{ 'aria-labelledby': labelId }} />
                        </TableCell>

                        <TableCell component="th" id={labelId} scope="row">
                          <Typography sx={{ fontSize: '14px', fontWeight: '500' }} variant="body1">
                            {highlightText(list.name, searchQuery)}
                          </Typography>
                          <Typography sx={{ fontSize: '12px' }} variant="body2" color="textSecondary">
                            {highlightText(list.email, searchQuery)}
                          </Typography>
                        </TableCell>

                        <TableCell>{highlightText(list.phoneNumber.toString(), searchQuery)}</TableCell>
                        <TableCell>{highlightText(list.address, searchQuery)}</TableCell>

                        <TableCell>{highlightText(list.gender, searchQuery)}</TableCell>
                        <TableCell>{highlightText(list.dateCreated, searchQuery)}</TableCell>
                        <TableCell>
                          <IconButton edge="end" onClick={(e) => handleClickElips(e, list.id)}>
                            <MoreHorizIcon />
                          </IconButton>
                        </TableCell>
                      </TableRow>
                    );
                  })}
              </TableBody>
            </Table>
            <TablePagination
              rowsPerPageOptions={[5, 10, 25]}
              component="div"
              count={filteredData().length}
              rowsPerPage={rowsPerPage}
              page={page}
              onPageChange={handleChangePage}
              onRowsPerPageChange={handleChangeRowsPerPage}
            />
          </TableContainer>
        </div>
      </div>
      <Menu anchorEl={anchorEl} open={Boolean(anchorEl)} onClose={handleClose}>
        <MenuItem
          onClick={() => {
            handleClose();
            navigate('/pages/patients/patient-details?id=' + viewPatient);
          }}
          sx={{ fontSize: '14px', fontWeight: '300 !important' }}
        >
          <VisibilityIcon fontSize="small" sx={{ marginRight: '5px', color: '#333' }} />
          View
        </MenuItem>
      </Menu>
    </>
  );
}
