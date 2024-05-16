import React, { useEffect, useState } from 'react';
import styles from './Login.module.css';
import { FaEye } from 'react-icons/fa';
import { FaEyeSlash } from 'react-icons/fa6';

import { useNavigate } from 'react-router-dom';
import { Input } from '../../../component/Input/TextInput';
import CustomSpinner from '../../../component/Spinner/Spinner';
import CustomButton from '../../../component/Button/CustomButton';
import Toast from '../../../component/Toast/Toast';
import AdminApi from '../../../Apis/AdminApi';
import checkEmptyFields from '../../../component/ErrorFunctions/Validation';
function Login({ title }) {
  const adminapi = AdminApi();
  const [ishide, setishide] = useState(true);
  const [isloading, setisloading] = useState(false);

  const [formData, setFormData] = useState({
    email: 'manager@mail.com',
    password: 'admin@123',
  });

  const navigate = useNavigate();

  const handleHide = (event) => {
    setishide(!ishide);
  };

  const adminLogin = async (e) => {
    setisloading(true);
    e.preventDefault();
    const adminData = {
      email: formData.email,
      password: formData.password,
    };
    if (!checkEmptyFields(adminData)) {
      setisloading(false);
      return;
    }
    try {
      const response = await adminapi.adminLogin(adminData);
      //Not getting from api
      await localStorage.setItem('admin_token', response.token);
      setisloading(false);
      Toast.success('Welcome Back!');
      navigate(`/manager/manager-home`);
    } catch (error) {
      setisloading(false);
      console.error('Erro in employer login', error);
    }
  };

  return (
    <div className="d-flex align-items-center min-vh-100 bg-[var(----light-shade-grayish-blue)] py-3 py-md-0">
      {/* <Modal keepMounted> */}
      <div className={styles.container}>
        <div className={styles.login_container}>
          <div
            style={{
              width: '100%',
              background: 'var(--white-color)',
              borderRadius: '20px',
            }}
            className="login-container"
          >
            <div className="col-md-12 rounded-md">
              <div
                style={{
                  display: '-moz-initial',
                  alignItems: 'center',
                  justifyContent: 'center',
                  marginLeft: '5%',
                  marginRight: '5%',
                  marginTop: '6%',
                }}
              >
                <p className="text-[var(--dark-green-color)] text-sm font-medium text-center">
                  Welcome To PandaPlacement Admin
                </p>
                <h1 className="text-center text-xlg">{title}</h1>
                <div
                  style={{
                    width: '100%',
                    position: 'relative',
                    marginBottom: '20px',
                  }}
                >
                  <label className="text-sm font-medium text-[var(--dark-shade-gray)] mb-[1.5rem]">
                    Email
                  </label>
                  <Input
                    type="email"
                    placeholder="Email"
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
                  <label className="text-sm font-medium text-[var(--dark-shade-gray)] mt-[2rem]">
                    Password
                  </label>
                  <div
                    style={{ marginBottom: '20px' }}
                    className="flex border-2 rounded focus:border-2  mt-4 flex-row bg-[var(--alice-blue)] items-center"
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
                    />
                    {ishide ? (
                      <FaEye
                        onClick={handleHide}
                        // icon={faEye}
                        style={{
                          color: 'var(--dark-green-color)',
                          marginRight: 5,
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
                <div
                  style={{
                    marginBottom: '2rem',
                  }}
                >
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
                  ) : (
                    <CustomButton
                      onClick={adminLogin}
                      type="submit"
                      width={'100%'}
                      radius={5}
                      label="Admin Login"
                    />
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Login;
