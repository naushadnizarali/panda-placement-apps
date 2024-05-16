import React, { useEffect, useState } from 'react';
import { FaCheck, FaTimes } from 'react-icons/fa';
import { useNavigate } from 'react-router-dom';
import EmployerAPIS from '../../../Apis/EmployerApi';
import CustomButton from '../../../component/Button/CustomButton';
import { ResumeInput } from '../../../component/Input/TextInput';
import CustomSpinner from '../../../component/Spinner/Spinner';
import Toast from '../../../component/Toast/Toast';
import styles from './ChangePassword.module.css';
import { DynamicTitle } from '../../../Helpers/DynamicTitle';
import { passwordRegex } from '../../../Regix/passwordRegix';

function ChangePassword() {
  const employerapi = EmployerAPIS();
  const navigate = useNavigate();
  const [passwordStrong, setPasswordStrong] = useState({
    length: false,
    lowercase: false,
    uppercase: false,
    number: false,
  });
  const [jobDetails, setjobDetails] = useState({
    old_password: '',
    new_password: '',
  });
  const [isloading, setisloading] = useState(false);

  const checkPasswordStrength = (password) => {
    setPasswordStrong({
      length: password.length >= 8 && password.length <= 72,
      lowercase: /[a-z]/.test(password),
      uppercase: /[A-Z]/.test(password),
      number: /\d/.test(password),
    });
  };

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
  const isStrongPassword = (password) => {
    // Customize the regular expression according to your strength criteria
    // const strongPasswordRegex = /^(?=.*[A-Z])(?=.*[a-z])(?=.*\d).{8,}$/;
    return passwordRegex.test(password);
  };

  const passwordChange = async () => {
    setisloading(true);
    try {
      if (
        jobDetails.old_password === '' ||
        jobDetails.new_password === '' ||
        jobDetails.confirm_password === ''
      ) {
        setisloading(false);
        return Toast.error('All Fields Required!');
      }

      if (!isStrongPassword(jobDetails.new_password)) {
        setisloading(false);
        return Toast.error('Password should be strong!');
      }

      if (jobDetails.new_password !== jobDetails.confirm_password) {
        setisloading(false);
        return Toast.error('New and Confirm Passwords do not match!');
      }
      const response = await employerapi.ChangePassword(jobDetails);
      Toast.success('Password Change!');
      navigate('/employer/home');
      setisloading(false);
    } catch (error) {
      setisloading(false);
      Toast.error(
        `${
          error?.response?.data?.error?.detail
            ? error?.response?.data?.error?.detail
            : 'Please Try Later!'
        }`,
      );
      console.error('Error change pass', error?.response?.data?.error?.detail);
    }
  };

  useEffect(() => {
    DynamicTitle('Change-Password-PandaPlacement');
  }, []);

  return (
    <div className={styles.dashboard}>
      <div className={styles['upper-title-box']}>
        {' '}
        <h3>ChangePassword</h3>{' '}
        <div className={styles.text}>
          <p>Ready to jump back in</p>
        </div>
      </div>
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
              height={'60px'}
              width="100%"
              padding={'15px 20px'}
              backgroundColor={'var(--alice-blue)'}
              borderColor={'var(--alice-blue)'}
              borderradius={'8px'}
            />
          </div>
          <div className={styles['form-group']}>
            <label> New Password</label>
            <ResumeInput
              marginTop={10}
              placeholder="Enter New Password"
              name="new_password"
              value={jobDetails.new_password}
              onChange={handleInputChange}
              required
              width="100%"
              height={'60px'}
              padding={'15px 20px'}
              backgroundColor={'var(--alice-blue)'}
              borderColor={'var(--alice-blue)'}
              borderradius={'8px'}
            />

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
          </div>
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
              height={'60px'}
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
              // marginBottom: '3rem',
              // display: "flex"
            }}
            className={styles['form-group']}
          >
            {isloading ? (
              <CustomSpinner />
            ) : (
              <div>
                <CustomButton
                  borderradius={'8px'}
                  borderColor={'var(--primary-color)'}
                  backgroundcolor={'var(--primary-color)'}
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
