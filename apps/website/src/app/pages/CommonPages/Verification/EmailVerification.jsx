// EmailVerification.jsx

import React, { useEffect } from 'react';
import styles from './EmailVerification.module.css';
import { useLocation, useNavigate } from 'react-router-dom';
import EmployerAPIS from '../../../Apis/EmployerApi';
import Toast from '../../../component/Toast/Toast';
import TimerPage from '../TimerPage/TimerPage';
import { DynamicTitle } from '../../../Helpers/DynamicTitle';

function EmailVerification() {
  const location = useLocation();
  const employerapi = EmployerAPIS();
  const navigate = useNavigate();
  const path = location.pathname.slice(10);

  useEffect(() => {
    const verificationEmail = async () => {
      try {
        const response = await employerapi.employerEmailVerification(path);
        Toast.success('Account Verification Complete');
        setTimeout(() => {
          if (response.redirect_url === '/employer/login') {
            navigate('/employer/login');
          } else if (response.redirect_url === '/user/login') {
            navigate('/user/login');
          }
        }, 2000);
      } catch (error) {
        console.error(error);
        Toast.error('Token Expire');
      }
    };
    verificationEmail();
  }, [path]);

  useEffect(() => {
    DynamicTitle('EmailVerification-PandaPlacement');
  }, []);

  return (
    <div className={styles.emailVerificationContainer}>
      <div className={styles.emailVerification}>
        <h1>Your PandaPlacement Account Verification Completed</h1>
        <p>
          Thank you for verifying your email address. Your account is now
          activated.
        </p>
        <p>Please Wait....</p>
      </div>
    </div>
  );
}

export default EmailVerification;
