import { BOOKING_LIST, SELECT_BRANCH } from '../r-actions/actions';

const initialState = {
  bookingList: [],
  selectedBranchR: '',
};

const bookingReducer = (state = initialState, action) => {
  switch (action.type) {
    case BOOKING_LIST:
      return {
        ...state,
        bookingList: action.payload,
      };
    case SELECT_BRANCH:
      return {
        ...state,
        selectedBranchR: action.payload,
      };
    default:
      return state;
  }
};

export default bookingReducer;
