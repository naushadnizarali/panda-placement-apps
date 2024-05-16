import React, { useState } from 'react';
import { Route, Routes, useLocation } from 'react-router-dom';
import Employernavbar from '../component/Sidebar/Side';
import AdminHome from '../pages/Admin/AdminHome/AdminHome';
import AdminMenuItems from '../pages/Admin/AdminSidebarMenu/SidebarItems';
import Alljobs from '../pages/Admin/AllJobs/Alljobs';
import PostNewJob from '../pages/Admin/PostANewjob/PostNewJob';
import Seekers from '../pages/Admin/Seekers/Seekers';
import ViewJob from '../pages/Admin/ViewJob/ViewJob';
import Login from '../pages/Admin/login/Login';
import ScreenWrapper from '../pages/Employer/ScreenWrapper/ScreenWrapper';
import { AdminPrivateRoute } from './PrivateRouter';

function Adminrouter() {
  const location = useLocation();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const toggleSidebar = () => {
    setSidebarOpen(!sidebarOpen);
  };

  return (
    <div>
      {!location.pathname.startsWith('/manager/login') && (
        <Employernavbar
          menuItems={AdminMenuItems}
          toggleSidebar={toggleSidebar}
          sidebarOpen={sidebarOpen}
        />
      )}
      <Routes>
        <Route element={<AdminPrivateRoute />}>
          <Route path="/login" element={<Login />} />
          <Route
            path="/manager-home"
            element={
              <ScreenWrapper sidebarOpen={sidebarOpen}>
                <AdminHome />
              </ScreenWrapper>
            }
          />
          <Route
            path="/all_jobs"
            element={
              <ScreenWrapper sidebarOpen={sidebarOpen}>
                <Alljobs />
              </ScreenWrapper>
            }
          />
          <Route
            path="/post-job"
            element={
              <ScreenWrapper sidebarOpen={sidebarOpen}>
                <PostNewJob />
              </ScreenWrapper>
            }
          />
          <Route
            path="/:id/:JobName/view"
            element={
              <ScreenWrapper sidebarOpen={sidebarOpen}>
                <ViewJob />
              </ScreenWrapper>
            }
          />
          <Route
            path="/:id/:JobName/edit"
            element={
              <ScreenWrapper sidebarOpen={sidebarOpen}>
                <PostNewJob />
              </ScreenWrapper>
            }
          />
          <Route
            path="/seekers"
            element={
              <ScreenWrapper sidebarOpen={sidebarOpen}>
                <Seekers />
              </ScreenWrapper>
            }
          />
        </Route>
      </Routes>
    </div>
  );
}

export default Adminrouter;
