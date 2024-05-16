import React, { useEffect, useState } from 'react';
import styles from './Login.module.css';
import { FaEye } from 'react-icons/fa';
import { FaEyeSlash } from 'react-icons/fa';
import { useNavigate } from 'react-router-dom';
import { Input } from '../../../component/Input/TextInput';
import CustomSpinner from '../../../component/Spinner/Spinner';
import CustomButton from '../../../component/Button/CustomButton';
import EmployerAPIS from '../../../Apis/EmployerApi';
import Divider from '@mui/material/Divider';
import Modal from 'react-bootstrap/Modal';
import MailOutlineIcon from '@mui/icons-material/MailOutline';
import Toast from '../../../component/Toast/Toast';
import UserApi from '../../../Apis/UserApi';
import { useDispatch } from 'react-redux';
import { setUser } from '../../../../redux/slice/authSlice';
import { emailRegex } from '../../../Regix/passwordRegix';
import { saveToken } from '../../../../redux/slice/loginSlice';
import { saveEmployerToken } from '../../../../redux/slice/EmployerLoginSlice';
import logo from '../../../../assets/png with Transparent background (1).png';

function ReSendVerificationCode({ show, onHide, emailId }) {
  const [editemailadddress, seteditemailadddress] = useState('');
  const [isedit, setIsedit] = useState(true);
  const [isloading, setIsloading] = useState(false);
  const userapi = UserApi();

  const reSendVerificationCode = async () => {
    setIsloading(true);
    try {
      const response = await userapi.reSendVerificationCode({
        email: editemailadddress ? editemailadddress : emailId,
      });
      Toast.success('Verification Email Has Been Sended!');
      setIsloading(false);
    } catch (error) {
      setIsloading(false);
      Toast.error('Internal Server Error');
      console.error('Error in Resend Email Verification Code', error);
    }
  };

  return (
    <>
      <Modal
        aria-labelledby="contained-modal-title-vcenter"
        centered
        show={show}
        onHide={onHide}
      >
        <Modal.Body closeButton>
          <div style={{ textAlign: 'center' }}>
            <MailOutlineIcon fontSize="large" />
            <p style={{ textAlign: 'left' }}>
              To complete the verification process, we'll be sending an email to
              <b> {editemailadddress ? editemailadddress : emailId}</b>. Please
              check your inbox and follow the instructions in the email to
              verify your account. If you don't receive the email within a few
              minutes, Please check your spam folder.
            </p>
          </div>
          <div
            style={{
              width: '100%',
              position: 'relative',
              marginBottom: '20px',
            }}
          >
            <label className="text-sm font-medium text-[var(--dark-shade-gray)] mb-[1rem]">
              Email
            </label>
            <Input
              type="email"
              placeholder="Email"
              borderWidth={'1px'}
              onChange={(e) => {
                seteditemailadddress(e.target.value);
              }}
              value={editemailadddress}
              className="input"
              name="email"
            />
          </div>
          {isloading ? (
            <div style={{ display: 'flex', justifyContent: 'center' }}>
              <CustomSpinner />
            </div>
          ) : (
            <CustomButton
              onClick={reSendVerificationCode}
              type="submit"
              width={'100%'}
              radius={5}
              label="Resend Verification Email"
            />
          )}
        </Modal.Body>
      </Modal>
    </>
  );
}

