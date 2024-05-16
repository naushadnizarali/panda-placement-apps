import React, { useState } from 'react';
import { FaCheck, FaTimes } from 'react-icons/fa';
import { useNavigate } from 'react-router-dom';
import UserApi from '../../../Apis/UserApi';
import CustomButton from '../../../component/Button/CustomButton';
import { ResumeInput } from '../../../component/Input/TextInput';
import CustomSpinner from '../../../component/Spinner/Spinner';
import Toast from '../../../component/Toast/Toast';
import styles from './changePassword.module.css';

function ChangePassword() {
  const employerapi = UserApi();
  const navigate = useNavigate();
  const [jobDetails, setjobDetails] = useState({
    old_password: '',
    new_password: '',
  });
  const [isloading, setisloading] = useState(false);
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setjobDetails({
      ...jobDetails,
      [name]: value,
    });
    if (name === 'new_password') {
      checkPasswordStrength(value);
    }
  };

  const passwordChange = async () => {
    setisloading(true);
    try {
      if (jobDetails.old_password === '' && jobDetails.new_password === '') {
        setisloading(false);
        return Toast.error('All Feilds Required!');
      }
      if (jobDetails.old_password === jobDetails.new_password) {
        setisloading(false);
        return Toast.error('Old and New Password are not Same!');
      }
      const response = await employerapi.ChangePassword(jobDetails);
      Toast.success('Password Change!');
      //   navigate("/employer/home");
      setisloading(false);
    } catch (error) {
      setisloading(false);
      Toast.error('Try Later Change!');
      console.error('Error in Password change', error);
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

  return (
    <div className={styles.dashboard}>
      <div className={styles['dashboard-outer']}>
        <div class={styles['widget-title']}>
          <h4>Change Password</h4>
        </div>
        <div className={styles['widget-content']}>
          <div className={styles['form-group']}>
            <label> Old Password</label>

            <ResumeInput
              marginTop={10}
              placeholder="Enter old Password"
              name="old_password"
              value={jobDetails.old_password}
              onChange={handleInputChange}
              required
              height={'55px'}
              width="100%"
              backgroundColor={'var(--alice-blue)'}
              borderColor={'var(--alice-blue)'}
              borderradius={'8px'}
            />
          </div>
          <div className={styles['form-group']}>
            <label> New Password</label>
            <ResumeInput
              // className={styles.ResumeInput}
              marginTop={10}
              placeholder="Enter New Password"
              name="new_password"
              value={jobDetails.new_password}
              onChange={handleInputChange}
              required
              height={'55px'}
              width="100%"
              backgroundColor={'var(--alice-blue)'}
              borderColor={'var(--alice-blue)'}
              borderradius={'8px'}
            />
          </div>

          {jobDetails.new_password === '' ? (
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
            <label> Confirm Password</label>
            <ResumeInput
              marginTop={10}
              placeholder="Enter Confirm Password"
              name="confirm_password"
              value={jobDetails.confirm_password}
              onChange={handleInputChange}
              required
              width="100%"
              height={'55px'}
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
              <div className={styles['form-group']}>
                <CustomButton
                  onClick={passwordChange}
                  label="Change Password"
                />
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default ChangePassword;
