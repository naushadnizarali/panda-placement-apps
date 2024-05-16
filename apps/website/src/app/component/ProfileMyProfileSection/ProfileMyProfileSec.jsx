import React, { useEffect, useState } from 'react';
import ImageUploader from '../../component/ImageUploader/ImageUploader';
import style from '../../pages/User/Hprofile/hprofile.module.css';
import { useNavigate } from 'react-router-dom';
import UserApi from '../../Apis/UserApi';
import Toast from '../Toast/Toast';
import CustomSpinner from '../../component/Spinner/Spinner';
import { ResumeInput } from '../Input/TextInput';
import CustomButton from '../Button/CustomButton';
import { useDispatch, useSelector } from 'react-redux';
import { fetchUserData, logoutUser } from '../../../redux/slice/userdataSlice';

function MyProfile({ onUpdate }) {
  const navigate = useNavigate();
  const userapi = UserApi();
  const dispatch = useDispatch();
  const profileData = useSelector((state) => state.userdata.data);
  const [isloading, setisloading] = useState(false);
  const [userprofile, setuserprofile] = useState({
    first_name: '',
    last_name: '',
    email: '',
    phone: '',
    image: null,
  });

  const handleFileChange = (file) => {
    // setUserImage(file);
    setuserprofile({
      ...userprofile,
      image: file,
    });
  };

  const userdata = async () => {
    try {
      dispatch(logoutUser());
      const response = await userapi.UserProfileInformation();
      setuserprofile(response);
      dispatch(fetchUserData(response));
      // setUserImage(response.image);
      onUpdate();
    } catch (error) {
      console.error('Error in my profile', error);
    }
  };
  const clearProfileImage = () => {
    setuserprofile({
      ...userprofile,
      image: false,
    });
  };

  const handleInputChange = (event) => {
    const { name, value } = event.target;
    setuserprofile((userprofile) => ({
      ...userprofile,
      [name]: value,
    }));
  };

  const userUpdate = async () => {
    setisloading(true);
    try {
      const formData = new FormData();
      formData.append(
        'first_name',
        userprofile.first_name ? userprofile.first_name : profileData.first_name
      );
      formData.append(
        'last_name',
        userprofile.last_name ? userprofile.last_name : profileData.last_name
      );
      formData.append(
        'email',
        userprofile.email ? userprofile.email : profileData.email
      );
      formData.append(
        'phone',
        userprofile.phone ? userprofile.phone : profileData.phone
      );
      formData.append(
        'image',
        typeof userprofile?.image === 'string' ? true : userprofile.image
      );
      const response = await userapi.UserProfileInformationPost(formData);
      Toast.success('User Info Updated!');
      userdata();
      onUpdate();
      setisloading(false);
    } catch (error) {
      Toast.error('Fail to update!Please Try later');
      setisloading(false);
    }
  };

  useEffect(() => {
    userdata();
  }, []);

  return (
    <>
      {/* <ImageCropper /> */}
      <section className={style.myProfile_box}>
        <div className={style.previewbutton}>
          <h5 className={style.boxHeadign}>My Profile</h5>
          <button
            className={
              'my-2 rounded-md px-3 py-2 text-sm font-medium  transition duration-500 bg-[var(--light-shade-grayish-blue)] text-[var(--dimgray)] focus:bg-[var(--light-shade-grayish-blue)] focus:text-[var(--primary-color)] hover:bg-[var(--light-shade-grayish-blue)] hover:text-[var(--primary-color)]  hover:shadow-md '
            }
          >
            <a href="/profile-preview" className="no-underline">
              Profile Preview
            </a>
          </button>
        </div>
        <div className={style.ImageUploader}>
          <ImageUploader
            isUserProfile
            clearProfileImage={clearProfileImage}
            onFileChange={handleFileChange}
            profileImage={profileData ? profileData.image : null}
          />
          {/* <div>
            <p>Max file size is 2MB And Suitable files are .jpg & .png</p>
          </div> */}
        </div>
        {/* {isloading ? (
          <CustomSpinner />
        ) : (
          <button onClick={handleRmoveImg} className={style.Removeimagebtn}>
            remove
          </button>
        )} */}
        <div className="row mt-5">
          <div className="col-sm-6">
            <div className="mb-3">
              <label htmlFor="first_name">First Name</label>
              <ResumeInput
                type="text"
                className="form-control"
                placeholder="John"
                value={userprofile?.first_name}
                onChange={handleInputChange}
                name="first_name"
                disabled
              />
            </div>
          </div>
          <div className="col-sm-6">
            <div className="mb-3">
              <label htmlFor="fullName">Last Name</label>
              <ResumeInput
                value={userprofile?.last_name}
                onChange={handleInputChange}
                name="last_name"
                type="text"
                className="form-control"
                id="fullName"
                placeholder="Wick"
                disabled
              />
            </div>
          </div>
        </div>
        <div className="row">
          <div className="col-sm-6">
            <div className="mb-3">
              <label htmlFor="password">Email</label>
              <ResumeInput
                value={userprofile?.email}
                onChange={handleInputChange}
                name="email"
                type="email"
                className="form-control"
                id="email"
                placeholder="name@example.com"
                disabled
              />
            </div>
          </div>
          <div className="col-sm-6">
            <div className="mb-3">
              <label htmlFor="fullName">Phone</label>
              <ResumeInput
                value={userprofile?.phone}
                onChange={handleInputChange}
                name="phone"
                type="text"
                className="form-control"
                id="fullName"
                placeholder="000 999 1111"
              />
            </div>
          </div>
        </div>
        {isloading ? (
          <CustomSpinner />
        ) : (
          <CustomButton onClick={userUpdate} label={'Save'} />
        )}
      </section>
    </>
  );
}

export default MyProfile;