function Login({ user }) {
  const userApi = UserApi();
  const dispatch = useDispatch();
  const employerAPIS = EmployerAPIS();
  const [isChecked, setIsChecked] = useState(false);
  const [ishide, setishide] = useState(true);
  const [modelShow, setModelShow] = useState(false);
  const [isloading, setisloading] = useState(false);
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    rememberme: isChecked,
  });
  const navigate = useNavigate();

  const handleCheckboxChange = (event) => {
    setIsChecked(event.target.checked);
  };

  const handleHide = (event) => {
    setishide(!ishide);
  };

  const registerHere = () => {
    navigate('/user/register');
  };
  const userLogins = () => {
    navigate('/user/login');
  };
  const employerLogins = () => {
    navigate('/employer/login');
  };

  const employerRegisterHere = () => {
    navigate('/employer/register');
  };
  const isValidEmail = (email) => {
    return emailRegex.test(email);
  };

  const loginUser = async (e) => {
    e.preventDefault();
    setisloading(true);
    if (formData.email === '' || formData.password === '') {
      setisloading(false);
      Toast.error('Please fill in all fields.');
    } else if (!isValidEmail(formData.email)) {
      setisloading(false);
      Toast.error('Invalid email format.');
    } else if (formData.password.length < 4) {
      setisloading(false);
      Toast.error('Password must be at least 4 characters.');
    } else {
      try {
        const userData = {
          email: formData?.email,
          password: formData?.password,
          rememberme: formData?.rememberme,
        };
        const response = await userApi.userLogin(userData); // DataStore
        await localStorage.setItem('Usertoken', response?.token);
        dispatch(saveToken(response?.token));
        setisloading(false);
        Toast.success('User Login!');
        dispatch(setUser({ user: true }));
        navigate('/user/home');
      } catch (error) {
        setisloading(false);
        console.error('Error In User Login', error?.response?.status);
        if (error?.response?.status === 401) {
          Toast.error('Verify Your Account First');
          setModelShow(true);
          return;
        }
        if (error?.response?.status === 404) {
          if (error.response.status === 403) {
            Toast.error('You are not authorized to sign in as Employer!');
          } else {
            Toast.error('Invalid User!');
          }
        }
      }
    }
  };

  const employerLogin = async (e) => {
    setisloading(true);
    e.preventDefault();
    if (formData.email === '' || formData.password === '') {
      setisloading(false);
      Toast.error('Please fill in all fields.');
    } else if (!isValidEmail(formData.email)) {
      setisloading(false);
      Toast.error('Invalid email format.');
    } else {
      try {
        const employerdata = {
          email: formData.email,
          password: formData.password,
          rememberme: formData.rememberme,
        };
        const response = await employerAPIS.EmployerLogin(employerdata);
        //Not getting from api
        dispatch(saveEmployerToken(response?.token));
        // await localStorage.setItem("emptoken", response.token);
        setisloading(false);
        Toast.success('Employer Login!');
        navigate(`/employer/home`);
      } catch (error) {
        setisloading(false);
        console.error('Erro in employer login', error?.response?.status);
        if (error?.response?.status === 403) {
          Toast.error('You are not authorized to sign in as an Job Seeker!!');
        } else {
          Toast.error('Invalid Details!');
        }
      }
    }
  };

  const userResetPass = () => {
    navigate('/Forgot-password');
  };

  const employerResetPass = () => {
    navigate('/employer/Forgot-password');
  };

  useEffect(() => {
    setFormData({
      ...formData,
      rememberme: isChecked,
    });
  }, [isChecked]);

  return (
    <>
      {/* Resend Activtaion Code  */}
      <ReSendVerificationCode
        show={modelShow}
        onHide={() => setModelShow(false)}
        emailId={formData?.email}
      />
      <div
        className={`${styles.backgroundImage} d-flex align-items-center min-vh-100 bg-[var(--light-shade-grayish-blue)] py-3 py-md-0`}
      >
        {/* <Modal keepMounted> */}
        <div className={styles.container}>
          <div className={styles.login_container}>
            <div
              style={{
                width: '100%',
                background: 'var(--white-color)',
                borderRadius: '5px',
              }}
              className="login-container"
            >
              <div className="col-md-12 rounded-md">
                <div
                  style={{
                    display: '-moz-initial',
                    alignItems: 'center',
                    justifyContent: 'center',
                    margin: '5%',
                  }}
                >
                  <img
                    src={logo}
                    style={{
                      width: '60%',
                      margin: '0 auto',
                    }}
                  />
                  <p className="text-[var(--dark-green-color)] fs-5 font-medium text-center">
                    Welcome back to{' '}
                    <span className="fs-4 font-bold ">PandaPlacement</span>
                    <br />
                    {user ? 'Candidate Login' : 'Employer Login'}
                  </p>
                  <div
                    style={{
                      width: '100%',
                      position: 'relative',
                      marginBottom: '20px',
                    }}
                  >
                    <label className="font-medium text-[var(--dark-shade-gray)]">
                      Email
                    </label>
                    <Input
                      type="email"
                      placeholder="name@gmail.com"
                      borderWidth={'1px'}
                      onChange={(event) =>
                        setFormData((pre) => ({
                          ...pre,
                          email: event.target.value,
                        }))
                      }
                      className="input"
                      name="email"
                    />
                    <label className="font-medium text-[var(--dark-shade-gray)] mt-4">
                      Password
                    </label>
                    <div
                      style={{}}
                      className="flex border-2 rounded focus:border-2 flex-row bg-[var(--alice-blue)] items-center"
                    >
                      <Input
                        type={ishide ? 'password' : 'text'}
                        placeholder="Password"
                        password="password"
                        onChange={(event) =>
                          setFormData((pre) => ({
                            ...pre,
                            password: event.target.value,
                          }))
                        }
                        borderWidth={'0px'}
                        padding={'0px 20px'}
                      />
                      {ishide ? (
                        <FaEye
                          onClick={handleHide}
                          // icon={faEye}
                          style={{
                            color: 'var(--dark-green-color)',
                            margin: 10,
                            cursor: 'pointer',
                          }}
                        />
                      ) : (
                        <FaEyeSlash
                          onClick={handleHide}
                          // icon={faEyeSlash}
                          style={{
                            color: 'var(--dark-green-color)',
                            marginRight: 5,
                            cursor: 'pointer',
                          }}
                        />
                      )}
                    </div>
                  </div>
                  <div className={styles.remember}>
                    <label className="font-sans text-[var(--dark-green-color)] font-medium">
                      <input
                        style={{
                          borderColor: 'var(--dark-green-color)',
                          marginRight: 5,
                          outline: 0,
                        }}
                        type="checkbox"
                        checked={isChecked}
                        onChange={handleCheckboxChange}
                      />
                      Remember me
                    </label>
                    <p
                      style={{ cursor: 'pointer' }}
                      className="mt-3 font-sans text-[var(--dark-green-color)] font-medium"
                      onClick={user ? userResetPass : employerResetPass}
                    >
                      Forget Password ?
                    </p>
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
                    ) : user ? (
                      <CustomButton
                        onClick={loginUser}
                        backgroundcolor={'#002745'}
                        type="submit"
                        width={'100%'}
                        radius={5}
                        label="Login"
                      />
                    ) : (
                      <CustomButton
                        backgroundcolor={'#002745'}
                        onClick={employerLogin}
                        type="submit"
                        width={'100%'}
                        radius={5}
                        label="Login"
                      />
                    )}
                  </div>
                  <Divider sx={{ marginTop: '1rem', color: 'var(--black)' }}>
                    OR
                  </Divider>
                  {user ? (
                    <>
                      <div
                        style={{
                          position: "'relative",
                          marginTop: '1rem',
                          marginBottom: '1rem',
                          textAlign: 'center',
                          display: 'flex',
                          gap: '10px',
                          flexWrap: 'wrap',
                        }}
                      >
                        <CustomButton
                          backgroundcolor={'transparent'}
                          label="Create Candidate Account"
                          textcolor={'#00203a'}
                          onClick={registerHere}
                          radius={5}
                          border={'1px solid #00203a'}
                          width={'100%'}
                        />
                        <CustomButton
                          backgroundcolor={'transparent'}
                          label="Employer Login"
                          textcolor={'#00203a'}
                          onClick={employerLogins}
                          radius={5}
                          border={'1px solid #00203a'}
                          width={'100%'}
                        />
                      </div>
                    </>
                  ) : (
                    <div
                      style={{
                        marginTop: '10px ',
                        display: 'flex',
                        gap: '10px',
                        alignItems: 'center',
                        flexWrap: 'wrap',
                      }}
                    >
                      <CustomButton
                        backgroundcolor={'transparent'}
                        label="Create Employer Account"
                        textcolor={'#00203a'}
                        onClick={employerRegisterHere}
                        radius={5}
                        border={'1px solid #00203a'}
                        width={'100%'}
                      />
                      <CustomButton
                        backgroundcolor={'transparent'}
                        label="User Login"
                        textcolor={'#00203a'}
                        onClick={userLogins}
                        radius={5}
                        border={'1px solid #00203a'}
                        width={'100%'}
                      />
                    </div>
                  )}
                  {/* Soical Buttons   */}
                  {/* <div className="grid justify-items-center mb-[1rem]">
                    <Box
                      sx={{
                        display: "flex",
                        justifyContent: "space-between",
                        gap: 2,
                        "@media (min-width: 768px)": { fontSize: "0.8rem" },
                        "@media (max-width: 320px)": {
                          display: "flex",
                          flexDirection: "column",
                        },
                      }}
                    >
                      <Button
                        variant="outlined"
                        sx={{
                          borderColor: "#3b5998",
                          fontSize: "0.5rem",
                          textTransform: "capitalize",
                          ":hover": { bgcolor: "#3b5998", color: "var(--white-color)" },
                          "@media (min-width: 768px)": { fontSize: "0.8rem" },
                          color: "#3b5998",
                        }}
                        startIcon={<FacebookIcon />}
                      >
                        Log In via Facebook
                      </Button>
                      <Button
                        variant="outlined"
                        sx={{
                          borderColor: "#dc4d28",
                          textTransform: "capitalize",
                          fontSize: "0.5rem",
                          ":hover": { bgcolor: "#dc4d28", color: "var(--white-color)" },
                          "@media (min-width: 768px)": { fontSize: "0.8rem" },
                          color: "#dc4d28",
                        }}
                        startIcon={<MarkunreadIcon />}
                      >
                        Log In via Gmail{" "}
                      </Button>
                    </Box>
                  </div> */}
                </div>
              </div>
            </div>
          </div>
        </div>
        <div
          className="text-white bg-red d-none d-md-block"
          style={{ height: '70vh' }}
        >
          <h1 className="fw-bold d-flex align-items-start m-auto w-75">
            Reach Millions Of Job Seekers In Our Community
          </h1>
        </div>
      </div>
    </>
  );
}

export default Login;
