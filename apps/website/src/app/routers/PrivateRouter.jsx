import React from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';

export function Private() {
  const auth = useSelector((state) => state.loginuser.isAuthenticated);
  return auth ? <Outlet /> : <Navigate to="/" />;
}
export function EmployerPrivateRoute() {
  const dispatch = useDispatch();
  // const token = useSelector((state) => state.employerLogin.token);
  const empauth = useSelector((state) => state.employerLogin.isAuthenticated);

  // useEffect(() => {
  //   const checkToken = async () => {
  //     try {
  //       await axios.post(`${LOCAL_URL_USER}token/verify/`, {
  //         token: token,
  //       });
  //     } catch (error) {
  //       console.error(error);
  //       dispatch(logoutEmployer()); // Dispatch logout action if token verification fails
  //     }
  //   };
  //   if (token) {
  //     checkToken();
  //   } else {
  //     dispatch(logoutEmployer());
  //   }
  // }, [dispatch, token]);

  return empauth ? <Outlet /> : <Navigate to="/employer/login" />;
}
export function AdminPrivateRoute() {
  const adminAuth = localStorage.getItem('admin_token');
  return adminAuth ? <Outlet /> : <Navigate to="/" />;
}

// export default Private;
