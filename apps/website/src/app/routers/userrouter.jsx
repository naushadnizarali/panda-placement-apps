import React from 'react';
import { Route, Routes, useLocation } from 'react-router-dom';
import Navbar from '../component/Navbar/Navbar';
import ScrollToTopButton from '../component/scrollToTop/scrollToTop';
import PageNotFound from '../pages/CommonPages/PageNotFound';
import Register from '../pages/CommonPages/Register/Register';
import Login from '../pages/User/Auth/Login';
import UserHome from '../pages/User/Userhome/UserHome';
import { Private } from './PrivateRouter';
import Footer from '../component/Footer/Footer';
import ResetPassword from '../pages/User/Resetpassword/Resetpassword';

function Userrouter() {
  const location = useLocation();

  return (
    <>
      {!location.pathname.startsWith('/user/login') &&
        !location.pathname.startsWith('/user/register') &&
        !location.pathname.startsWith('/user/Forgot-password') &&
        !location.pathname.startsWith('/user/Reset-password/') && (
          <>
            <Navbar />
            <ScrollToTopButton />
          </>
        )}
      <Routes>
        <Route path="/Reset-password/:id/:token/" element={<ResetPassword />} />
        <Route path="/login" element={<Login title="Candidate Login" user />} />
        <Route path="/register" element={<Register user />} />
        <Route element={<Private />}>
          <Route path="/home" element={<UserHome />} />
          <Route path="*" element={<PageNotFound />} />
        </Route>
        <Route path="*" element={<PageNotFound />} />
      </Routes>
      {!location.pathname.startsWith('/user/login') &&
        !location.pathname.startsWith('/user/register') &&
        !location.pathname.startsWith('/user/Forgot-password') &&
        !location.pathname.startsWith('/user/Reset-password/') && (
          <>
            <Footer />
          </>
        )}
    </>
  );
}

export default Userrouter;
