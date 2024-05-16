import React, { useEffect, useState } from 'react';
import { ResumeSelect } from '../Input/TextInput';
import styles from '../EmploymentStatusForm/EmploymentStatusForm.module.css';
import style from '../../../src/pages/User/Hprofile/hprofile.module.css';
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
import CustomSpinner from '../Spinner/Spinner';
function EmploymentStatusForm({ onUpdate }) {
  const userapi = UserApi();
  const [isFormVisible, setIsFormVisible] = useState(false);
  const [isloading, setIsloading] = useState(false);
  const [id, setid] = useState(null);
  const [inputLanguage, setInputLanguage] = useState('');
  const [languages, setLanguages] = useState([]);
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
    // area_of_expertise: languages,
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
    seeking_industry: seeker.seeking_industry,
    seeking_function: seeker.seeking_function,
    seeking_position: seeker.seeking_position,
    current_salary: seeker.current_salary,
    expected_salary: seeker.expected_salary,
    area_of_expertise: seeker.area_of_expertise,
  });
  const validateEmployeeStatus = () => {
    const newErrorMessages = { ...errorMessages };
    let hasError = false;
    // Validation logic here, similar to what you have in ExperienceFun
    // Check each input field for empty values
    // Object.keys(seeker).forEach((fieldName) => {
    //   if (seeker[fieldName] === "") {
    //     newErrorMessages[fieldName] = "This field is required.";
    //     hasError = true;
    //   } else {
    //     newErrorMessages[fieldName] = "";
    //   }
    // });

    if (!seeker.employment_status) {
      newErrorMessages.employment_status = 'Employee Statud is required.';
      hasError = true;
    } else {
      newErrorMessages.employment_status = '';
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
    // e.preventDefault();
    setIsloading(true);
    // if (!validateEmployeeStatus()) {
    //   setIsloading(false);
    //   return;
    // }
    const data = {
      employment_status: seeker.employment_status,
      employment_experience: seeker.employment_experience
        ? seeker.employment_experience
        : 'N/A',
      employment_position: seeker.employment_position
        ? seeker.employment_position
        : 'N/A',
      employment_function: seeker.employment_function
        ? seeker.employment_function
        : 'N/A',
      seeking_industry: seeker.seeking_industry,
      seeking_function: seeker.seeking_function,
      seeking_position: seeker.seeking_position,
      current_salary: seeker.current_salary ? seeker.current_salary : 'N/A',
      expected_salary: seeker.expected_salary,
    };
    try {
      const response = await userapi.employmentStatusPost(data);
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
        // area_of_expertise: "",
        employment_function: '',
      });
      onUpdate();
      toggleFormVisibility();
      setIsloading(false);
    } catch (error) {
      setIsloading(false);
      console.error('ERROR in employment status post', error);
    }
    // setseeker({
    //   employment_status: "",
    //   employment_experience: "",
    //   employment_position: "",
    //   seeking_industry: "",
    //   seeking_function: "",
    //   seeking_position: "",
    //   current_salary: "",
    //   expected_salary: "",
    //   // area_of_expertise: "",
    //   employment_function: "",
    // });
  };

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
      console.error('Error im Emeployement Status get', error);
    }
  };
  const employmentStatusUpdate = async (e) => {
    setIsloading(true);
    e.preventDefault();
    if (!validateEmployeeStatus()) {
      return;
    }
    const data = {
      employment_status: seeker.employment_status,
      employment_experience:
        seeker.employment_status === 'Fresh'
          ? 'N/A'
          : seeker.employment_experience
            ? seeker.employment_experience
            : 'N/A',
      employment_position:
        seeker.employment_status === 'Fresh'
          ? 'N/A'
          : seeker.employment_position
            ? seeker.employment_position
            : 'N/A',
      employment_function:
        seeker.employment_status === 'Fresh'
          ? 'N/A'
          : seeker.employment_function
            ? seeker.employment_function
            : 'N/A',
      seeking_industry: seeker.seeking_industry,
      seeking_function: seeker.seeking_function,
      seeking_position: seeker.seeking_position,
      current_salary:
        seeker.employment_status === 'Fresh' ? 'N/A' : seeker.current_salary,
      expected_salary: seeker.expected_salary,
    };
    try {
      const response = await userapi.employmentStatusUpdate(id, data);
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
      onUpdate();
      toggleFormVisibility();
      setIsloading(false);
    } catch (error) {
      setIsloading(false);
      console.error('ERROR in employement statut update', error);
    }
  };

  useEffect(() => {
    employmentStatusGet();
  }, []);

  return (
    <section className={style.myProfile_box}>
      <div className={style.boxHeadign}>
        <div>
          <h5>Employment Status</h5>
        </div>
        <div className={style.addEducation}>
          <button
            title="Add New"
            className="group cursor-pointer outline-none hover:rotate-90 duration-300"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="15px"
              height="15px"
              viewBox="0 0 24 24"
              className="stroke-red-400 fill-none group-hover:fill-red-200 group-active:stroke-red-800 group-active:fill-red-800 group-active:duration-0 duration-300"
            >
              <path
                d="M12 22C17.5 22 22 17.5 22 12C22 6.5 17.5 2 12 2C6.5 2 2 6.5 2 12C2 17.5 6.5 22 12 22Z"
                strokeWidth="1.5"
              ></path>
              <path d="M8 12H16" strokeWidth="1.5"></path>
              <path d="M12 16V8" strokeWidth="1.5"></path>
            </svg>
          </button>
          <a id="addEducation" onClick={toggleFormVisibility}>
            Add Status
          </a>
        </div>
      </div>
      {isFormVisible ? (
        <div>
          <div>
            <h5 style={{ textAlign: 'left', marginBottom: 20 }}>
              Current Status
            </h5>
          </div>
          <div className="row">
            <div className="col-md-6 mb-3">
              <label className="mb-2">Employment Status</label>
              <ResumeSelect
                title={
                  seeker.employment_status
                    ? seeker.employment_status
                    : 'Employment status'
                }
                options={employmentStatusChoices}
                name="employment_status"
                value={seeker.employment_status}
                onChange={handleseeker}
                marginLeft="10px"
                marginRight="10px"
                backgroundColor="var(--alice-blue)"
              />

              {errorMessages.employment_status && (
                <p className={styles.errorMessage}>
                  {errorMessages.employment_status}
                </p>
              )}
            </div>
            <div className="col-md-6 mb-3">
              <label className="mb-2">Employment Function</label>
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
                backgroundColor="var(--alice-blue)"
                disabled={seeker.employment_status === 'Fresh'}
              />
              {errorMessages.employment_function && (
                <p className={styles.errorMessage}>
                  {errorMessages.employment_function}
                </p>
              )}
            </div>
          </div>
          <div className="row">
            <div className="col-md-6 mb-3">
              <label className="mb-2">Employment Experience</label>
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
                backgroundColor="var(--alice-blue)"
                disabled={seeker.employment_status === 'Fresh'}
              />
              {errorMessages.employment_experience && (
                <p className={styles.errorMessage}>
                  {errorMessages.employment_experience}
                </p>
              )}
            </div>
            <div className="col-md-6 mb-3">
              <label className="mb-2">Employment Position</label>
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
                backgroundColor="var(--alice-blue)"
                disabled={seeker.employment_status === 'Fresh'}
              />
              {errorMessages.employment_position && (
                <p className={styles.errorMessage}>
                  {errorMessages.employment_position}
                </p>
              )}
            </div>
            <div className="col-md-12 mb-3">
              <label className="mb-2">Current Salary</label>
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
                backgroundColor="var(--alice-blue)"
                disabled={seeker.employment_status === 'Fresh'}
              />
              {errorMessages.current_salary && (
                <p className={styles.errorMessage}>
                  {errorMessages.current_salary}
                </p>
              )}
            </div>
          </div>
          <div>
            <h5 style={{ textAlign: 'left', marginBottom: 20 }}>
              Seeking Job Detail
            </h5>
          </div>
          <div className="row">
            <div className="col-md-6 mb-3">
              <label className="mb-2">Seeking Industry</label>
              <ResumeSelect
                title={
                  seeker.seeking_industry ? seeker.seeking_industry : 'Industry'
                }
                options={INDUSTRY_CHOICES}
                name="seeking_industry"
                value={seeker.seeking_industry}
                onChange={handleseeker}
                marginLeft="10px"
                marginRight="10px"
                backgroundColor="var(--alice-blue)"
              />
              {errorMessages.seeking_industry && (
                <p className={styles.errorMessage}>
                  {errorMessages.seeking_industry}
                </p>
              )}
            </div>
            <div className="col-md-6 mb-3">
              <label className="mb-2">Seeking Function</label>
              <ResumeSelect
                title={
                  seeker.seeking_function ? seeker.seeking_function : 'Function'
                }
                options={FUNCTIONAL_AREA_CHOICES}
                name="seeking_function"
                value={seeker.seeking_function}
                onChange={handleseeker}
                marginLeft="10px"
                marginRight="10px"
                backgroundColor="var(--alice-blue)"
              />
              {errorMessages.seeking_function && (
                <p className={styles.errorMessage}>
                  {errorMessages.seeking_function}
                </p>
              )}
            </div>
          </div>
          <div className="row">
            <div className="col-md-6 mb-3">
              <label className="mb-2">Seeking Position</label>
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
                backgroundColor="var(--alice-blue)"
              />
              {errorMessages.seeking_position && (
                <p className={styles.errorMessage}>
                  {errorMessages.seeking_position}
                </p>
              )}
            </div>
            {/* <div className="col-md-6 mb-3">
              <label className="mb-2">Current Salary</label>
              <ResumeSelect
                title={
                  seeker.current_salary
                    ? seeker.current_salary
                    : "Current Salary (USD)"
                }
                options={SALARY_CHOICES}
                name="current_salary"
                value={seeker.current_salary}
                onChange={handleseeker}
                marginLeft="10px"
                marginRight="10px"
                backgroundColor="var(--alice-blue)"
              />
              {errorMessages.current_salary && (
                <p className={styles.errorMessage}>
                  {errorMessages.current_salary}
                </p>
              )}
            </div> */}
            <div className="col-md-6 mb-3">
              <label className="mb-2">Expected Salary</label>
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
                backgroundColor="var(--alice-blue)"
              />
              {errorMessages.expected_salary && (
                <p className={styles.errorMessage}>
                  {errorMessages.expected_salary}
                </p>
              )}
            </div>
          </div>

          {/* <div className="row">
            <div className="col-md-6 mb-3">
              <label className="mb-2">Expected Salary</label>
              <ResumeSelect
                title={
                  seeker.expected_salary
                    ? seeker.expected_salary
                    : "Expected Salary (USD)"
                }
                options={SALARY_CHOICES}
                name="expected_salary"
                value={seeker.expected_salary}
                onChange={handleseeker}
                marginLeft="10px"
                marginRight="10px"
                backgroundColor="var(--alice-blue)"
              />
              {errorMessages.expected_salary && (
                <p className={styles.errorMessage}>
                  {errorMessages.expected_salary}
                </p>
              )}
            </div>
          </div> */}

          {isloading ? (
            <CustomSpinner />
          ) : id ? (
            <div
              style={{
                display: 'flex',
                flexDirection: 'row',
                marginTop: '.5rem',
                marginBottom: '.5rem',
              }}
            >
              <CustomButton label="Update" onClick={employmentStatusUpdate} />
              <CustomButton label="Cancel" onClick={toggleFormVisibility} />
            </div>
          ) : (
            <div
              style={{
                display: 'flex',
                flexDirection: 'row',
                marginTop: '.5rem',
                marginBottom: '.5rem',
              }}
            >
              <CustomButton label="Save" onClick={jobSeekerAndCurrent} />
              <CustomButton label="Cancel" onClick={toggleFormVisibility} />
            </div>
          )}
        </div>
      ) : (
        <div>
          <div className="w-full p-4">
            <div className="ml-8 my-3 row">
              <div className="col-md-6">
                <h6>Employment Status:</h6>
                <p className="mb-4">
                  {seeker?.employment_status
                    ? seeker?.employment_status
                    : 'Not Added Yet!'}
                </p>
                <h6>Employment Function:</h6>
                <p className="mb-4">
                  {seeker?.employment_function
                    ? seeker?.employment_function
                    : 'Not Added Yet!'}
                  `
                </p>
                <h6>Employment Experience:</h6>
                <p className="mb-4">
                  {seeker?.employment_experience
                    ? seeker?.employment_experience
                    : 'Not Added Yet!'}
                </p>

                <h6>Position:</h6>
                <p className="mb-4">
                  {seeker?.employment_position
                    ? seeker?.employment_position
                    : 'Not Added Yet!'}
                </p>

                <h6>Seeking Industry:</h6>
                <p className="mb-4">
                  {seeker?.seeking_industry
                    ? seeker?.seeking_industry
                    : 'Not Added Yet!'}
                </p>
              </div>
              <div className="col-md-6">
                <h6>Function:</h6>
                <p className="mb-4">
                  {seeker?.seeking_function
                    ? seeker?.seeking_function
                    : 'Not Added Yet!'}
                </p>
                <h6>Seeking Position:</h6>
                <p className="mb-4">
                  {seeker?.seeking_position
                    ? seeker?.seeking_position
                    : 'Not Added Yet!'}
                </p>
                <h6>Current Salary:</h6>
                <p className="mb-4">
                  {' '}
                  {seeker?.current_salary
                    ? `Rs ${seeker?.current_salary}`
                    : 'Not Added Yet!'}
                </p>
                <h6>Expected Salary:</h6>
                <p className="mb-4">
                  {seeker?.expected_salary
                    ? `Rs ${seeker?.expected_salary}`
                    : 'Not Added Yet!'}
                </p>
              </div>
            </div>
          </div>
        </div>
      )}
    </section>
  );
}
export default EmploymentStatusForm;
