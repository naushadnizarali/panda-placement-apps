import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  eventData: null,
};

const blogpagesSlice = createSlice({
  name: 'events',
  initialState,
  reducers: {
    setBlogData(state, action) {
      state.eventData = action.payload;
    },
  },
});

export const { setBlogData } = blogpagesSlice.actions;

export default blogpagesSlice.reducer;
