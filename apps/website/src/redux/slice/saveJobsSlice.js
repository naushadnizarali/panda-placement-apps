import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  data: null,
};

const saveJobs = createSlice({
  name: 'saveJobs',
  initialState,
  reducers: {
    addSaveJobs: (state, action) => {
      state.loading = false;
      state.data = action.payload;
    },
    removeSaveJobs: (state, action) => {
      const id = action.payload;
      state.data = state.data.filter((item) => item.id !== id);
    },
  },
});

export const { addSaveJobs, logoutUser, removeSaveJobs } = saveJobs.actions;

export default saveJobs.reducer;
