import Header from '../components/Header';
import SidePanel from '../components/SidePanel';
import { useEffect, useRef, useState, useContext } from 'react';
import '../components/ServiceSetup Components/serviceSetup.css';
import Icon from '@mui/material/Icon';
import { fetchCategoryService } from '../reactQueryApi/api';
import { useQuery } from '@tanstack/react-query';
import AddService from '../components/ServiceSetup Components/AddService';
import EditService from '../components/ServiceSetup Components/EditService';
import EditCategoryName from '../components/ServiceSetup Components/EditCategoryName';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import MoreVertIcon from '@mui/icons-material/MoreVert';
import ExpandLess from '@mui/icons-material/ExpandLess';
import ExpandMore from '@mui/icons-material/ExpandMore';
import SearchIcon from '@mui/icons-material/Search';
import InputAdornment from '@mui/material/InputAdornment';
import { styled } from '@mui/system';
import Swal from 'sweetalert2';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { deleteServiceId, deleteCategory } from '../reactQueryApi/api';
import AddIcon from '@mui/icons-material/Add';
import MyContext from '../MyContext';
import AddCategory from '../components/ServiceSetup Components/AddCategory';
import {
  Button,
  Box,
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
  const [showEditServiceModal, setShowEditServiceModal] = useState(false);
  const [showAddCategory, setShowAddCategory] = useState(false);
  const [showEditCategoryModal, setShowEditCategoryModal] = useState(false);
  const [categoryName, setCategoryName] = useState({});
  const [categoryData, setCategoryData] = useState([]);
  const [anchorEl, setAnchorEl] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [openCategories, setOpenCategories] = useState({});
  const [categoryColors, setCategoryColors] = useState({});
  const [deleteID, setDeleteID] = useState(null);

  const { setEditServiceData } = useContext(MyContext);

  const handleCloseModal = () => {
    setShowAddServiceModal(false);
    setShowEditServiceModal(false);
    setShowAddCategory(false);
    setShowEditCategoryModal(false);
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
    minWidth: 4,
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
    setDeleteID(selectedService.id);
    console.log('daya na click', selectedService);
    setEditServiceData(selectedService);
  };

  const handleDeleteService = () => {
    mutationDeleteService.mutate({ deleteID });
  };
  const queryClient = useQueryClient();

  const mutationDeleteService = useMutation({
    mutationFn: deleteServiceId,
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ['CategoryServiceList'] });
      if (data.message !== 'success') {
        Swal.fire({
          title: 'ERROR!',
          text: JSON.stringify(data),
          icon: 'error',
        });
      }
    },
    onError: (error) => {
      console.error('Error changing status:', error);
      Swal.fire({
        title: 'Error!',
        text: 'Error....',
        icon: 'error',
      });
    },
  });

  const mutationDeleteCategory = useMutation({
    mutationFn: deleteCategory,
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ['CategoryServiceList'] });
      if (data.message !== 'success') {
        Swal.fire({
          title: 'ERROR!',
          text: JSON.stringify(data),
          icon: 'error',
        });
      }
    },
    onError: (error) => {
      console.error('Error changing status:', error);
      Swal.fire({
        title: 'Error!',
        text: 'Error....',
        icon: 'error',
      });
    },
  });

  const handleClose = () => {
    setAnchorEl(null);
  };

  const handleToggleCategory = (categoryId) => {
    setOpenCategories((prevOpenCategory) => ({
      ...prevOpenCategory,
      [categoryId]: !prevOpenCategory[categoryId],
    }));
  };

  const escapeRegExp = (string) => {
    return string.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
  };
  //***********Highlight the service list text/label base on the search query */
  const highlightText = (text, query) => {
    if (!query) {
      return text;
    }
    const escapedQuery = escapeRegExp(query);
    const parts = text.split(new RegExp(`(${escapedQuery})`, 'gi'));
    return parts.map((part, index) =>
      part.toLowerCase() === query.toLowerCase() ? (
        <span key={index} style={{ backgroundColor: 'yellow' }}>
          {part}
        </span>
      ) : (
        part
      )
    );
  };
  //***********show and expand the category if the service list had matched the search query */
  useEffect(() => {
    if (searchQuery === '') {
      setOpenCategories({});
    } else {
      const expandedCategories = {};
      serviceListData.forEach((category) => {
        expandedCategories[category.id] = true;
      });
      setOpenCategories(expandedCategories);
    }
  }, [searchQuery]);

  //***********filter/show category base on the service list that matched the search query */
  const filteredData = () => {
    const filter = serviceListData?.map((category) => ({
      ...category,
      service_list:
        searchQuery === ''
          ? category.service_list
          : category.service_list?.filter((service) => service.service_name.toLowerCase().includes(searchQuery.toLowerCase())),
    }));
    return searchQuery === '' ? filter : filter.filter((category) => category.service_list.length > 0);
  };

  const serviceData = (filteredParamData) => {
    return (
      <List>
        {filteredParamData()?.map((category) => (
          <div key={category.id}>
            <ListItem
              button
              onClick={() => handleToggleCategory(category.id)}
              sx={{ borderBottom: '1px solid #e0e0e0', '&:hover .configureCategory': { opacity: 1 } }}
            >
              <ListItemText primary={highlightText(category.category_name, searchQuery)} />
              <Button
                className="configureCategory"
                sx={{
                  marginRight: '20px',
                  opacity: 0,
                  transition: 'opacity 0.3s',
                  padding: 0,
                  minWidth: 0,
                }}
                onClick={(event) => {
                  setShowEditCategoryModal(true);
                  setCategoryName(category);
                  event.stopPropagation();
                }}
              >
                <EditIcon sx={{ fontSize: '18px' }} />
              </Button>
              <Button
                className="configureCategory"
                sx={{
                  marginRight: '30px',
                  opacity: 0,
                  transition: 'opacity 0.3s',
                  padding: 0,
                  minWidth: 0,
                }}
                onClick={(event) => {
                  event.stopPropagation();
                  Swal.fire({
                    title: 'Are you sure?',
                    text: 'Deleting this category will permanently remove it along with all related services',
                    icon: 'warning',
                    showCancelButton: true,
                    reverseButtons: true, // Add this line to swap the buttons
                    cancelButtonColor: '#C8C8C8',
                    confirmButtonColor: '#d33',
                    confirmButtonText: 'Yes, delete it!',
                  }).then((result) => {
                    if (result.isConfirmed) {
                      const id = category.id;
                      mutationDeleteCategory.mutate({ id });
                      console.log('cat id ', id);
                    }
                  });
                }}
              >
                <DeleteIcon sx={{ fontSize: '18px', color: '#FF5370' }} />
              </Button>

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
                          {highlightText(service.service_name, searchQuery)}
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

  if (isLoading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>Error: {error.message}</div>;
  }

  return (
    <>
      <Header togglePanel={togglePanel} hamburgerClose={sidePanelOPen} />
      <SidePanel isOpen={sidePanelOPen} togglePanel={togglePanel} activeNav={active} />
      <AddService showAddServiceModal={showAddServiceModal} handleCloseModal={handleCloseModal} categoryData={categoryData} />
      <EditService showEditServiceModal={showEditServiceModal} handleCloseModal={handleCloseModal} />
      <AddCategory showAddCategory={showAddCategory} handleCloseModal={handleCloseModal} />
      <EditCategoryName showEditCategoryModal={showEditCategoryModal} handleCloseModal={handleCloseModal} categoryName={categoryName} />

      <div className="seviceSetup">
        <div className="setupContent">
          <div className="row">
            <div className="searchBox">
              <TextField
                label="Search services"
                variant="outlined"
                fullWidth
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
            </div>

            <div className="d-flex align-items-center justify-content-center addCategoryDiv">
              <Button
                onClick={() => setShowAddCategory(true)}
                sx={{ whiteSpace: 'nowrap', fontSize: '16px', textTransform: 'initial' }}
                variant="contained"
                color="primary"
                startIcon={<AddIcon />}
              >
                Add Category
              </Button>
            </div>
            <div className="d-flex align-items-center justify-content-center addCategoryDivMobile">
              <Button
                onClick={() => setShowAddCategory(true)}
                sx={{ whiteSpace: 'nowrap', fontSize: '16px', textTransform: 'initial' }}
                variant="contained"
                color="primary"
                startIcon={<AddIcon />}
              ></Button>
            </div>
          </div>

          {serviceData(filteredData)}
        </div>
      </div>
      <Menu anchorEl={anchorEl} open={Boolean(anchorEl)} onClose={handleClose}>
        <MenuItem
          onClick={() => {
            handleClose();
            if (anchorEl !== true) {
              setShowEditServiceModal(true);
            }
          }}
          sx={{ fontSize: '14px', fontWeight: '300 !important' }}
        >
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
                handleDeleteService();
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
