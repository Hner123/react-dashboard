import React, { useContext, useEffect, useState } from 'react';
import Form from 'react-bootstrap/Form';
import MyContext from '../MyContext';
import { useDispatch, useSelector } from 'react-redux';
import { setBookingList, setSelectBranch } from '../r-actions/actions';
import Dropdown from 'react-bootstrap/Dropdown';
import { Public as PublicIcon } from '@mui/icons-material';
import '../style/customDropdown.css';

const CustomDropdown = () => {
  const dispatch = useDispatch();
  const { branchList } = useContext(MyContext);
  const bookingList = useSelector((state) => state.booking.bookingList);
  const selectedBranchView = useSelector((state) => state.booking.selectedBranchR);
  const [selectedValue, setSelectedValue] = useState('');

  // const compareBranch = (param) => {
  //   for (let i = 0; i < branchList.length; i++) {
  //     if (param === branchList[i].branchName) {
  //       console.log('true ito ', bookingList[i][param]);
  //     }
  //   }
  // };
  // const compareBranch = (param) => {
  //   const filteredList = bookingList?.find((booking) => booking[param]);
  //   console.log(filteredList ? filteredList[param] : 'No bookings for this branch');
  //   dispatch(dispatch(setSelectBranch(filteredList[param])));
  // };

  useEffect(() => {
    if (selectedBranchView == '') {
      const defaultBranch = branchList[0].branchName;
      dispatch(dispatch(setSelectBranch(defaultBranch)));
      setSelectedValue(defaultBranch);
    }
  }, []);

  const handleChangeBranch = (selectedBranchParam) => {
    console.log(selectedBranchParam);
    dispatch(dispatch(setSelectBranch(selectedBranchParam)));
  };

  return (
    <>
      <Form.Select
        className="locationSelect"
        aria-label="Default select example"
        defaultValue={selectedBranchView}
        onChange={(event) => handleChangeBranch(event.target.value)}
      >
        {branchList?.map((list, index) => (
          <option key={index} value={list.branchName}>
            {list.branchName}
          </option>
        ))}
      </Form.Select>

      <div style={{ display: 'flex', flexWrap: 'wrap', gap: '20px' }}></div>

      <Dropdown className="dropDownLocation" size="sm">
        <Dropdown.Toggle variant="secondary" id="dropdown-basic">
          <PublicIcon fontSize="20px" />
        </Dropdown.Toggle>

        <Dropdown.Menu>
          {branchList?.map((list, index) => (
            <Dropdown.Item
              className={selectedValue === list.branchName ? 'selected' : ''}
              key={index}
              onClick={() => {
                handleChangeBranch(list.branchName);
                setSelectedValue(list.branchName);
              }}
            >
              {list.branchName}
            </Dropdown.Item>
          ))}
        </Dropdown.Menu>
      </Dropdown>
    </>
  );
};

export default CustomDropdown;
