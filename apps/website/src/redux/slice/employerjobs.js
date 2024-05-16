import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  data: null,
};

const employerJobs = createSlice({
  name: 'employerJobs',
  initialState,
  reducers: {
    alljobs: (state, action) => {
      state.data = action.payload;
    },
  },
});

export const { alljobs } = employerJobs.actions;

export default employerJobs.reducer;

//Status
//Title
//Data
