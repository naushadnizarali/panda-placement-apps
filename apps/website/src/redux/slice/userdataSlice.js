import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  data: null,
};

const userDataSlice = createSlice({
  name: 'userdata',
  initialState,
  reducers: {
    fetchUserData: (state, action) => {
      state.data = action.payload;
    },
    logoutUser: (state) => {
      state.data = null;
    },
    removeDataProperty: (state, action) => {
      const propertyName = action.payload;
      delete state.data[propertyName];
    },
  },
});

export const { fetchUserData, logoutUser, removeDataProperty } =
  userDataSlice.actions;

export default userDataSlice.reducer;
