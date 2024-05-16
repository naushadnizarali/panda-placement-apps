import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  isAuthenticated: false,
  token: null,
};

const loginuser = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    saveToken: (state, action) => {
      state.isAuthenticated = true; //User Login
      state.token = action.payload;
    },
    logoutUser: (state) => {
      state.isAuthenticated = false;
      state.token = null;
    },
  },
});

export const { saveToken, logoutUser } = loginuser.actions;

export default loginuser.reducer;

// const isAuthenticated = useSelector(
//   (state) => state.loginuser.isAuthenticated
// );
