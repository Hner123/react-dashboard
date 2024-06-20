import { configureStore } from '@reduxjs/toolkit';
import bookingReducer from '../r-reducer/reducer';

const store = configureStore({
  reducer: {
    booking: bookingReducer,
  },
});

export default store;

// ***********************SAMPLE ******************************
// import { useDispatch, useSelector } from 'react-redux';
// import { setBookingList } from '../r-actions/actions';
// const dispatch = useDispatch();
//  dispatch(dispatch(setBookingList(events)));

// **********************************************************
// const bookingR = useSelector((state) => state.booking.bookingList);
