import React, { useState, useEffect } from 'react';
import { IconButton, Menu, MenuItem, List, ListItem, ListItemText, ListItemSecondaryAction, TextField, Collapse, ListItemIcon } from '@mui/material';
import MoreVertIcon from '@mui/icons-material/MoreVert';
import ExpandLess from '@mui/icons-material/ExpandLess';
import ExpandMore from '@mui/icons-material/ExpandMore';
import { styled } from '@mui/system';

// Predefined set of colors
const colors = ['#2ED8B6', '#4099FF', '#FFB64D', '#FF5370', '#B0B0B0'];

const ColorFlare = styled('div')(({ color }) => ({
  width: 4,
  height: '100%', // Explicit height of 50px
  backgroundColor: color, // Use the color prop
  marginRight: 16, // Use static value for margin-right
}));

const ServiceList = () => {
  const [anchorEl, setAnchorEl] = useState(null);
  const [selectedService, setSelectedService] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [openCategories, setOpenCategories] = useState({});
  const [categoryColors, setCategoryColors] = useState({});

  useEffect(() => {
    // Initialize category colors when component mounts
    const colorsMap = {};
    data.forEach((category, index) => {
      colorsMap[category.id] = colors[index % colors.length];
      console.log('anu to ', colors[index % colors.length]);
    });
    setCategoryColors(colorsMap);
  }, []);

  const handleClick = (event, service) => {
    setAnchorEl(event.currentTarget);
    setSelectedService(service);
  };

  const handleClose = () => {
    setAnchorEl(null);
    setSelectedService(null);
  };

  const handleToggleCategory = (categoryId) => {
    setOpenCategories((prevOpenCategories) => ({
      ...prevOpenCategories,
      [categoryId]: !prevOpenCategories[categoryId],
    }));
  };

  const data = [
    {
      id: 1,
      category_name: 'Xray',
      service_list: [
        { id: 5, service_name: 'Periapical', service_duration: '10 mins' },
        { id: 6, service_name: 'Panoramic Xray', service_duration: '5 mins' },
        { id: 30, service_name: 'test', service_duration: '55 mins' },
        { id: 31, service_name: 'yawa', service_duration: '5 mins' },
        { id: 32, service_name: 'tao gane', service_duration: '45 mins' },
        { id: 33, service_name: 'tryKO', service_duration: '5 hrs' },
      ],
    },
    {
      id: 2,
      category_name: 'General Dentistry',
      service_list: [
        { id: 7, service_name: 'Consultation (Check Up)', service_duration: '20 mins' },
        { id: 8, service_name: 'Oral Prophylaxis (Cleaning)', service_duration: '30 mins' },
        { id: 9, service_name: 'Perio Treatment', service_duration: '30 mins' },
        { id: 10, service_name: 'Restoration (Pasta)', service_duration: '30 mins' },
        { id: 11, service_name: 'Tooth Extraction (Exo)', service_duration: '30 mins' },
        { id: 12, service_name: 'Odontectomy (Wisdom Tooth Removal)', service_duration: '2 hr' },
        { id: 13, service_name: 'Gingivectomy', service_duration: '1 hr' },
        { id: 14, service_name: 'Frenectomy', service_duration: '1 hr' },
        { id: 15, service_name: 'Root Canal Treatment', service_duration: '1 hr' },
        { id: 16, service_name: 'Tooth Sealant', service_duration: '30 mins' },
        { id: 17, service_name: 'Temporary Filling', service_duration: '30 mins' },
      ],
    },
    {
      id: 3,
      category_name: 'Aesthetic',
      service_list: [
        { id: 18, service_name: 'Veneers', service_duration: '1 hr' },
        { id: 19, service_name: 'Whitening', service_duration: '1 hr' },
      ],
    },
    {
      id: 4,
      category_name: 'Prosthodontics',
      service_list: [
        { id: 20, service_name: 'Removable Partial Denture (Pustiso)', service_duration: '1 hr' },
        { id: 21, service_name: 'Fixed Partial Denture (Bridge)', service_duration: '1 hr' },
        { id: 22, service_name: 'Complete Denture', service_duration: '1 hr' },
      ],
    },
    {
      id: 5,
      category_name: 'Orthodontics (Braces Package)',
      service_list: [
        { id: 23, service_name: 'Removals', service_duration: '40 mins' },
        { id: 24, service_name: 'Sapphire braces installation', service_duration: '1 hr' },
        { id: 25, service_name: 'Orthodontic follow up', service_duration: '15 mins' },
        { id: 26, service_name: 'Braces Adjustment', service_duration: '20 mins' },
        { id: 27, service_name: 'Braces Installation (Metal) Upper and Lower', service_duration: '45 mins' },
        { id: 28, service_name: 'Braces Installation (Metal) Upper or Lower', service_duration: '40 mins' },
        { id: 29, service_name: 'Braces Installation (Ceramic)', service_duration: '1 hr' },
      ],
    },
  ];

  const filteredData = data
    .map((category) => ({
      ...category,
      service_list: category.service_list.filter((service) => service.service_name.toLowerCase().includes(searchQuery.toLowerCase())),
    }))
    .filter((category) => category.service_list.length > 0);

  return (
    <div>
      <TextField
        label="Search services"
        variant="outlined"
        fullWidth
        margin="normal"
        value={searchQuery}
        onChange={(e) => setSearchQuery(e.target.value)}
      />
      <List>
        {filteredData.map((category) => (
          <div key={category.id}>
            <ListItem button onClick={() => handleToggleCategory(category.id)}>
              <ListItemText primary={category.category_name} />
              {openCategories[category.id] ? <ExpandLess /> : <ExpandMore />}
            </ListItem>
            <Collapse in={openCategories[category.id]} timeout="auto" unmountOnExit>
              <List component="div" disablePadding>
                {category.service_list.map((service) => (
                  <ListItem key={service.id} sx={{ pl: 4 }}>
                    <ColorFlare color={categoryColors[category.id]} />

                    <ListItemText primary={service.service_name} secondary={`Duration: ${service.service_duration}`} />
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
      <Menu anchorEl={anchorEl} open={Boolean(anchorEl)} onClose={handleClose}>
        <MenuItem onClick={handleClose}>Copy service ID</MenuItem>
        <MenuItem onClick={handleClose}>View service details</MenuItem>
      </Menu>
    </div>
  );
};

export default ServiceList;
