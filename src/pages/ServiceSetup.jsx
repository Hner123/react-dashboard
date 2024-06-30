import Header from '../components/Header';
import SidePanel from '../components/SidePanel';
import { useEffect, useRef, useState } from 'react';
import '../components/ServiceSetup Components/serviceSetup.css';
import Icon from '@mui/material/Icon';
import { fetchCategoryService } from '../reactQueryApi/api';
import { useQuery } from '@tanstack/react-query';
import AddService from '../components/ServiceSetup Components/AddService';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import MoreVertIcon from '@mui/icons-material/MoreVert';
import ExpandLess from '@mui/icons-material/ExpandLess';
import ExpandMore from '@mui/icons-material/ExpandMore';
import SearchIcon from '@mui/icons-material/Search';
import InputAdornment from '@mui/material/InputAdornment';
import { styled } from '@mui/system';
import Swal from 'sweetalert2';
import {
  Typography,
  ListItemIcon,
  IconButton,
  Menu,
  MenuItem,
  List,
  ListItem,
  ListItemText,
  ListItemSecondaryAction,
  TextField,
  Collapse,
} from '@mui/material';

export default function ServiceSetup() {
  const [sidePanelOPen, setSidePanelOPen] = useState(true);
  const [active] = useState('ServiceSetup');
  const togglePanel = () => {
    setSidePanelOPen(!sidePanelOPen);
  };

  const [showAddServiceModal, setShowAddServiceModal] = useState(false);
  const [categoryData, setCategoryData] = useState([]);
  const [anchorEl, setAnchorEl] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [openCategories, setOpenCategories] = useState({});
  const [categoryColors, setCategoryColors] = useState({});

  const handleCloseModal = () => {
    setShowAddServiceModal(false);
  };

  //   fetch category and service list -react query
  const {
    data: serviceListData,
    error,
    isLoading,
  } = useQuery({
    queryKey: ['CategoryServiceList'],
    queryFn: fetchCategoryService,
  });

  const colors = ['#2ED8B6', '#4099FF', '#FFB64D', '#FF5370', '#B0B0B0'];

  const ColorFlare = styled('div')(({ color }) => ({
    width: 4,
    height: 50, // Explicit height of 50px
    backgroundColor: color, // Use the color prop
    marginRight: 16, // Use static value for margin-right
    borderRadius: 5,
  }));

  useEffect(() => {
    // Initialize category colors when component mounts
    const colorsMap = {};
    serviceListData?.forEach((category, index) => {
      colorsMap[category.id] = colors[index % colors.length];
    });
    setCategoryColors(colorsMap);
  }, [serviceListData]);

  const handleClick = (event, selectedService) => {
    setAnchorEl(event.currentTarget);
    // setSelectedPayment(payment);
    console.log('daya na click', selectedService);
  };

  const handleClose = () => {
    setAnchorEl(null);
    // setSelectedPayment(null);
  };

  const categoryList = (datas) => {
    return datas?.map((data, index) => (
      <div className="category mt-3" key={index}>
        <div className="categoryName">
          <h5>{data.category_name}</h5>
          <span
            className="addCategory"
            onClick={() => {
              setCategoryData([data.category_name, data.id]);
              setShowAddServiceModal(true);
            }}
          >
            +
          </span>
        </div>
        <div className="serviceList">
          <List>
            {data.service_list?.map((list, i) => (
              <ListItem key={i}>
                <ListItemText primary={list.service_name} secondary={list.service_duration} />
                <ListItemSecondaryAction>
                  <IconButton edge="end" onClick={(e) => handleClick(e, list)}>
                    <Icon>more_horiz</Icon>
                  </IconButton>
                </ListItemSecondaryAction>
              </ListItem>
            ))}
          </List>
        </div>
      </div>
    ));
  };

  // if (isLoading) {
  //   return <div>Loading...</div>;
  // }

  // if (error) {
  //   return <div>Error: {error.message}</div>;
  // }
  const handleToggleCategory = (categoryId) => {
    setOpenCategories((prevOpenCategory) => ({
      ...prevOpenCategory,
      [categoryId]: !prevOpenCategory[categoryId],
    }));
    console.log(openCategories);
  };

  const filteredData = serviceListData
    ?.map((category) => ({
      ...category,
      service_list: category.service_list?.filter((service) => service.service_name.toLowerCase().includes(searchQuery.toLowerCase())),
    }))
    .filter((category) => category.service_list.length > 0);

  const serviceData = (filteredParamData) => {
    return (
      <List>
        {filteredParamData?.map((category) => (
          <div key={category.id}>
            <ListItem button onClick={() => handleToggleCategory(category.id)} sx={{ borderBottom: '1px solid #e0e0e0' }}>
              <ListItemText primary={category.category_name} />
              {openCategories[category.id] ? <ExpandLess /> : <ExpandMore />}
            </ListItem>

            <Collapse in={openCategories[category.id]} timeout="auto" unmountOnExit>
              <span
                className="addCategory"
                onClick={() => {
                  setCategoryData([category.category_name, category.id]);
                  setShowAddServiceModal(true);
                }}
              >
                + Add Service
              </span>
              <List component="div" disablePadding>
                {category.service_list?.map((service) => (
                  <ListItem key={service.id} sx={{ pl: 4 }}>
                    <ColorFlare color={categoryColors[category.id]} />

                    <ListItemText
                      primary={
                        <Typography variant="body1" style={{ fontSize: '16px' }}>
                          {service.service_name}
                        </Typography>
                      }
                      secondary={
                        <Typography variant="body1" style={{ fontSize: '12px', color: '#C8C8C8' }}>
                          {service.service_duration}
                        </Typography>
                      }
                    />
                    <ListItemSecondaryAction>
                      <IconButton edge="end" onClick={(e) => handleClick(e, service)}>
                        <MoreVertIcon />
                      </IconButton>
                    </ListItemSecondaryAction>
                  </ListItem>
                ))}
              </List>
            </Collapse>
          </div>
        ))}
      </List>
    );
  };

  return (
    <>
      <Header togglePanel={togglePanel} hamburgerClose={sidePanelOPen} />
      <SidePanel isOpen={sidePanelOPen} togglePanel={togglePanel} activeNav={active} />
      <AddService showAddServiceModal={showAddServiceModal} handleCloseModal={handleCloseModal} categoryData={categoryData} />

      <div className="seviceSetup">
        <div className="setupContent">
          <div className="row">
            <div className="col">
              <TextField
                label="Search services"
                variant="outlined"
                fullWidth
                margin="normal"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                InputProps={{
                  startAdornment: (
                    <InputAdornment>
                      <SearchIcon />
                    </InputAdornment>
                  ),
                }}
              />
            </div>
            <div className="col-2"></div>
          </div>

          {serviceData(filteredData)}
        </div>
      </div>
      <Menu anchorEl={anchorEl} open={Boolean(anchorEl)} onClose={handleClose}>
        <MenuItem onClick={() => console.log('edit')} sx={{ fontSize: '14px', fontWeight: '300 !important' }}>
          <ListItemIcon>
            <EditIcon fontSize="small" />
          </ListItemIcon>
          Edit
        </MenuItem>
        <MenuItem
          onClick={() => {
            handleClose();
            Swal.fire({
              title: 'Are you sure?',
              text: "You won't be able to revert this!",
              icon: 'warning',
              showCancelButton: true,
              reverseButtons: true, // Add this line to swap the buttons
              cancelButtonColor: '#C8C8C8',
              confirmButtonColor: '#d33',
              confirmButtonText: 'Yes, delete it!',
            }).then((result) => {
              if (result.isConfirmed) {
                // handleDeleteBooking();
                // Swal.fire({
                //   title: 'Canceled!',
                //   text: 'Canceled booking successfully.',
                //   icon: 'success',
                // });
              }
            });
          }}
          sx={{ fontSize: '14px', fontWeight: '300 !important' }}
        >
          <ListItemIcon>
            <DeleteIcon fontSize="small" />
          </ListItemIcon>
          Delete
        </MenuItem>
      </Menu>
    </>
  );
}
