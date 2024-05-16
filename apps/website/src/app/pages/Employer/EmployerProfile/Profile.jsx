import React, { useState } from 'react';
import { ResumeInput } from '../../../component/Input/TextInput';
import styles from './Profile.module.css';
import CustomButton from '../../../component/Button/CustomButton';
import EmployerAPIS from '../../../Apis/EmployerApi';
import Toast from '../../../component/Toast/Toast';
import { useEffect } from 'react';
import Avatar from '@mui/material/Avatar';
import UserApi from '../../../Apis/UserApi';
import { Grid } from '@mui/material/';
import ImageUploader from '../../../component/ImageUploader/ImageUploader';
import CustomSpinner from '../../../component/Spinner/Spinner';
import { DynamicTitle } from '../../../Helpers/DynamicTitle';
import { FaEdit, FaTimes } from 'react-icons/fa';
import {
  fetchEmployerData,
  removeEmployerDataProperty,
} from '../../../../redux/slice/employerProfileDataSlice';
import { useDispatch, useSelector } from 'react-redux';
function Profile() {
  const employeesapi = EmployerAPIS();
  const dispatch = useDispatch();
  const profileData = useSelector((state) => state?.employerProfile?.data);
  const [editIcon, setEditIcon] = useState(<FaEdit />);
  const [isloading, setIsloading] = useState(false);
  const [editIconcom, setEditIconcom] = useState(<FaEdit />);
  const [isEditing, setIsEditing] = useState(false);
  const [profileEdit, setProfileEdit] = useState(false);
  const [id, setId] = useState('');
  const [logo, setLogo] = useState(null);
  const [APIlogo, setAPIlogo] = useState(null);
  const [userImage, setUserImage] = useState(null);
  const [companylogo, setCompanylogo] = useState(null);
  const [companylogoApi, setCompanylogoApi] = useState(null);
  const userapi = UserApi();
  const [file, setFile] = useState(null);

  const [formData, setFormData] = useState({
    company_type: '',
    company_name: '',
    industry: '',
    address: '',
    city: '',
    website: '',
    ntn: '',
    employer_number: '',
    operating_since: '',
    email: '',
    phone: '',
    image: null,
  });
  const [profileinformation, setProfileinformation] = useState({
    first_name: '',
    last_name: '',
    email: '',
    phone: '',
    image: null,
  });

  const handleFileChange = (file) => {
    setProfileinformation({
      ...profileinformation,
      image: file,
    });
  };

  const handleImageChange = (file) => {
    setFormData({
      ...formData,
      image: file,
    });
  };
  const handleEditClick = () => {
    setIsEditing(!isEditing);
    setEditIconcom(isEditing ? <FaEdit /> : <FaTimes />);
  };

  const handleEditClickPro = () => {
    setProfileEdit(!profileEdit); // Toggle the editing state
    setEditIcon(profileEdit ? <FaEdit /> : <FaTimes />);
  };

  const handleInputChange = (e) => {
    const { name, value, files } = e.target;
    if (name === 'attachments[]' && files.length > 0) {
      setLogo(files[0]);
    } else {
      setFormData({ ...formData, [name]: value });
    }
  };

  const handleInputChangePro = (e) => {
    const { name, value } = e.target;
    setProfileinformation({ ...profileinformation, [name]: value });
  };

  const getCompanyInfo = async () => {
    setIsloading(true);
    try {
      const response = await employeesapi.companyInfoGet();
      setFormData({
        company_type: response[0].company_type,
        company_name: response[0].company_name,
        industry: response[0].industry,
        address: response[0].address,
        city: response[0].city,
        website: response[0].website,
        ntn: response[0].ntn,
        employer_number: response[0].employer_number,
        operating_since: response[0].operating_since,
        email: response[0].email,
        phone: response[0].phone,
        image: response[0]?.logo,
      });
      setId(response[0]?.id);
      setIsloading(false);
    } catch (error) {
      setIsloading(false);
      console.error('Data Not Found!', error);
    }
  };

  const handleCompanyInfoUpdate = async () => {
    setIsloading(true);
    setIsEditing(false);
    const companyInfo = new FormData();
    companyInfo.append('company_type', formData?.company_type);
    companyInfo.append('email', formData?.email);
    companyInfo.append('phone', formData?.phone);
    companyInfo.append('company_name', formData?.company_name);
    companyInfo.append('industry', formData?.industry);
    companyInfo.append('address', formData?.address);
    companyInfo.append('city', formData?.city);
    companyInfo.append('website', formData?.website);
    companyInfo.append('ntn', formData?.ntn);
    companyInfo.append('employer_number', formData?.employer_number);
    companyInfo.append('operating_since', formData?.operating_since);
    companyInfo.append('logo', formData.image);
    try {
      await employeesapi.companyInfo(companyInfo);
      Toast.success('Information Added!');
      getCompanyInfo();
      handleEditClick();
      setIsloading(false);
    } catch (error) {
      setIsloading(false);
      console.error('Please Try Later!', error);
    }
  };

  const employerProfile = async () => {
    setIsloading(true);
    try {
      const response = await employeesapi.GetEmployerProfile();
      setProfileinformation(response);
      dispatch(fetchEmployerData(response));
      setIsloading(false);
    } catch (error) {
      setIsloading(false);
      console.error('Please Try Later!', error);
    }
  };

  const clearCompanyProfileImage = () => {
    setFormData({
      ...formData,
      image: false,
    });
  };

  const employerProfileUpdate = async () => {
    setIsloading(true);
    try {
      const formData = new FormData();
      formData.append('first_name', profileinformation.first_name);
      formData.append('last_name', profileinformation.last_name);
      formData.append('email', profileinformation.email);
      formData.append('phone', profileinformation.phone);
      formData.append('image', profileinformation.image);
      const response = await employeesapi.GetEmployerUpdate(formData);
      dispatch(fetchEmployerData(response));
      Toast.success('Profile Updated!!');
      employerProfile();
      handleEditClickPro();
      setIsloading(false);
    } catch (error) {
      if (error?.response?.status == 400) {
        Toast.error('User with This Email AlReady Exits!');
        setIsloading(false);
      }
      setIsloading(false);
      Toast.error('Profile Not Updated!!');
    }
  };

  const handleFormSubmit = async (e) => {
    e.preventDefault();
    setIsloading(true);
    try {
      if (file === null) {
        setIsloading(false);
        return Toast.error('Please Upload The CV!');
      }
      const response = await userapi.uploadPdf(file);
      Toast.success('Resume uploaded!');
      setTimeout(() => {
        window.location.reload();
      }, 2000);
      setFile(null);
      setIsloading(false);
    } catch (error) {
      setIsloading(false);
      Toast.error('Failed to upload resume!');
      console.error('Error uploading file', error);
    }
  };
  const clearProfileImage = () => {
    setLogo(null);
    dispatch(removeEmployerDataProperty('image'));
  };

  useEffect(() => {
    getCompanyInfo();
    employerProfile();
    DynamicTitle('Profile-PandaPlacement');
  }, []);

  return (
    <div className={styles.dashboard}>
      <div className={styles['upper-title-box']}>
        <h3>Profile</h3>
        <div className={styles.text}>
          <p>Ready to jump back in</p>
        </div>
      </div>

      {/* Personal Information  */}
      <div className={styles.companyinfobg}>
        {/* <div className={styles.heading1}>
          <h1>Personal Information</h1>
          {profileEdit ? (
            <FaEdit
              style={{ cursor: "pointer", color: "var(--primary-color)" }}
              onClick={handleEditClickPro}
            />
          ) : (
            <FaTimes
              style={{ cursor: "pointer", color: "var(--primary-color)" }}
              onClick={handleEditClickPro}
            />
          )}
        </div> */}

        <div className={styles.heading1}>
          <h1>Personal Information</h1>
          {profileEdit ? (
            <FaTimes
              style={{ cursor: 'pointer', color: 'var(--primary-color)' }}
              onClick={handleEditClickPro}
            />
          ) : (
            <FaEdit
              style={{ cursor: 'pointer', color: 'var(--primary-color)' }}
              onClick={handleEditClickPro}
            />
          )}
        </div>

        {profileEdit ? (
          // Render editable input fields
          <>
            {/* Qasim Image UPloader Start Code */}
            <Grid
              container
              rowSpacing={1}
              style={{ marginBottom: '1.5rem' }}
              columnSpacing={{ xs: 1, sm: 2, md: 3 }}
            >
              <Grid item xs={6}>
                <ImageUploader
                  isEmployerProfile
                  onFileChange={handleFileChange}
                  profileImage={profileData?.image}
                  clearProfileImage={clearProfileImage}
                />
              </Grid>
              <Grid item xs={6}>
                <div className={styles.text}>
                  <p>Max file size is 2MB And Suitable files are .jpg & .png</p>
                </div>
              </Grid>
            </Grid>
            <Grid
              container
              rowSpacing={1}
              columnSpacing={{ xs: 1, sm: 2, md: 3 }}
            >
              <Grid item xs={6}>
                <label className={styles['labels']}>First Name:</label>
                <ResumeInput
                  type="text"
                  name="first_name"
                  value={profileinformation?.first_name}
                  onChange={handleInputChangePro}
                  width="100%"
                />
              </Grid>
              <Grid item xs={6}>
                <label className={styles['labels']}>Last Name:</label>
                <ResumeInput
                  type="text"
                  name="last_name"
                  value={profileinformation?.last_name}
                  onChange={handleInputChangePro}
                  width="100%"
                />
              </Grid>
              <Grid item xs={6}>
                <label className={styles['labels']}>Email:</label>
                <ResumeInput
                  type="text"
                  name="email"
                  value={profileinformation?.email}
                  onChange={handleInputChangePro}
                  width="100%"
                />
              </Grid>
              <Grid item xs={6}>
                <label className={styles['labels']}>Phone:</label>
                <ResumeInput
                  type="text"
                  name="phone"
                  value={profileinformation?.phone}
                  onChange={handleInputChangePro}
                  width="100%"
                />
              </Grid>
            </Grid>
          </>
        ) : (
          <>
            <Grid
              container
              rowSpacing={3}
              // columnSpacing={{ xs: 1, sm: 2, md: 3 }}
              columnSpacing={0}
            >
              <Grid item xs={12}>
                {isloading ? (
                  <CustomSpinner />
                ) : (
                  <Avatar
                    alt="Profile Photo"
                    src={profileData?.image}
                    sx={{ width: 120, height: 120 }}
                  />
                )}
              </Grid>
              <Grid item xs={12} sm={12} md={4}>
                <div className={styles.heading}>
                  <h5>Username:</h5>
                </div>
                <div>
                  <p className={styles.valuepara}>
                    {profileData?.first_name && profileData?.last_name
                      ? `${profileData.first_name} ${profileData.last_name}`
                      : 'Full Name'}
                  </p>
                </div>
              </Grid>
              <Grid item xs={12} sm={12} md={4}>
                <div className={styles.heading}>
                  <h5>Emails</h5>
                </div>
                <div>
                  {' '}
                  <p className={styles.valuepara}>
                    {profileData?.email ? profileData?.email : 'This Email '}
                  </p>
                </div>
              </Grid>
              <Grid item xs={12} sm={12} md={4}>
                <div className={styles.heading}>
                  <h5>Phone</h5>
                </div>
                <div>
                  <p className={styles.valuepara}>
                    {' '}
                    {profileinformation?.phone
                      ? profileinformation?.phone
                      : '034000239'}
                  </p>
                </div>
              </Grid>
            </Grid>
          </>
        )}

        {isloading ? (
          <div style={{ marginTop: '1rem' }}>
            <CustomSpinner />
          </div>
        ) : (
          profileEdit && (
            <Grid item xs={6} marginTop={'1.5rem'}>
              <CustomButton
                marginTop={5}
                onClick={employerProfileUpdate}
                // width="13%"
                label="Update"
              />
            </Grid>
          )
        )}
      </div>

      <div className={styles.companyinfobg}>
        <div className={styles.heading1}>
          <h1>Company Info</h1>
          {/* <FontAwesomeIcon
            style={{ cursor: "pointer", color: "var(--primary-color)" }}
            onClick={handleEditClick}
            icon={editIconcom}
          /> */}

          {isEditing ? (
            <FaTimes
              style={{ cursor: 'pointer', color: 'var(--primary-color)' }}
              onClick={handleEditClick}
            />
          ) : (
            <FaEdit
              style={{ cursor: 'pointer', color: 'var(--primary-color)' }}
              onClick={handleEditClick}
            />
          )}
        </div>
        {isEditing ? (
          // Render editable input fields
          <div className={styles.allfeilds}>
            <Grid
              container
              style={{ marginBottom: '1.5rem' }}
              rowSpacing={1}
              columnSpacing={{ xs: 1, sm: 2, md: 3 }}
            >
              <Grid Grid item sm={12}>
                <ImageUploader
                  onFileChange={handleImageChange}
                  profileImage={formData?.image}
                  clearProfileImage={clearCompanyProfileImage}
                />
                {/* <input
                  type="file"
                  accept="image/*"
                  onChange={handleImageChange}
                  style={{
                    marginBottom: "30px",
                    padding: "2px",
                  }}
                />
                <img src={companylogo} height="50px" width="50px" /> */}
              </Grid>
            </Grid>
            <Grid
              container
              style={{ marginBottom: '1.5rem' }}
              rowSpacing={1}
              columnSpacing={{ xs: 1, sm: 2, md: 3 }}
            >
              {/* <div className={styles.labelandvalue}> */}
              <Grid item sm={12} md={6}>
                <label className={styles['labels']}>Email:</label>
                <ResumeInput
                  type="text"
                  name="email"
                  value={formData?.email}
                  onChange={handleInputChange}
                  width="100%"
                />
              </Grid>
              <Grid item sm={12} md={6}>
                <label className={styles['labels']}>Phone:</label>
                <ResumeInput
                  type="text"
                  name="phone"
                  value={formData?.phone}
                  onChange={handleInputChange}
                  width="100%"
                />
              </Grid>
              <Grid item sm={12} md={6}>
                <label className={styles['labels']}>Company Type:</label>
                <ResumeInput
                  type="text"
                  name="company_type"
                  value={formData?.company_type}
                  onChange={handleInputChange}
                  width="100%"
                />
              </Grid>
              <Grid item sm={12} md={6}>
                <label className={styles['labels']}>Company Name:</label>
                <ResumeInput
                  type="text"
                  name="company_name"
                  value={formData?.company_name}
                  onChange={handleInputChange}
                  width="100%"
                />
              </Grid>
            </Grid>
            <Grid
              container
              style={{ marginBottom: '1.5rem' }}
              rowSpacing={1}
              columnSpacing={{ xs: 1, sm: 2, md: 3 }}
            >
              <Grid item sm={12} md={6}>
                <label className={styles['labels']}>Company Industry:</label>
                <ResumeInput
                  type="text"
                  name="industry"
                  value={formData?.industry}
                  onChange={handleInputChange}
                  width="100%"
                />
              </Grid>
              <Grid item sm={12} md={6}>
                <label className={styles['labels']}>Address :</label>
                <ResumeInput
                  type="text"
                  name="address"
                  value={formData?.address}
                  onChange={handleInputChange}
                  width="100%"
                />
              </Grid>
            </Grid>
            <Grid
              container
              style={{ marginBottom: '1.5rem' }}
              rowSpacing={1}
              columnSpacing={{ xs: 1, sm: 2, md: 3 }}
            >
              <Grid item sm={12} md={6}>
                <label className={styles['labels']}>city :</label>
                <ResumeInput
                  type="text"
                  name="city"
                  value={formData?.city}
                  onChange={handleInputChange}
                  width="100%"
                />
              </Grid>
              <Grid item sm={12} md={6}>
                <label className={styles['labels']}>Website :</label>
                <ResumeInput
                  type="text"
                  name="website"
                  value={formData?.website}
                  onChange={handleInputChange}
                  width="100%"
                />
              </Grid>
            </Grid>
            <Grid
              container
              style={{ marginBottom: '1.5rem' }}
              rowSpacing={1}
              columnSpacing={{ xs: 1, sm: 2, md: 3 }}
            >
              <Grid item sm={12} md={6}>
                <label className={styles['labels']}>Ntn :</label>
                <ResumeInput
                  type="text"
                  name="ntn"
                  value={formData?.ntn}
                  onChange={handleInputChange}
                  width="100%"
                />
              </Grid>
              <Grid item sm={12} md={6}>
                <label className={styles['labels']}>Employees :</label>
                <ResumeInput
                  type="text"
                  name="employer_number"
                  value={formData?.employer_number}
                  onChange={handleInputChange}
                  width="100%"
                />
              </Grid>
            </Grid>
            <Grid item style={{ marginBottom: '1.5rem' }} xs={6}>
              <label className={styles['labels']}>OperatingSince :</label>
              <ResumeInput
                type="text"
                name="operating_since"
                value={formData?.operating_since}
                onChange={handleInputChange}
                width="100%"
              />
            </Grid>
          </div>
        ) : (
          <div>
            <Grid
              container
              rowSpacing={1}
              columnSpacing={{ xs: 1, sm: 2, md: 3 }}
            >
              {/* Company Logo Displaay only  */}
              <Grid item sm={12}>
                {isloading ? (
                  <div style={{ marginTop: '1rem' }}>
                    <CustomSpinner />
                  </div>
                ) : (
                  <Avatar
                    src={formData?.image}
                    alt="Company Logo"
                    sx={{ width: 120, height: 120 }}
                  />
                )}
              </Grid>
              <Grid item xs={12} md={6} sm={12}>
                <div className={styles.heading}>
                  <h5 className={styles['head_title']}>Email</h5>
                </div>
                <div>
                  <p className={styles.valuepara}>
                    {' '}
                    {formData?.email ? formData?.email : 'Company Email'}
                  </p>
                </div>
              </Grid>
              <Grid item xs={12} sm={12} md={6}>
                <div className={styles.heading}>
                  <h5 className={styles['head_title']}>Company Phone</h5>
                </div>
                <div>
                  <p className={styles.valuepara}>
                    {' '}
                    {formData?.phone ? formData?.phone : 'Company Phone'}
                  </p>
                </div>
              </Grid>
              <Grid item xs={12} md={6} sm={12}>
                <div className={styles.heading}>
                  <h5 className={styles['head_title']}>Company Name </h5>
                </div>
                <div>
                  <p className={styles.valuepara}>
                    {' '}
                    {formData?.company_name
                      ? formData?.company_name
                      : 'company Name'}
                  </p>
                </div>
              </Grid>
              <Grid item xs={12} sm={12} md={6}>
                <div className={styles.heading}>
                  <h5 className={styles['head_title']}>company Type</h5>
                </div>
                <div>
                  <p className={styles.valuepara}> {formData?.company_type}</p>
                </div>
              </Grid>
            </Grid>
            <Grid
              container
              rowSpacing={1}
              columnSpacing={{ xs: 1, sm: 2, md: 3 }}
            >
              <Grid item xs={12} sm={12} md={6}>
                <div className={styles.heading}>
                  <h5 className={styles.head_title}>industry</h5>
                </div>
                <div>
                  <p>{formData?.industry}</p>
                </div>
              </Grid>
              <Grid item xs={12} sm={12} md={6}>
                <div className={styles.heading}>
                  <h5 className={styles.head_title}>Address</h5>
                </div>
                <div>
                  <p>{formData?.address}</p>
                </div>
              </Grid>
            </Grid>
            <Grid
              container
              rowSpacing={1}
              columnSpacing={{ xs: 1, sm: 2, md: 3 }}
            >
              <Grid item xs={12} sm={12} md={6}>
                <div className={styles.heading}>
                  <h5 className={styles.head_title}>city</h5>
                </div>
                <div>
                  <p>{formData?.city}</p>
                </div>
              </Grid>
              <Grid item xs={12} sm={12} md={6}>
                <div className={styles.heading}>
                  <h5 className={styles.head_title}>Website</h5>
                </div>
                <div>
                  <p>{formData?.website}</p>
                </div>
              </Grid>
            </Grid>
            <Grid
              container
              rowSpacing={1}
              columnSpacing={{ xs: 1, sm: 2, md: 3 }}
            >
              <Grid item xs={12} sm={12} md={6}>
                <div className={styles.heading}>
                  <h5 className={styles.head_title}>Ntn</h5>
                </div>
                <>
                  <p>{formData?.ntn}</p>
                </>
              </Grid>
              {/* <div className={styles.heading}>
              <p>CompanyBackground</p>
              <p>{formData?.companyBackground}</p>
            </div> */}
              <Grid item xs={12} sm={12} md={6}>
                <div className={styles.heading}>
                  <h5 className={styles.head_title}>Employees</h5>
                </div>
                <>
                  <p>{formData?.employer_number}</p>
                </>
              </Grid>
              <Grid item xs={12} sm={12} md={6}>
                <div className={styles.heading}>
                  <h5 className={styles.head_title}>OperatingSince</h5>
                </div>
                <>
                  <p>{formData?.operating_since}</p>
                </>
              </Grid>
            </Grid>
          </div>
        )}

        {isloading ? (
          <div style={{ marginTop: '1rem' }}>
            <CustomSpinner />
          </div>
        ) : (
          isEditing && (
            <CustomButton
              marginTop={5}
              onClick={handleCompanyInfoUpdate}
              width={'100%'}
              label="Save"
            />
          )
        )}
      </div>
    </div>
  );
}

export default Profile;
