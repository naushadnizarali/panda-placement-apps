import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  Country: null,
};

const SelectedCountrySlice = createSlice({
  name: 'SelectedCountry',
  initialState,
  reducers: {
    setCountryData(state, action) {
      state.Country = action.payload;
    },
    removeCountryData: (state) => {
      state.Country = null;
    },
  },
});

export const { setCountryData, removeCountryData } =
  SelectedCountrySlice.actions;

export default SelectedCountrySlice.reducer;
