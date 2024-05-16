/* eslint-disable react/jsx-no-useless-fragment */
import { FaEye } from 'react-icons/fa';
import { FaEyeSlash } from 'react-icons/fa';
import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import EmployerAPIS from '../../../Apis/EmployerApi';
import UserApi from '../../../Apis/UserApi';
import CustomButton from '../../../component/Button/CustomButton';
import Form from '../../../component/Form/Form';
import { Input } from '../../../component/Input/TextInput';
import CustomSpinner from '../../../component/Spinner/Spinner';
import Toast from '../../../component/Toast/Toast';
import TimerPage from '../TimerPage/TimerPage';
import styles from './Register.module.css';
import { FaCheck, FaTimes } from 'react-icons/fa';
import { DynamicTitle } from '../../../Helpers/DynamicTitle';
import logo from '../../../../assets/png with Transparent background (1).png';
import {
  emailRegex,
  passwordRegex,
  phoneRegex,
  nameRegex,
} from '../../../Regix/passwordRegix';

function Register({ user, employer }) {
  const userApi = UserApi();
  const employerAPIS = EmployerAPIS();
  const navigate = useNavigate();
  const [countriesData, setCountriesData] = useState();
  const [showTimer, setShowTimer] = useState(false);
  const [SearchCounties, setSearchCounties] = useState([]);
  const [ishide, setishide] = useState(true);
  const [isloading, setisloading] = useState(false);
  const [emptyFields, setEmptyFields] = useState([]);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [fieldMessages, setFieldMessages] = useState({
    country: '',
    phone: '',
    email: '',
    first_name: '',
    last_name: '',
    password: '',
    confrimpassword: '',
    company_type: '',
    company_name: '',
  });

  const [formData, setFormData] = useState({
    country: '',
    phone: '',
    email: '',
    first_name: '',
    last_name: '',
    password: '',
    confrimpassword: '',
    company_type: '',
    company_name: '',
  });

  const handleHide = (event) => {
    setishide(!ishide);
  };
  const validatePhoneNumber = (phoneNumber) => {
    return phoneRegex.test(phoneNumber);
  };

  const handleInputChange = async (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });

    if (name === 'country') {
      setDropdownOpen(true);
      try {
        const response = await userApi?.getCountries();
        const searchCountry = value
          ? response?.filter((country) =>
              country?.name?.toLowerCase()?.startsWith(value?.toLowerCase())
            )
          : response;
        setCountriesData(searchCountry);
      } catch (error) {
        console.error('ERROR:Internal Server Error', error);
      }
    }

    if (name === 'password') {
      checkPasswordStrength(value);
    }

    setFieldMessages({ ...fieldMessages, [name]: '' });
    // Validation for email
    if (name === 'email' && !emailRegex.test(value)) {
      setFieldMessages({ ...fieldMessages, email: 'Invalid email address' });
      setisloading(false);
      return;
    }

    // Validation for password
    // if (name === "password" && !passwordRegex.test(value)) {
    //   setFieldMessages({
    //     ...fieldMessages,
    //     password:
    //       "Password must be at least 8 characters and include uppercase, lowercase, numbers, and special characters",
    //   });
    //   setisloading(false);
    //   return;
    // }

    // Validation for phone number
    // if (name === "phone") {
    //   const isValidPhoneNumber = validatePhoneNumber(value);
    //   if (!isValidPhoneNumber) {
    //     setFieldMessages({
    //       ...fieldMessages,
    //       phone: "Invalid phone number Please use the format: +92 300 555 1234",
    //     });
    //     setisloading(false);
    //     return;
    //   }
    // }

    // Validation for first name and last name
    if (
      (name === 'first_name' || name === 'last_name') &&
      !nameRegex.test(value)
    ) {
      setFieldMessages({ ...fieldMessages, [name]: 'Invalid name' });
      setisloading(false);
      return;
    }

    if (name === 'confrimpassword' && value !== formData.password) {
      setFieldMessages({
        ...fieldMessages,
        confrimpassword: 'Passwords must match',
      });
    }
    setisloading(false);
    return;
  };

  const registerUser = async (e) => {
    setisloading(true);
    const emptyFieldList = [];
    const messages = {};

    if (!emailRegex.test(formData.email)) {
      emptyFieldList.push('email');
      messages.email = 'Invalid email address';
    }

    // if (!phoneRegex.test(formData.phone)) {
    //   emptyFieldList.push("phone");
    //   messages.phone = "Please use the format: +92 300 555 1234";
    // }
    // if (!passwordRegex.test(formData.password)) {
    //   emptyFieldList.push("password");
    //   messages.password =
    //     "Password must be at least 8 characters and include uppercase, lowercase, numbers, and special characters";
    // }

    if (formData.password !== formData.confrimpassword) {
      emptyFieldList.push('confrimpassword');
      messages.confrimpassword = 'Passwords must match';
      setisloading(false);
    }
    setEmptyFields(emptyFieldList);
    setFieldMessages(messages);
    if (emptyFieldList.length === 0) {
      const userData = {
        country: formData.country,
        phone: formData.phone,
        email: formData.email,
        first_name: formData.first_name,
        last_name: formData.last_name,
        password: formData.password,
      };
      try {
        setisloading(true);
        const response = await userApi.userRegistration(userData);
        Toast.success('User Register!');
        setisloading(false);
        setShowTimer(true);
        // navigate("/user/login");
      } catch (error) {
        if (error?.response?.status === 409) {
          Toast.error('Email Already Exists!');
          setFieldMessages({
            ...fieldMessages,
            email: 'Email is already registered. Please use a different email.',
          });
        } else if (error?.response?.status === 403) {
          Toast.error('Email Already Exists!');
          setFieldMessages({
            ...fieldMessages,
            email: 'Please use diferent email for user Registration',
          });
        }
        console.error('Error in user registration', error);
        setisloading(false);
      } finally {
        setisloading(false);
      }
    } else {
      // If there are validation errors, do not proceed with registration
      setisloading(false);
      // Toast.error("click resgis")
    }
  };

  const employerregister = async (e) => {
    setisloading(true);
    // e.preventDefault(); // Prevent the form from submitting by default
    const emptyFieldList = [];
    const messages = {};
    if (!emailRegex.test(formData.email)) {
      emptyFieldList.push('email');
      messages.email = 'Invalid email address';
      setisloading(false);
    }
    if (!phoneRegex.test(formData.phone)) {
      emptyFieldList.push('phone');
      messages.phone = 'Please use the format: +86 800 555 1234';
      setisloading(false);
    }

    if (formData?.password?.trim() !== formData?.confrimpassword?.trim()) {
      Toast.error('Password Must Match!');
      setisloading(false);
    }

    if (formData.password.trim() !== formData.confrimpassword.trim()) {
      emptyFieldList.push('confrimpassword');
      messages.confrimpassword = 'Passwords must match';
      setisloading(false);
    }
    if (
      formData.country &&
      formData.phone &&
      formData.email &&
      formData.company_type &&
      formData.company_name &&
      formData.password &&
      formData.confrimpassword
    ) {
      if (emptyFieldList.length === 0) {
        try {
          const employerdata = {
            country: formData.country,
            phone: formData.phone,
            email: formData.email,
            password: formData.password,
            company_type: formData.company_type,
            company_name: formData.company_name,
          };
          const response = await employerAPIS.EmployerRegistration(
            employerdata
          );
          Toast.success('Employer Register!');
          setisloading(false);
          setShowTimer(true);
          // navigate("/employer/login");
        } catch (error) {
          console.error(
            'Error Please Use Different Email For Employer Account',
            error
          );
          if (error.response.status === 403) {
            Toast.error('Please Use Different Email For Employer Account!');
            setisloading(false);
          } else if (error.response.status === 409) {
            Toast.error('Email Already Exits!');
            setFieldMessages({
              ...fieldMessages,
              email:
                'Email is already registered. Please use a different email.',
            });
            setisloading(false);
          } else {
            Toast.error('An error occurred. Please try again.');
            setisloading(false);
          }
        }
      }
    } else {
      Toast.error('Please Fill all the Feilds!.');
      setisloading(false);
    }
  };

  // password strength code
  const [passwordStrong, setPasswordStrong] = useState({
    specialCharacter: false, //Define State
    length: false,
    lowercase: false,
    uppercase: false,
    number: false,
  });

  const checkPasswordStrength = (password) => {
    setPasswordStrong({
      length: password?.length >= 8 && password?.length <= 72,
      lowercase: /[a-z]/.test(password),
      uppercase: /[A-Z]/.test(password),
      number: /\d/.test(password),
      specialCharacter: /[!@#$%^&*()_+{}\\[\]:;<>,.?~\\/-]/.test(password), //Validation Added For Speical Chac...
    });
  };
  // SpecialText={`Please Verify Your Email ${formData?.email} Address. Just Send on the Same Address`}

  useEffect(() => {
    DynamicTitle('Register-PandaPlacement');
  }, []);

  return (
    <>
      {showTimer ? (
        <TimerPage
          SpecialText={
            <>
              {' '}
              Verify your email <b>{formData?.email}</b>. Check your inbox and
              spam folder.
            </>
          }
          isShowTimer={showTimer}
        />
      ) : (
        <Form
          onSubmit={(e) => (employer ? employerregister(e) : registerUser(e))}
        >
          <div className={styles.backgroundImage}>
            <div className={styles.container}>
              <div className={styles.login_container}>
                <div
                  // style={{
                  //   width: "100%",
                  //   background: "var(--white-color)",
                  //   borderRadius: "20px",
                  // }}
                  className={styles.InnerContainer}
                >
                  <div
                    style={{
                      display: '-moz-initial',
                      alignItems: 'center',
                      justifyContent: 'center',
                      margin: '5%',
                    }}
                  >
                    <div>
                      <img
                        src={logo}
                        alt="logo"
                        style={{
                          width: '50%',
                          margin: '0 auto',
                        }}
                      />
                      <h5 className="text-[var(--dark-green-color)] font-medium text-center">
                        Welcome To PandaPlacement
                      </h5>
                      <p className="text-[var(--dark-green-color)] font-bold text-center ">
                        {employer ? 'Employer' : 'Candidate'} Registration
                      </p>
                      <div>
                        <div
                          style={{
                            width: '100%',
                            padding: '1rem',
                            marginBottom: '1rem',
                          }}
                        >
                          {employer ? (
                            <>
                              <Input
                                marginTop={5}
                                type="text"
                                placeholder="Company Name"
                                onChange={handleInputChange}
                                borderWidth={'2px'}
                                name="company_name"
                                value={formData.company_name}
                                required
                              />
                              <Input
                                marginTop={5}
                                type="text"
                                placeholder="Company type"
                                onChange={handleInputChange}
                                borderWidth={'2px'}
                                name="company_type"
                                value={formData.company_type}
                                required
                              />
                            </>
                          ) : (
                            <>
                              <Input
                                marginTop={5}
                                type="text"
                                placeholder="First name"
                                onChange={handleInputChange}
                                borderWidth={'2px'}
                                name="first_name"
                                value={formData.first_name}
                                required
                              />

                              <Input
                                marginTop={5}
                                type="text"
                                placeholder="Last Name"
                                onChange={handleInputChange}
                                borderWidth={'2px'}
                                name="last_name"
                                value={formData.last_name}
                                required
                              />
                            </>
                          )}
                          <Input
                            marginTop={5}
                            type="email"
                            placeholder="Email"
                            onChange={handleInputChange}
                            borderWidth={'2px'}
                            name="email"
                            value={formData.email}
                            required
                          />
                          {/* {fieldMessages.email && (
                            <p className={styles.error}>
                              {fieldMessages.email}
                            </p>
                          )} */}
                          <Input
                            marginTop={5}
                            type="text"
                            placeholder="Country"
                            onChange={handleInputChange}
                            borderWidth={'2px'}
                            name="country"
                            value={formData.country}
                            required
                            // onFocus={() => setDropdownOpen(true)}
                          />
                          {dropdownOpen &&
                            countriesData &&
                            countriesData?.length >= 1 && (
                              <div
                                style={{
                                  zIndex: 9,
                                  overflowY: 'scroll',
                                  height: '15vh',
                                  cursor: 'pointer',
                                }}
                                className={styles.country_dropdown}
                              >
                                {countriesData &&
                                  countriesData.map((item) => (
                                    <div key={item.name}>
                                      <p
                                        onClick={() => {
                                          setFormData({
                                            ...formData,
                                            country: item?.name,
                                          });
                                          setSearchCounties('');
                                          setDropdownOpen(false);
                                        }}
                                      >
                                        {item.name}
                                      </p>
                                    </div>
                                  ))}
                              </div>
                            )}
                          <Input
                            marginTop={5}
                            type="text"
                            placeholder="Mobile"
                            onChange={handleInputChange}
                            borderWidth={'2px'}
                            name="phone"
                            value={formData.phone}
                            required
                          />
                          {fieldMessages.phone && (
                            <p className={styles.error}>
                              {fieldMessages.phone}
                            </p>
                          )}

                          <div className="flex border-2 rounded :hover text-blue border-[var(--alice-blue)] mt-1 mb-1 flex-row items-center">
                            <Input
                              type={ishide ? 'password' : 'text'}
                              placeholder="Password"
                              onChange={handleInputChange}
                              borderWidth={'0px'}
                              borderradius={1}
                              name="password"
                              value={formData.password}
                              required
                            />
                            {ishide ? (
                              <FaEye
                                onClick={handleHide}
                                // icon={faEye}
                                style={{
                                  color: 'var(--primary-color)',
                                  marginRight: 5,
                                }}
                              />
                            ) : (
                              <FaEyeSlash
                                onClick={handleHide}
                                // icon={faEyeSlash}
                                style={{
                                  color: 'var(--crimson)',
                                  marginRight: 5,
                                }}
                              />
                            )}
                          </div>
                          {formData.password === '' ? (
                            ' '
                          ) : (
                            <div>
                              Password Strength
                              <ul className={styles.passwordStrength}>
                                <li
                                  className={
                                    passwordStrong?.specialCharacter //reading state True OR False
                                      ? styles.valid
                                      : styles.invalid
                                  }
                                >
                                  {passwordStrong?.specialCharacter ? (
                                    <FaCheck />
                                  ) : (
                                    <FaTimes />
                                  )}
                                  1-2 Special Character
                                </li>

                                <li
                                  className={
                                    passwordStrong.length
                                      ? styles.valid
                                      : styles.invalid
                                  }
                                >
                                  {passwordStrong.length ? (
                                    <FaCheck />
                                  ) : (
                                    <FaTimes />
                                  )}{' '}
                                  8 - 72 Characters
                                </li>
                                <li
                                  className={
                                    passwordStrong.lowercase
                                      ? styles.valid
                                      : styles.invalid
                                  }
                                >
                                  {passwordStrong.lowercase ? (
                                    <FaCheck />
                                  ) : (
                                    <FaTimes />
                                  )}{' '}
                                  1 Lowercase Character
                                </li>
                                <li
                                  className={
                                    passwordStrong.uppercase
                                      ? styles.valid
                                      : styles.invalid
                                  }
                                >
                                  {passwordStrong.uppercase ? (
                                    <FaCheck />
                                  ) : (
                                    <FaTimes />
                                  )}{' '}
                                  1 Uppercase Character
                                </li>
                                <li
                                  className={
                                    passwordStrong.number
                                      ? styles.valid
                                      : styles.invalid
                                  }
                                >
                                  {passwordStrong.number ? (
                                    <FaCheck />
                                  ) : (
                                    <FaTimes />
                                  )}{' '}
                                  1 Number
                                </li>
                              </ul>
                            </div>
                          )}
                          {fieldMessages.password && (
                            <p className={styles.error}>
                              {fieldMessages.password}
                            </p>
                          )}
                          <div className="flex border-2  rounded border-[var(--alice-blue)]  mt-1 flex-row items-center">
                            <Input
                              type={ishide ? 'password' : 'text'}
                              placeholder="Confrim Password"
                              onChange={handleInputChange}
                              borderWidth={'0px'}
                              borderradius={1}
                              name="confrimpassword"
                              value={formData.confrimpassword}
                              required
                            />

                            {ishide ? (
                              <FaEye
                                onClick={handleHide}
                                // icon={faEye}
                                style={{
                                  color: 'var(--primary-color)',
                                  marginRight: 5,
                                }}
                              />
                            ) : (
                              <FaEyeSlash
                                onClick={handleHide}
                                // icon={faEyeSlash}
                                style={{
                                  color: 'var(--crimson)',
                                  marginRight: 5,
                                }}
                              />
                            )}
                          </div>
                          {fieldMessages.confrimpassword && (
                            <p className={styles.error}>
                              {fieldMessages.confrimpassword}
                            </p>
                          )}
                        </div>
                      </div>

                      <div>
                        {isloading ? (
                          <div
                            style={{
                              display: 'flex',
                              alignItems: 'center',
                              justifyContent: 'center',
                            }}
                          >
                            <CustomSpinner />
                          </div>
                        ) : employer ? (
                          <CustomButton
                            onClick={employerregister}
                            width={'100%'}
                            radius={5}
                            label="Register"
                            backgroundcolor={'#002745'}
                          />
                        ) : (
                          <CustomButton
                            onClick={registerUser}
                            width={'100%'}
                            radius={5}
                            label="Register"
                            backgroundcolor={'#002745'}
                            padding={'15px 20px'}
                          />
                        )}
                      </div>

                      {employer ? (
                        <div
                          // style={{position: "'relative", marginTop: '10px', textAlign:'center' }}
                          className="mt-4 text-center"
                        >
                          {/* <p className="font-sans">
                            Already have an account ?
                            <span
                              onClick={() => {
                                navigate("/employer/login");
                              }}
                              style={{ cursor: "pointer" }}
                              className="text-[var(--primary-color)]"
                            >
                              Login
                            </span>
                          </p> */}
                          <CustomButton
                            onClick={() => {
                              navigate('/employer/login');
                            }}
                            label={'Employer Login'}
                            backgroundcolor={'transparent'}
                            width={'100%'}
                            textcolor={'#002745'}
                            radius={5}
                            border={'1px solid #002745'}
                          />
                        </div>
                      ) : (
                        <div className="mt-4 text-center">
                          <CustomButton
                            onClick={() => {
                              navigate('/user/login');
                            }}
                            label={'Candidate Login'}
                            backgroundcolor={'transparent'}
                            width={'100%'}
                            textcolor={'#002745'}
                            radius={5}
                            border={'1px solid #002745'}
                          />
                          {/* <p className="font-sans">
                            Already have an account?
                            <span
                              onClick={() => {
                                navigate("/user/login");
                              }}
                              style={{ cursor: "pointer", marginLeft: "7px" }}
                              className="text-[var(--primary-color)]"
                            >
                              Login
                            </span>
                          </p> */}
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <div>
              <div
                className="text-white bg-red d-none d-md-block"
                style={{ height: '70vh' }}
              >
                <h1 className="text-start m-auto w-75 text-white ">
                  Reach Millions Of Job Seekers In Our Community
                </h1>
              </div>
            </div>
          </div>
        </Form>
      )}
    </>
  );
}

export default Register;
