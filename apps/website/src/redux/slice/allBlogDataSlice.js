import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  allData: [],
};

const allBlogDataSlice = createSlice({
  name: 'AllBlogData',
  initialState,
  reducers: {
    setAllBlogData(state, action) {
      state.allData = action.payload;
    },
  },
});

export const { setAllBlogData } = allBlogDataSlice.actions;

export default allBlogDataSlice.reducer;
