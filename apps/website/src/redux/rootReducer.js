import { combineReducers } from 'redux';
// import jobReducer from "./slice/jobSlice";
import jobSlice from './slice/jobSlice';
import authSlice from './slice/authSlice';
import userDataSlice from './slice/userdataSlice';
import getAuthUserJobsSlice from './slice/getAuthUserJobsSlice';
import employerProfileData from './slice/employerProfileDataSlice';
import loaderSlice from './slice/loaderSlice';
import fetchAllnotification from './slice/employerNotification';
import saveJobsSlice from './slice/saveJobsSlice';
import blogpagesSlice from './slice/blogpagesSlice';
import allBlogDataSlice from './slice/allBlogDataSlice';
import loginSlice from './slice/loginSlice';
import EmployerLoginSlice from './slice/EmployerLoginSlice';
import employerjobs from './slice/employerjobs';

import SelectedCountrySlice from './slice/SelectedCountrySlice';
const rootReducer = combineReducers({
  loginuser: loginSlice,
  employerLogin: EmployerLoginSlice,
  auth: authSlice,
  userdata: userDataSlice,
  getAuthUserJobs: getAuthUserJobsSlice,
  job: jobSlice,
  employerProfile: employerProfileData,
  loading: loaderSlice,
  Allnotification: fetchAllnotification,
  saveJobs: saveJobsSlice,
  blogpages: blogpagesSlice,
  allblogdata: allBlogDataSlice,
  employerjobs: employerjobs,
  SelectedCountry: SelectedCountrySlice,
});

export default rootReducer;
