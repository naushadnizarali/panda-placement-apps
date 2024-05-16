import React from 'react';
import { Route, Routes, useLocation } from 'react-router-dom';
import Register from '../pages/CommonPages/Register/Register';
import EmployerHome from '../pages/Employer/EmployerDashboard/EmployerHome';
import { useState } from 'react';
import Employernavbar from '../component/Sidebar/Side';
import PostAjob from '../pages/Employer/Postjob/PostaJob';
import Jobs from '../pages/Employer/Jobs/Jobs';
import HireExpert from '../pages/Employer/HireExpert';
import Candidates from '../pages/Employer/Candidates/Candidates';
import SearchResumes from '../pages/Employer/SearchResume/SearchResumes';
import Review from '../pages/Employer/Review/Review';
import Help from '../pages/Employer/Help/Help';
import Contact from '../pages/Employer/ContactUs/Contact';
import { EmployerPrivateRoute } from './PrivateRouter';
import ChangePassword from '../pages/Employer/ChangePassword/ChangePassword';
import Profile from '../pages/Employer/EmployerProfile/Profile';
import PageNotFound from '../pages/CommonPages/PageNotFound';
import ForgotPassword from '../pages/User/Forrgotpassword/ForgotPasword';
import ResetPassword from '../pages/User/Resetpassword/Resetpassword';
import EmployerJobDeails from '../pages/Employer/EmployerJobDeails/EmployerJobDeails';
import OneJobCandidates from '../pages/Employer/SingleJobCandidates/OneJobCandidates';
import EmployerMenuItems from '../pages/Employer/EmployerSideBarMenu/EmployerSideItem';
import Login from '../pages/User/Auth/Login';
import EmailVerification from '../pages/CommonPages/Verification/EmailVerification';
import CandidateProfile from '../pages/Employer/CandidateProfile/CandidateProfile';
import ScreenWrapper from '../pages/Employer/ScreenWrapper/ScreenWrapper';
import EmployerNavbar from '../component/EmployerNavbar/EmployerNavbar';

function Employerrouter() {
  const location = useLocation();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const toggleSidebar = () => {
    setSidebarOpen(!sidebarOpen);
  };

  return (
    <div>
      {!location.pathname.startsWith('/employer/login') &&
        !location.pathname.startsWith('/employer/register') &&
        !location.pathname.startsWith('/employer/Forgot-password') &&
        !location.pathname.startsWith('/employer/acount_activation/') &&
        !location.pathname.startsWith('/employer/Reset-password/') && (
          <>
            {/* This is Navbar on the Top of the Screen  */}
            <EmployerNavbar />
            <Employernavbar // This is Side bar
              toggleSidebar={toggleSidebar}
              menuItems={EmployerMenuItems}
              sidebarOpen={sidebarOpen}
            />
          </>
        )}
      <Routes>
        <Route
          path="/post-job"
          element={
            <ScreenWrapper sidebarOpen={sidebarOpen}>
              <PostAjob />
            </ScreenWrapper>
          }
        />
        <Route
          path="/login"
          element={<Login title="Employer login" employer />}
        />
        <Route path="/register" element={<Register employer />} />
        <Route path="/Forgot-password" element={<ForgotPassword />} />
        <Route path="/Reset-password/:id/:token/" element={<ResetPassword />} />

        <Route
          path="/acount_activation/:id/:token/"
          element={<EmailVerification />}
        />

        <Route element={<EmployerPrivateRoute />}>
          <Route
            path="/home"
            element={
              <ScreenWrapper sidebarOpen={sidebarOpen}>
                <EmployerHome />
              </ScreenWrapper>
            }
          />
          <Route
            path="/job/edit/:id/:jobtitle"
            element={
              <ScreenWrapper sidebarOpen={sidebarOpen}>
                <PostAjob />
              </ScreenWrapper>
            }
          />
          <Route
            path="/jobs"
            element={
              <ScreenWrapper sidebarOpen={sidebarOpen}>
                <Jobs isModal={false} />
              </ScreenWrapper>
            }
          />
          <Route
            path="/job/all_candidates/:jobTitle"
            element={
              <ScreenWrapper sidebarOpen={sidebarOpen}>
                <OneJobCandidates />
              </ScreenWrapper>
            }
          />
          <Route
            path="/candidates"
            element={
              <ScreenWrapper sidebarOpen={sidebarOpen}>
                <Candidates isModal={false} />
              </ScreenWrapper>
            }
          />
          <Route
            path="/candidateProfile/:candidatename"
            element={
              <ScreenWrapper sidebarOpen={sidebarOpen}>
                <CandidateProfile />
              </ScreenWrapper>
            }
          />
          <Route
            path="/job/:jobName"
            element={
              <ScreenWrapper sidebarOpen={sidebarOpen}>
                <EmployerJobDeails />
              </ScreenWrapper>
            }
          />
          <Route
            path="/search-resumes"
            element={
              <ScreenWrapper sidebarOpen={sidebarOpen}>
                <SearchResumes />
              </ScreenWrapper>
            }
          />
          <Route
            path="/review"
            element={
              <ScreenWrapper sidebarOpen={sidebarOpen}>
                <Review />
              </ScreenWrapper>
            }
          />
          <Route
            path="/help"
            element={
              <ScreenWrapper sidebarOpen={sidebarOpen}>
                <Help />
              </ScreenWrapper>
            }
          />
          <Route
            path="/hire-expert"
            element={
              <ScreenWrapper sidebarOpen={sidebarOpen}>
                <HireExpert />
              </ScreenWrapper>
            }
          />
          <Route
            path="/contact-us"
            element={
              <ScreenWrapper sidebarOpen={sidebarOpen}>
                <Contact />
              </ScreenWrapper>
            }
          />
          <Route
            path="/profile"
            element={
              <ScreenWrapper sidebarOpen={sidebarOpen}>
                <Profile />
              </ScreenWrapper>
            }
          />
          <Route
            path="/change-password"
            element={
              <ScreenWrapper sidebarOpen={sidebarOpen}>
                <ChangePassword />
              </ScreenWrapper>
            }
          />
        </Route>
        <Route
          path="*"
          element={
            <ScreenWrapper sidebarOpen={sidebarOpen}>
              <PageNotFound isemployer />
            </ScreenWrapper>
          }
        />
      </Routes>
    </div>
  );
}

export default Employerrouter;
