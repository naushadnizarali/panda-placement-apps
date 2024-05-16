import React, { useEffect } from 'react';
import { ResumeInput } from '../../../component/Input/TextInput';
import CustomButton from '../../../component/Button/CustomButton';
import styles from '../Forrgotpassword/ForgotPasword.module.css';
import { useLocation, useNavigate } from 'react-router-dom';
import UserApi from '../../../Apis/UserApi';
import Toast from '../../../component/Toast/Toast';
import { useState } from 'react';
import CustomSpinner from '../../../component/Spinner/Spinner';
import EmployerAPIS from '../../../Apis/EmployerApi';
import TimerPage from '../../CommonPages/TimerPage/TimerPage';
import { DynamicTitle } from '../../../Helpers/DynamicTitle';
import Goback from '../../../component/GoBackicon/goback';
import pandalogo from '../../../../assets/png with Transparent background (1).png';
import { emailRegex } from '../../../Regix/passwordRegix';

function ForgotPassword(user) {
  const userapi = UserApi();
  const employerapi = EmployerAPIS();
  const [email, setEmail] = useState('');
  const [isloading, setIsloading] = useState(false);
  const [showTimer, setshowTimer] = useState(false);
  const location = useLocation();

  const isValidEmail = (email) => {
    return emailRegex.test(email);
  };

  const userResetPass = async () => {
    setIsloading(true);
    const Email = {
      email: email,
    };
    if (isValidEmail(email)) {
      try {
        const response = await userapi.restSetPassword(Email);
        Toast.success('Please Cheak Email');
        setshowTimer(true);
        setIsloading(false);
      } catch (error) {
        setIsloading(false);
        Toast.error(error?.response?.data?.error?.detail);
        console.error('Error in reset password', error);
      }
    } else {
      setIsloading(false);
      Toast.error('Email Required!');
    }
  };

  const employerResetPass = async () => {
    setIsloading(true);
    const Email = {
      email: email,
    };
    try {
      const response = await employerapi.sendRestLink(Email);
      Toast.success('Please Cheak Email');
      setIsloading(false);
      setshowTimer(true);
    } catch (error) {
      setIsloading(false);
      Toast.error('Enter an email');
      console.error('Error in send reset pass link', error);
    }
  };

  useEffect(() => {
    DynamicTitle('ForgotPassword-PandaPlacement');
  }, []);

  return (
    <div className={styles.dashboard}>
      {showTimer ? (
        <TimerPage
          isShowTimer={showTimer}
          SpecialText="Token Expires in minutes"
        />
      ) : (
        <div className={styles['dashboard-outer']}>
          <div className={styles.forgotHeading}>
            <Goback />
            <div>
              <img src={pandalogo} width={170} />
              <span>Rediscover Your Password with Ease!</span>
            </div>
          </div>
          <div class={styles['widget-title']}>
            <h4>Reset Password</h4>
          </div>

          <div className={styles['widget-content']}>
            <div className="d-flex mb-3">
              <p>
                <span style={{ fontSize: '17px', color: 'var(--black)' }}>
                  Note :
                </span>{' '}
                Forgotten your password? Enter your email address below, and
                we'll eamil instruction for setting a new one
              </p>
            </div>
            <div className={styles['form-group']}>
              <label>Enter Your Email</label>
              <ResumeInput
                placeholder="Enter Your Email"
                name="Enter Your Email"
                // value="Enter Your Email"
                onChange={(e) => {
                  setEmail(e.target.value);
                }}
                required
                height={'60px'}
                width="100%"
                padding={'15px 20px'}
                backgroundColor={'var(--alice-blue)'}
                borderColor={'var(--alice-blue)'}
                borderradius={'8px'}
              />
            </div>
            <div
              style={{
                display: 'flex',
                gap: 10,
                marginTop: 10,
              }}
            >
              <div className={styles['form-group']}>
                {isloading ? (
                  <CustomSpinner />
                ) : (
                  <CustomButton
                    onClick={
                      location.pathname === '/employer/Forgot-password'
                        ? employerResetPass
                        : userResetPass
                    }
                    backgroundcolor={'#002745'}
                    label="Reset my password"
                  />
                )}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default ForgotPassword;
