import React, { useState } from 'react';
import styles from './Contactus.module.css';
import { useLocation, useNavigate } from 'react-router-dom';
import CustomSpinner from '../../../component/Spinner/Spinner';
import UserApi from '../../../Apis/UserApi';
import Toast from '../../../component/Toast/Toast';
import { useEffect } from 'react';
import CustomButton from '../../../component/Button/CustomButton';
function Contactus() {
  const location = useLocation();
  const userapi = UserApi();
  const [isloading, setisloading] = useState(false);
  const navigate = useNavigate();
  const [contactusform, setcontactusform] = useState({
    name: '',
    email: '',
    phone: '',
    subject: '',
    message: '',
  });
  const [errors, setErrors] = useState({
    name: false,
    email: false,
    phone: false,
    subject: false,
    message: false,
  });

  const getTokenFromLocalStorage = () => {
    return localStorage.getItem('emptoken');
  };

  const validateForm = () => {
    const newErrors = {
      name: contactusform.name === '',
      email: !/^\S+@\S+\.\S+$/.test(contactusform.email),
      phone: contactusform.phone === '',
      subject: contactusform.subject === '',
      message: contactusform.message === '',
    };
    setErrors(newErrors);
    return !Object.values(newErrors).some((hasError) => hasError);
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setcontactusform({
      ...contactusform,
      [name]: value,
    });
  };

  const sendUs = (e) => {
    e.preventDefault();
  };

  const contactUs = async () => {
    setisloading(true);
    if (validateForm()) {
      try {
        const response = await userapi.ContactUs(contactusform);
        Toast.success('Thanks We Contact You Soon....');
        const token = getTokenFromLocalStorage();
        const keyToCheck = 'emptoken' || 'Usertoken';
        setisloading(false);
        setcontactusform({
          name: '',
          email: '',
          phone: '',
          subject: '',
          message: '',
        });
      } catch (error) {
        setisloading(false);
        Toast.error('Please Try Later', error);
      }
    } else {
      setisloading(false);
      Toast.error('Form is not valid. Please check the fields.');
    }
  };

  useEffect(() => {
    window.scrollTo(0, 0); // Scroll to the top when the component mounts
  }, []);
  return (
    <>
      <div className={styles.dashboard}>
        <div className={styles.maincolor}>
          <div className={styles.first}>
            <>
              <h4>Contact</h4>
              <p>
                Send a message and our team will get back to you within 24 hrs
              </p>
            </>
            <div className={styles.form}>
              <div className={styles.formInputs}>
                <div className={styles.inputs}>
                  <label>First Name</label>
                  <input
                    onChange={handleInputChange}
                    marginTop={5}
                    marginRight={5}
                    placeholder="First name"
                    name="name"
                    required
                    value={contactusform.name}
                    style={{ color: 'var(--black)' }}
                    className={styles.inputfeild}
                  />
                  {errors.name && (
                    <span className="text-danger">Name is required</span>
                  )}
                </div>
                <div className={styles.inputs}>
                  <label>Enter Your Email</label>
                  <input
                    onChange={handleInputChange}
                    marginTop={5}
                    placeholder="jhon234@gmail.com"
                    name="email"
                    required
                    value={contactusform.email}
                    style={{ color: 'var(--black)' }}
                    className={styles.inputfeild}
                  />
                  {errors.email && (
                    <span className="text-danger">Email is required</span>
                  )}
                </div>
              </div>
              <div className={styles.formInputs}>
                <div className={styles.inputs}>
                  <label>Enter Your Mobile</label>
                  <input
                    onChange={handleInputChange}
                    marginTop={5}
                    placeholder="Mobile #"
                    name="phone"
                    required
                    value={contactusform.phone}
                    className={styles.inputfeild}
                  />
                  {errors.phone && (
                    <span className="text-danger">Phone is required</span>
                  )}
                </div>
                <div className={styles.inputs}>
                  <label>Enter Your Subject</label>
                  <input
                    onChange={handleInputChange}
                    marginTop={5}
                    marginRight={5}
                    placeholder="Enter Subject"
                    name="subject"
                    required
                    value={contactusform.subject}
                    className={styles.inputfeild}
                  />
                  {errors.subject && (
                    <span className="text-danger">Subject is required</span>
                  )}
                </div>
              </div>

              <label>Enter Your Message</label>
              <textarea
                onChange={handleInputChange}
                placeholder="Enter Message"
                name="message"
                required
                value={contactusform.message}
                rows={7}
                className={styles.textarea}
              />
              {errors.message && (
                <span className="text-danger">Message is required</span>
              )}
              {isloading ? (
                <div className={styles.loader}>
                  <CustomSpinner />
                </div>
              ) : (
                <CustomButton
                  onClick={contactUs}
                  type="submit"
                  className={styles.btn}
                  label={'Submit'}
                  marginTop={10}
                />
              )}
            </div>
          </div>
          {/* <div className={styles.second}> */}
          {/* <div className={styles.secondcontent}>
              <div className={styles.smallcontent}>
                <p className="fs-5">Location</p>
                <h5>
                  Garden, Plot # 215/3, Banglow # 2, Punjatan Society Karachi,
                  Pakistan
                </h5>
              </div> */}
          {/* <div className={styles.smallcontent}>
                <p>WORKING HOURS</p>
                <h5>Monday To Friday 9:00 AM to 8:00 PM </h5>
                <h5>020 7993 2905</h5>
              </div> */}
          {/* <div className={styles.smallcontent}>
                <p className="fs-5">CONTACT US</p>
                <h5>info@Pandaplacement.com</h5>
                <p>Our Support Team is available 24Hrs</p>
              </div> */}
          {/* </div> */}
        </div>
      </div>
    </>
  );
}

export default Contactus;
