import React, { useEffect, useState } from 'react';
import { ResumeInput, ResumeSelect } from '../Input/TextInput';
import styles from './EmploymentStatusForm.module.css';
import UserApi from '../../Apis/UserApi';
import {
  EXPERIENCE_CHOICES,
  FUNCTIONAL_AREA_CHOICES,
  INDUSTRY_CHOICES,
  POSITION_CHOICES,
  SALARY_CHOICES,
  employmentStatusChoices,
} from '../../pages/Jsondata/Jsondata';
import Toast from '../Toast/Toast';
import CustomButton from '../Button/CustomButton';
import { FaEdit } from 'react-icons/fa';

function EmploymentStatusForm() {
  const userapi = UserApi();
  const [isFormVisible, setIsFormVisible] = useState(false);
  const [id, setid] = useState(null);
  const [isStatus, setisStatus] = useState(false);
  const [seeker, setseeker] = useState({
    employment_status: '',
    employment_experience: '',
    employment_position: '',
    seeking_industry: '',
    seeking_function: '',
    seeking_position: '',
    current_salary: '',
    expected_salary: '',
    area_of_expertise: '',
    employment_function: '',
  });

  const handleSeekerInput = (e) => {
    const { name, value } = e.target;
    setseeker({
      ...seeker,
      [name]: value,
    });
  };

  const handleseeker = (event) => {
    const { name, value } = event.target;
    setseeker({
      ...seeker,
      [name]: value,
    });
  };

  const toggleFormVisibility = () => {
    setIsFormVisible(!isFormVisible);
  };

  const [errorMessages, setErrorMessages] = useState({
    employment_status: seeker.employment_status,
    employment_experience: seeker.employment_experience,
    employment_position: seeker.employment_position,
    seeking_industry: seeker.seeking_industry,
    seeking_function: seeker.seeking_function,
    seeking_position: seeker.seeking_position,
    current_salary: seeker.current_salary,
    expected_salary: seeker.expected_salary,
    area_of_expertise: seeker.area_of_expertise,
    employment_function: seeker.employment_function,
  });

  const validateEmployeeStatus = () => {
    const newErrorMessages = { ...errorMessages };
    let hasError = false;
    // Validation logic here, similar to what you have in ExperienceFun
    // Check each input field for empty values
    Object.keys(seeker).forEach((fieldName) => {
      if (seeker[fieldName] === '') {
        newErrorMessages[fieldName] = 'This field is required.';
        hasError = true;
      } else {
        newErrorMessages[fieldName] = '';
      }
    });
    if (!seeker.employment_status) {
      newErrorMessages.employment_status = 'Employee Statud is required.';
      hasError = true;
    } else {
      newErrorMessages.employment_status = '';
    }
    if (!seeker.employment_function) {
      newErrorMessages.employment_function = 'employment function is required.';
      hasError = true;
    } else {
      newErrorMessages.employment_function = '';
    }
    if (!seeker.employment_position) {
      newErrorMessages.employment_position = 'Expertise field is required.';
      hasError = true;
    } else {
      newErrorMessages.employment_position = '';
    }
    if (!seeker.seeking_industry) {
      newErrorMessages.seeking_industry = 'Please select Industry';
      hasError = true;
    } else {
      newErrorMessages.seeking_industry = '';
    }
    if (!seeker.seeking_function) {
      newErrorMessages.seeking_function = 'Please select funtion';
      hasError = true;
    } else {
      newErrorMessages.seeking_function = '';
    }
    if (!seeker.seeking_position) {
      newErrorMessages.seeking_position = 'Please select position';
      hasError = true;
    } else {
      newErrorMessages.seeking_position = '';
    }
    if (!seeker.current_salary) {
      newErrorMessages.current_salary = 'Please select current salary';
      hasError = true;
    } else {
      newErrorMessages.current_salary = '';
    }
    if (!seeker.expected_salary) {
      newErrorMessages.expected_salary = 'Please select expected Salary';
      hasError = true;
    } else {
      newErrorMessages.expected_salary = '';
    }
    setErrorMessages(newErrorMessages);
    return !hasError;
  };

  const jobSeekerAndCurrent = async (e) => {
    e.preventDefault();
    if (!validateEmployeeStatus()) {
      return;
    }
    try {
      const response = await userapi.employmentStatusPost(seeker);
      employmentStatusGet();
      Toast.success('Employment Status!');
      setseeker({
        employment_status: '',
        employment_experience: '',
        employment_position: '',
        seeking_industry: '',
        seeking_function: '',
        seeking_position: '',
        current_salary: '',
        expected_salary: '',
        area_of_expertise: '',
        employment_function: '',
      });
      toggleFormVisibility();
    } catch (error) {
      console.error('ERROR in employer status post', error);
    }
    setseeker({
      employment_status: '',
      employment_experience: '',
      employment_position: '',
      seeking_industry: '',
      seeking_function: '',
      seeking_position: '',
      current_salary: '',
      expected_salary: '',
      area_of_expertise: '',
      employment_function: '',
    });

    // toggleFormVisibility();
  };
  // Data Get

  const employmentStatusGet = async () => {
    try {
      const response = await userapi.employmentStatusGet();
      if (response[0]?.id) {
        if (response[0].id) {
          setseeker(response[0]);
          setid(response[0]?.id);
        } else {
          setisStatus(true);
        }
      }
    } catch (error) {
      console.error('Error in employer statut get', error);
    }
  };

  // Update Employnment Data
  const employmentStatusUpdate = async (e) => {
    e.preventDefault();
    if (!validateEmployeeStatus()) {
      return;
    }
    try {
      const response = await userapi.employmentStatusUpdate(id, seeker);
      employmentStatusGet();
      Toast.success('Employment Updated!');
      setseeker({
        employment_status: '',
        employment_experience: '',
        employment_position: '',
        seeking_industry: '',
        seeking_function: '',
        seeking_position: '',
        current_salary: '',
        expected_salary: '',
        area_of_expertise: '',
        employment_function: '',
      });
      toggleFormVisibility();
    } catch (error) {
      console.error('ERROR in employer stutus update', error);
    }
  };

  useEffect(() => {
    employmentStatusGet();
  }, []);
  return (
    <div>
      {isFormVisible ? (
        <form onSubmit={jobSeekerAndCurrent}>
          <div className={styles.formContainer}>
            <div>
              <h5 style={{ textAlign: 'left', marginLeft: 15 }}>
                Current Status
              </h5>
            </div>
            <div className={styles.fieldsContainer}>
              <div>
                <label htmlFor="">employment-status</label>
                <ResumeSelect
                  title={
                    seeker.employment_status
                      ? seeker.employment_status
                      : 'Employment_status'
                  }
                  options={employmentStatusChoices}
                  name="employment_status"
                  value={seeker.employment_status}
                  onChange={handleseeker}
                  marginLeft="10px"
                  marginRight="10px"
                />

                {errorMessages.employment_status && (
                  <p className={styles.errorMessage}>
                    {errorMessages.employment_status}
                  </p>
                )}
              </div>
              <div className={styles.inputField}>
                <ResumeSelect
                  title={
                    seeker.employment_function
                      ? seeker.employment_function
                      : 'Function'
                  }
                  options={FUNCTIONAL_AREA_CHOICES}
                  name="employment_function"
                  value={seeker.employment_function}
                  onChange={handleseeker}
                  marginLeft="10px"
                  marginRight="10px"
                />
                {errorMessages.employment_function && (
                  <p className={styles.errorMessage}>
                    {errorMessages.employment_function}
                  </p>
                )}
              </div>
              <div className={styles.inputField}>
                <ResumeSelect
                  title={
                    seeker.employment_experience
                      ? seeker.employment_experience
                      : 'Experience'
                  }
                  options={EXPERIENCE_CHOICES}
                  name="employment_experience"
                  value={seeker.employment_experience}
                  onChange={handleseeker}
                  marginLeft="10px"
                  marginRight="10px"
                />
                {errorMessages.employment_experience && (
                  <p className={styles.errorMessage}>
                    {errorMessages.employment_experience}
                  </p>
                )}
              </div>
              <div className={styles.inputField}>
                <ResumeSelect
                  title={
                    seeker.employment_position
                      ? seeker.employment_position
                      : 'Position'
                  }
                  options={POSITION_CHOICES}
                  name="employment_position"
                  value={seeker.employment_position}
                  onChange={handleseeker}
                  marginLeft="10px"
                  marginRight="10px"
                />
                {errorMessages.employment_position && (
                  <p className={styles.errorMessage}>
                    {errorMessages.employment_position}
                  </p>
                )}
              </div>
            </div>
            <div>
              <h5 style={{ textAlign: 'left', marginLeft: 15 }}>
                Seeking Job Detail
              </h5>
            </div>
            <div className={styles.fieldsContainer}>
              <div className={styles.inputField}>
                <ResumeSelect
                  title={
                    seeker.seeking_industry
                      ? seeker.seeking_industry
                      : 'Industry'
                  }
                  options={INDUSTRY_CHOICES}
                  name="seeking_industry"
                  value={seeker.seeking_industry}
                  onChange={handleseeker}
                  marginLeft="10px"
                  marginRight="10px"
                />
                {errorMessages.seeking_industry && (
                  <p className={styles.errorMessage}>
                    {errorMessages.seeking_industry}
                  </p>
                )}
              </div>
              <div className={styles.inputField}>
                <ResumeSelect
                  title={
                    seeker.seeking_function
                      ? seeker.seeking_function
                      : 'Function'
                  }
                  options={FUNCTIONAL_AREA_CHOICES}
                  name="seeking_function"
                  value={seeker.seeking_function}
                  onChange={handleseeker}
                  marginLeft="10px"
                  marginRight="10px"
                />
                {errorMessages.seeking_function && (
                  <p className={styles.errorMessage}>
                    {errorMessages.seeking_function}
                  </p>
                )}
              </div>
              <div className={styles.inputField}>
                <ResumeSelect
                  title={
                    seeker.seeking_position
                      ? seeker.seeking_position
                      : 'Position Seeking'
                  }
                  options={POSITION_CHOICES}
                  name="seeking_position"
                  value={seeker.seeking_position}
                  onChange={handleseeker}
                  marginLeft="10px"
                  marginRight="10px"
                />
                {errorMessages.seeking_position && (
                  <p className={styles.errorMessage}>
                    {errorMessages.seeking_position}
                  </p>
                )}
              </div>
            </div>
            <div className={styles.fieldsContainer}>
              <div className={styles.inputField}>
                <ResumeSelect
                  title={
                    seeker.current_salary
                      ? seeker.current_salary
                      : 'Current Salary (USD)'
                  }
                  options={SALARY_CHOICES}
                  name="current_salary"
                  value={seeker.current_salary}
                  onChange={handleseeker}
                  marginLeft="10px"
                  marginRight="10px"
                />
                {errorMessages.current_salary && (
                  <p className={styles.errorMessage}>
                    {errorMessages.current_salary}
                  </p>
                )}
              </div>
              <div className={styles.inputField}>
                <ResumeSelect
                  title={
                    seeker.expected_salary
                      ? seeker.expected_salary
                      : 'Expected Salary (USD)'
                  }
                  options={SALARY_CHOICES}
                  name="expected_salary"
                  value={seeker.expected_salary}
                  onChange={handleseeker}
                  marginLeft="10px"
                  marginRight="10px"
                />
                {errorMessages.expected_salary && (
                  <p className={styles.errorMessage}>
                    {errorMessages.expected_salary}
                  </p>
                )}
              </div>
              <div className={styles.inputField}>
                <ResumeInput
                  marginTop={5}
                  marginRight={20}
                  marginLeft={10}
                  width="98.5%"
                  placeholder="Area of Expertise (Comma Seperated)"
                  name="area_of_expertise"
                  onChange={handleSeekerInput}
                  value={seeker.area_of_expertise}
                />
                {errorMessages.area_of_expertise && (
                  <p className={styles.errorMessage}>
                    {errorMessages.area_of_expertise}
                  </p>
                )}
              </div>
            </div>
            {isStatus ? (
              <CustomButton
                style={{
                  backgroundColor: 'gray',
                  padding: 5,
                  borderRadius: 20,
                  color: 'white',
                  marginLeft: 15,
                  width: 100,
                  marginTop: 15,
                }}
                onClick={jobSeekerAndCurrent}
                label={'Save'}
              />
            ) : (
              <CustomButton
                style={{
                  backgroundColor: 'gray',
                  padding: 5,
                  borderRadius: 20,
                  color: 'white',
                  marginLeft: 15,
                  width: 100,
                  marginTop: 15,
                }}
                onClick={employmentStatusUpdate}
                // onClick={jobSeekerAndCurrent}
                label={'Update'}
              />
            )}
          </div>
        </form>
      ) : (
        <div className="">
          <div className="w-full p-4">
            <div className="border border-gray-300 p-4 rounded-lg shadow-lg">
              <div className="ml-8 my-3">
                <div style={{ display: 'flex' }}>
                  <p>{`Employment Status:
                   ${
                     seeker?.employment_status
                       ? seeker?.employment_status
                       : 'Not Added Yet!'
                   }
                  `}</p>
                  <p>{`Employment Function:  ${
                    seeker?.employment_function
                      ? seeker?.employment_function
                      : 'Not Added Yet!'
                  }`}</p>
                  <p>{`Employment Experience:  ${
                    seeker?.employment_experience
                      ? seeker?.employment_experience
                      : 'Not Added Yet!'
                  }`}</p>
                  <p>{`Position:  ${
                    seeker?.employment_position
                      ? seeker?.employment_position
                      : 'Not Added Yet!'
                  }`}</p>
                  <p>{`Seeking Industry:  ${
                    seeker?.seeking_industry
                      ? seeker?.seeking_industry
                      : 'Not Added Yet!'
                  }`}</p>
                </div>
                <div>
                  <p>{`Function:  ${
                    seeker?.seeking_function
                      ? seeker?.seeking_function
                      : 'Not Added Yet!'
                  }`}</p>
                  <p>{`Seeking Position:  ${
                    seeker?.seeking_position
                      ? seeker?.seeking_position
                      : 'Not Added Yet!'
                  }`}</p>
                  <p>{`Current Salary:  ${
                    seeker?.current_salary
                      ? seeker?.current_salary
                      : 'Not Added Yet!'
                  }`}</p>
                  <p>{`Expected Salary:  ${
                    seeker?.expected_salary
                      ? seeker?.expected_salary
                      : 'Not Added Yet!'
                  }`}</p>
                  <p>{`Expertise:  ${
                    seeker?.area_of_expertise
                      ? seeker?.area_of_expertise
                      : 'Not Added Yet!'
                  }`}</p>
                </div>
              </div>
              <div className="ms-8">
                <FaEdit
                  onClick={toggleFormVisibility}
                  // icon={faEdit}
                  style={{ cursor: 'pointer' }}
                />
                {/* <FontAwesomeIcon
                  onClick={() => {
                    // Deletequalification(qualification.id);
                  }}
                  icon={faTrash}
                  style={{ cursor: "pointer", marginLeft: 10 }}
                /> */}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
export default EmploymentStatusForm;
