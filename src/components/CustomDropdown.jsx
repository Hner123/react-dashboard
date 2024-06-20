import React, { useContext, useEffect, useState } from 'react';
import Form from 'react-bootstrap/Form';
import MyContext from '../MyContext';
import { useDispatch, useSelector } from 'react-redux';
import { setBookingList, setSelectBranch } from '../r-actions/actions';

const CustomDropdown = () => {
  const dispatch = useDispatch();
  const { branchList } = useContext(MyContext);
  const bookingList = useSelector((state) => state.booking.bookingList);
  const selectedBranchView = useSelector((state) => state.booking.selectedBranchR);

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

  const handleChangeBranch = (selectedBranchParam) => {
    console.log(selectedBranchParam);
    dispatch(dispatch(setSelectBranch(selectedBranchParam)));
  };

  return (
    <>
      <Form.Select aria-label="Default select example" defaultValue={selectedBranchView} onChange={(event) => handleChangeBranch(event.target.value)}>
        {branchList?.map((list, index) => (
          <option key={index} value={list.branchName}>
            {list.branchName}
          </option>
        ))}
      </Form.Select>
    </>
  );
};

export default CustomDropdown;
