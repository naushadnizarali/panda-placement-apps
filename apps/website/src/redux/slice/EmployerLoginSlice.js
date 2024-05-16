import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  isAuthenticated: false,
  token: null,
};

const employerLogin = createSlice({
  name: 'employerauth',
  initialState,
  reducers: {
    saveEmployerToken: (state, action) => {
      state.isAuthenticated = true; //User Login
      state.token = action.payload;
    },
    logoutEmployer: (state) => {
      state.isAuthenticated = false;
      state.token = null;
    },
  },
});

export const { saveEmployerToken, logoutEmployer } = employerLogin.actions;

export default employerLogin.reducer;

// const isAuthenticated = useSelector(
//   (state) => state.loginuser.isAuthenticated
// );
