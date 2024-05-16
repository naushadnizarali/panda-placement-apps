import { createSlice } from '@reduxjs/toolkit';

const jobSlice = createSlice({
  name: 'job',
  initialState: {
    bookmarkedJobs: [],
  },
  reducers: {
    bookmarkJob: (state, action) => {
      const jobId = action.payload;
      if (!state.bookmarkedJobs.includes(jobId)) {
        state.bookmarkedJobs.push(jobId);
      }
    },
    removebookmarkJob: (state, action) => {
      const jobIdToRemove = action.payload;
      state.bookmarkedJobs = state.bookmarkedJobs.filter(
        (jobId) => jobId !== jobIdToRemove,
      );
    },
  },
});

export const { bookmarkJob, removebookmarkJob } = jobSlice.actions;
export default jobSlice.reducer;
