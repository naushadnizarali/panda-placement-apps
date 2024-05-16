import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  data: null,
};

const employerNotification = createSlice({
  name: 'employerNotification',
  initialState,
  reducers: {
    fetchAllnotification: (state, action) => {
      state.data = action.payload; //Data agya Hamara Pass
    },
  },
});

export const { fetchAllnotification } = employerNotification.actions;

export default employerNotification.reducer;
