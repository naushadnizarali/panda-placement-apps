import React, { useState } from 'react';
import UserApi from '../../Apis/UserApi';
import CustomButton from '../Button/CustomButton';
import { ResumeInput } from '../Input/TextInput';
import Toast from '../Toast/Toast';
import styles from './Newletter.module.css'; // Import the modular CSS file
import {
  emailRegex,
  passwordRegex,
  phoneRegex,
  nameRegex,
  passwordValidation,
} from '../../Regix/passwordRegix';

const NewsLetter = () => {
  const [email, setEmail] = useState('');
  const [error, setError] = useState(false);
  const userapi = UserApi();
  const handleChange = (value) => {
    setEmail(value);
    setError(false);
  };

  const handleSubmit = async () => {
    // const emailRegex =
    //   /^[A-Za-z0-9._%+-]{1,64}@(?:[A-Za-z0-9-]{1,63}\.){1,125}[A-Za-z]{2,63}$/;
    const isValidEmail = emailRegex.test(email);
    if (!isValidEmail) {
      Toast.error('Please Enter Email');
      setError(true);
    } else {
      try {
        const response = await userapi.subscriberEmail(email);
        Toast.success('Thanks For Subscribe');
      } catch (error) {
        Toast.error('Please Enter Email');
      }
    }
  };

  return (
    <div className={styles.App}>
      <section>
        <h1>Subscribe to Get Latest Jobs Update</h1>
        <p>
          Stay informed about the latest job opportunities. Subscribe to receive
          updates.
        </p>
        <div>
          <ResumeInput
            className={error ? styles.error : ''}
            type="email"
            placeholder="Your email"
            value={email}
            onChange={(e) => handleChange(e.target.value)}
          />
          <CustomButton onClick={handleSubmit} label="Update Me" />
        </div>
      </section>
    </div>
  );
};

export default NewsLetter;
