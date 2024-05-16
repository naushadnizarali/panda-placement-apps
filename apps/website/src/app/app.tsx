// eslint-disable-next-line @typescript-eslint/no-unused-vars
import styles from './app.module.scss';
import React, { lazy, Suspense } from 'react';
import { Route, BrowserRouter as Router, Routes } from 'react-router-dom';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

// import NxWelcome from './nx-welcome';

import CheakInternet from './component/CheakInternet/CheakInternet';
import Footer from './component/Footer/Footer';
import Navbar from './component/Navbar/Navbar';
import ScrollToTopButton from './component/scrollToTop/scrollToTop';
import HomeSkeleton from './component/Skeleton/HomeSkeleton';
import BlogPage from './pages/User/BlogPage/BlogPage';
import BlogPages from './component/BlogPages/BlogPages';
import UserDesc from './pages/CommonPages/UserDesc/UserDesc';
import CvManager from './pages/User/CvManager/CvManager';
import { Private } from './routers/PrivateRouter';
import Hprofile from './pages/User/Hprofile/hprofile';
import MyJobs from './pages/User/MyJobs/MyJobs';
import BookmarkJobs from './pages/User/BookmarkJobs/BookmarkJobs';
import ProfilePreview from './pages/User/ProfilePreview/ProfilePreview';
import ChangePassword from './pages/User/ChangePassword/ChangePassword';
import ForgotPassword from './pages/User/Forrgotpassword/ForgotPasword';
// import ResetPassword from './pages/User/Resetpassword/Resetpassword';
import ApplicationDetail from './component/ApplicationDetail/ApplicationDetail';
const Contactus = lazy(() => import('./pages/CommonPages/Contactus/Contactus'));
const EmailVerification = lazy(
  () => import('./pages/CommonPages/Verification/EmailVerification')
);
const FindJobs = lazy(() => import('./pages/User/FindJobs/FindJobs'));
const JobDetails = lazy(() => import('./pages/User/JobDetails/JobDetails'));
const PageNotFound = lazy(() => import('./pages/CommonPages/PageNotFound'));
const LazyHome = lazy(() => import('./pages/CommonPages/Home'));
const LazyUserrouter = lazy(() => import('./routers/userrouter'));
const LazyAdminrouter = lazy(() => import('./routers/adminrouter'));
const LazyEmployerrouter = lazy(() => import('./routers/employerrouter'));

const Layout = ({ children }) => (
  <>
    <Navbar />
    <ScrollToTopButton />
    <Suspense fallback={<HomeSkeleton />}>{children}</Suspense>
    <Footer />
  </>
);

// export function App() {
//   return (
//     <div>
//       <NxWelcome title="website" />
//     </div>
//   );
// }

export function App() {
  return (
    <CheakInternet>
      <Router>
        <ToastContainer />
        <Routes>
          <Route
            path="/"
            element={
              <Layout>
                <LazyHome />
              </Layout>
            }
          />
          <Route
            path="/findjobs"
            element={
              <Layout>
                <FindJobs />
              </Layout>
            }
          />
          <Route
            path="/blogs"
            element={
              <Layout>
                <BlogPage />
              </Layout>
            }
          />
          <Route
            path="/blogs/:blogtitle"
            element={
              <Layout>
                <BlogPages />
              </Layout>
            }
          />
          <Route
            path="/job/:jobtitle"
            element={
              <Layout>
                <JobDetails />
              </Layout>
            }
          />
          <Route
            path="/myapplication/:id/:title"
            element={
              <Layout>
                <ApplicationDetail />
              </Layout>
            }
          />
          <Route
            path="/contactus"
            element={
              <Layout>
                <Contactus />
              </Layout>
            }
          />
          <Route
            path="/userdesc"
            element={
              <Layout>
                <UserDesc />
              </Layout>
            }
          />
          <Route
            path="/register/acount_activation/:id/:token/"
            element={
              <Suspense fallback={<HomeSkeleton />}>
                <EmailVerification isuserScreen />
              </Suspense>
            }
          />
          <Route path="/Forgot-password" element={<ForgotPassword />} />
          {/* <Route
              path="/Reset-password/:id/:token/"
              element={<ResetPassword />}
            /> */}
          {/* Protected Routes For User  */}
          <Route element={<Private />}>
            <Route
              path="/profile-preview"
              element={
                <Layout>
                  <ProfilePreview />
                </Layout>
              }
            />
            <Route
              path="/myjobs"
              element={
                <Layout>
                  <MyJobs />
                </Layout>
              }
            />
            <Route
              path="/bookmarks"
              element={
                <Layout>
                  <BookmarkJobs />
                </Layout>
              }
            />
            <Route
              path="/profile"
              element={
                <Layout>
                  <Hprofile />
                </Layout>
              }
            />
            <Route
              path="/cvmanager"
              element={
                <Layout>
                  <CvManager />
                </Layout>
              }
            />
            <Route
              path="/change-password"
              element={
                <Layout>
                  <ChangePassword />
                </Layout>
              }
            />
          </Route>

          <Route
            path="/"
            element={
              <Suspense fallback={<HomeSkeleton />}>
                <LazyUserrouter />
              </Suspense>
            }
          />
          <Route
            path="/user/*"
            element={
              <Suspense fallback={<HomeSkeleton />}>
                <LazyUserrouter />
              </Suspense>
            }
          />
          <Route
            path="/employer/*"
            element={
              <Suspense fallback={<HomeSkeleton />}>
                <LazyEmployerrouter />
              </Suspense>
            }
          />
          <Route
            path="/manager/*"
            element={
              <Suspense fallback={<HomeSkeleton />}>
                <LazyAdminrouter />
              </Suspense>
            }
          />
          <Route
            path="*"
            element={
              <Layout>
                <PageNotFound />
              </Layout>
            }
          />
        </Routes>
      </Router>
    </CheakInternet>
  );
}

export default App;
