import React from 'react';
import {
  Box,
  Avatar,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Typography,
  LinearProgress,
  IconButton,
} from '@mui/material';
import EditIcon from '@mui/icons-material/Edit';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';

const createData = (name, email, quota, phone, createdAt, status) => {
  return { name, email, quota, phone, createdAt, status };
};

const rows = [
  createData('Fran Perez', 'fran.perez@domain.com', 50, '(815) 704-0045', 'Jul 4, 2024 12:06 AM', 'Active'),
  createData('Penjani Inyene', 'penjani.inyene@domain.com', 100, '(803) 937-8925', 'Jul 3, 2024 10:06 PM', 'Active'),
];

const UserTable = () => {
  return (
    <TableContainer component={Paper}>
      <Table aria-label="user table">
        <TableHead>
          <TableRow>
            <TableCell padding="checkbox" />
            <TableCell>Name</TableCell>
            <TableCell>Quota</TableCell>
            <TableCell>Phone number</TableCell>
            <TableCell>Created at</TableCell>
            <TableCell>Status</TableCell>
            <TableCell align="right">Actions</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {rows.map((row, index) => (
            <TableRow key={index}>
              <TableCell padding="checkbox" />
              <TableCell>
                <Box display="flex" alignItems="center">
                  <Avatar alt={row.name} src="" />
                  <Box ml={2}>
                    <Typography variant="body1">{row.name}</Typography>
                    <Typography variant="body2" color="textSecondary">
                      {row.email}
                    </Typography>
                  </Box>
                </Box>
              </TableCell>
              <TableCell>
                <Box display="flex" alignItems="center">
                  <LinearProgress variant="determinate" value={row.quota} style={{ width: '100px', marginRight: '8px' }} />
                  <Typography variant="body2" color="textSecondary">{`${row.quota}%`}</Typography>
                </Box>
              </TableCell>
              <TableCell>{row.phone}</TableCell>
              <TableCell>{row.createdAt}</TableCell>
              <TableCell>
                <Box display="flex" alignItems="center">
                  <CheckCircleIcon style={{ color: 'green', marginRight: '8px' }} />
                  <Typography variant="body2">{row.status}</Typography>
                </Box>
              </TableCell>
              <TableCell align="right">
                <IconButton>
                  <EditIcon />
                </IconButton>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  );
};

export default UserTable;
