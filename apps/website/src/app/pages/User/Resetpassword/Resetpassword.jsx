import React, { useEffect } from 'react';
import { useState } from 'react';
import { ResumeInput } from '../../../component/Input/TextInput';
import CustomButton from '../../../component/Button/CustomButton';
import UserApi from '../../../Apis/UserApi';
import Toast from '../../../component/Toast/Toast';
import CustomSpinner from '../../../component/Spinner/Spinner';
import { useLocation, useNavigate } from 'react-router-dom';
import styles from '../Resetpassword/Resetpassword.module.css';
import { passwordValidation } from '../../../Regix/passwordRegix';
import EmployerAPIS from '../../../Apis/EmployerApi';
import { FaCheck, FaTimes } from 'react-icons/fa';
import { DynamicTitle } from '../../../Helpers/DynamicTitle';
// import { passwordRegex } from "../../../Regix/passwordRegix";

function ResetPassword() {
  const navigate = useNavigate();
  const userapi = UserApi();
  const employerapi = EmployerAPIS();
  const location = useLocation();
  const [isloading, setisloading] = useState(false);
  const [chnagepassword, setchnagepassword] = useState({
    new_password: '',
    new_password_confrim: '',
  });

  const path = location.pathname.slice(1);
  const employerpath = location.pathname.slice(10);
  const condition = location.pathname.slice(0, 9);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setchnagepassword({
      ...chnagepassword,
      [name]: value,
    });
    if (name === 'new_password') {
      checkPasswordStrength(value);
    }
  };
  const isPasswordValid = () => {
    const passwordRegex = passwordValidation;
    return passwordRegex.test(chnagepassword.new_password);
  };

  const handleEmployerPasswordReset = async () => {
    setisloading(true);
    const data = {
      new_password: chnagepassword.new_password,
    };
    if (chnagepassword.new_password !== chnagepassword.new_password_confrim) {
      setisloading(false);
      return Toast.error('Password Not Match!');
    }

    try {
      const response = await employerapi.employerrestSetPasswordConfrim(
        data,
        employerpath,
      );
      Toast.success('Password Reset Successfully!');
      setisloading(false);
      navigate('/employer/login');
    } catch (error) {
      if (error.response.status === 400) {
        Toast.error('Token Expired!');
        setisloading(false);
        navigate('/employer/Forgot-password');
      }
      setisloading(false);
    }
  };

  const handlerestSetPasswordConfrim = async () => {
    setisloading(true);
    const data = {
      new_password: chnagepassword.new_password,
    };
    if (chnagepassword.new_password !== chnagepassword.new_password_confrim) {
      setisloading(false);
      return Toast.error('Password Not Match!');
    }

    try {
      const response = await userapi.restSetPasswordConfrim(data, path);
      Toast.success('Password Reset Successfully!');
      setisloading(false);
      navigate('/user/login');
    } catch (error) {
      if (error.response.status === 400) {
        Toast.error('Token Expired!');
        setisloading(false);
        navigate('/Forgot-password');
      }
      setisloading(false);
    }
  };

  // password strength code
  const [passwordStrong, setPasswordStrong] = useState({
    length: false,
    lowercase: false,
    uppercase: false,
    number: false,
  });

  const checkPasswordStrength = (password) => {
    setPasswordStrong({
      length: password.length >= 8 && password.length <= 72,
      lowercase: /[a-z]/.test(password),
      uppercase: /[A-Z]/.test(password),
      number: /\d/.test(password),
    });
  };

  useEffect(() => {
    DynamicTitle('ResetPassword-PandaPlacement');
  }, []);

  return (
    <div className={styles.dashboard}>
      <div className={styles.ResetPasswordHeading}>
        <h2>Pandaplacement</h2>
        <span>Rediscover Your Password with Ease!</span>
      </div>
      <div className={styles['dashboard-outer']}>
        <div class={styles['widget-title']}>
          <h4>Reset Password</h4>
        </div>
        <div className={styles['widget-content']}>
          <div className={styles['form-group']}>
            <label>Enter New Password</label>
            <ResumeInput
              marginTop={10}
              placeholder="Enter New Password"
              name="new_password"
              value={chnagepassword.new_password}
              onChange={handleInputChange}
              required
              height={'60px'}
              width="100%"
              padding={'15px 20px'}
              backgroundColor={'var(--alice-blue)'}
              borderColor={'var(--alice-blue)'}
              borderradius={'8px'}
            />
          </div>
          {chnagepassword.new_password === '' ? (
            ' '
          ) : (
            <div>
              Password Strength
              <ul className={styles.passwordStrength}>
                <li
                  className={
                    passwordStrong.length ? styles.valid : styles.invalid
                  }
                >
                  {passwordStrong.length ? <FaCheck /> : <FaTimes />} 8 - 72
                  Characters
                </li>
                <li
                  className={
                    passwordStrong.lowercase ? styles.valid : styles.invalid
                  }
                >
                  {passwordStrong.lowercase ? <FaCheck /> : <FaTimes />} 1
                  Lowercase Character
                </li>
                <li
                  className={
                    passwordStrong.uppercase ? styles.valid : styles.invalid
                  }
                >
                  {passwordStrong.uppercase ? <FaCheck /> : <FaTimes />} 1
                  Uppercase Character
                </li>
                <li
                  className={
                    passwordStrong.number ? styles.valid : styles.invalid
                  }
                >
                  {passwordStrong.number ? <FaCheck /> : <FaTimes />} 1 Number
                </li>
              </ul>
            </div>
          )}

          <div className={styles['form-group']}>
            <label>Confirm Password</label>
            <ResumeInput
              marginTop={10}
              placeholder="Confirm Password"
              name="new_password_confrim"
              value={chnagepassword.new_password_confrim}
              onChange={handleInputChange}
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
              marginTop: 10,
              marginRight: 30,
            }}
          >
            {isloading ? (
              <CustomSpinner />
            ) : (
              <>
                <div className={styles['form-group']}>
                  <CustomButton
                    onClick={
                      condition === '/employer'
                        ? handleEmployerPasswordReset
                        : handlerestSetPasswordConfrim
                    }
                    label="Confirm"
                  />
                </div>
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default ResetPassword;
