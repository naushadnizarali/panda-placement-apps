import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  data: null,
};

const employerProfileData = createSlice({
  name: 'employerProfileData',
  initialState,
  reducers: {
    fetchEmployerData: (state, action) => {
      state.data = action.payload; //Data agya Hamara Pass
    },
    removeEmployerDataProperty: (state, action) => {
      const propertyName = action.payload;
      delete state.data[propertyName];
    },
  },
});

export const { fetchEmployerData, removeEmployerDataProperty } =
  employerProfileData.actions;

export default employerProfileData.reducer;
