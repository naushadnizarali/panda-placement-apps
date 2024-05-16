import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  data: null,
};

const getAuthUserJobs = createSlice({
  name: 'getAuthUserJobs',
  initialState,
  reducers: {
    fetchDataSuccess: (state, action) => {
      state.loading = false;
      state.data = action.payload;
    },
    logoutUser: (state) => {
      state.data = null;
    },
  },
});

export const { fetchDataSuccess, logoutUser } = getAuthUserJobs.actions;

export default getAuthUserJobs.reducer;
