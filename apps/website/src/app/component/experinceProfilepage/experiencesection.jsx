import { FaEdit } from 'react-icons/fa';
import { ImBin } from 'react-icons/im';
import { IoIosAddCircleOutline } from 'react-icons/io';

import { Checkbox, FormControlLabel } from '@mui/material';
import React, { useEffect, useState } from 'react';
import style from '../../pages/User/Hprofile/hprofile.module.css';
import UserApi from '../../Apis/UserApi';
import { employmentStatusChoices } from '../../pages/Jsondata/Jsondata';
import AutoCompleteInput from '../AutoCompleteInput/AutoCompleteInput';
import CustomButton from '../Button/CustomButton';
import { ResumeInput, ResumeSelect } from '../Input/TextInput';
import styless from '../Profilecards/Profilecards.module.css';
import CustomSpinner from '../Spinner/Spinner';
import Toast from '../Toast/Toast';
import ReactQuill from 'react-quill';
import JobDescriptionComponent from '../JobDescription/JobDescriptionComponent';
function UserExperience({ onUpdate }) {
  const [isloading, setIsloading] = useState(false);
  const userapi = UserApi();
  const [isFormVisible, setFormVisibility] = useState(false);
  const [isupdate, setIsupdate] = useState(false);
  const [id, setid] = useState(null);
  const [countries, setcountries] = useState([]);
  const [ispresent, setispresent] = useState(false);
  const [addExperiences, setaddExperiences] = useState({
    company: '',
    position: '',
    country: '',
    description: '',
    employment_status: '',
  });
  const [dateValues, setDateValues] = useState({
    period_from: null,
    period_to: null,
  });
  const [AllExperice, setAllExperice] = useState([]);

  const handleDateChange = (date, field) => {
    const updatedDateValues = { ...dateValues };
    updatedDateValues[field] = date;
    setDateValues(updatedDateValues);
    validateExperience();
  };
  const [errorMessages, setErrorMessages] = useState({
    company: addExperiences.company,
    position: addExperiences.position,
    country: addExperiences.country,
    city: addExperiences.city,
    period_from: dateValues.period_from,
    period_to: dateValues.period_to,
    description: addExperiences.description,
  });
  const validateExperience = () => {
    const newErrorMessages = { ...errorMessages };
    let hasError = false;
    // Check each input field for empty values
    Object.keys(addExperiences).forEach((fieldName) => {
      if (addExperiences[fieldName] === '') {
        newErrorMessages[fieldName] = 'This field is required.';
        hasError = true;
      } else {
        newErrorMessages[fieldName] = '';
      }
    });
    if (!addExperiences.company) {
      newErrorMessages.company = 'Company name is required.';
      hasError = true;
    } else {
      newErrorMessages.company = '';
    }
    if (!addExperiences.position) {
      newErrorMessages.position = 'Position is required.';
      hasError = true;
    } else {
      newErrorMessages.position = '';
    }
    if (!addExperiences.country) {
      newErrorMessages.country = 'Country name is required.';
      hasError = true;
    } else {
      newErrorMessages.country = '';
    }
    if (!addExperiences.city) {
      newErrorMessages.city = 'City name is required.';
      hasError = true;
    } else {
      newErrorMessages.city = '';
    }
    if (!addExperiences.description) {
      newErrorMessages.description = 'Description  name is required.';
      hasError = true;
    } else {
      newErrorMessages.description = '';
    }

    if (!dateValues.period_from) {
      newErrorMessages.period_from = 'Joining date is required.';
      hasError = true;
    } else {
      newErrorMessages.period_from = '';
    }
    if (!dateValues.period_to) {
      newErrorMessages.period_to = 'Last date is required.';
      hasError = true;
    } else {
      newErrorMessages.period_to = '';
    }

    setErrorMessages(newErrorMessages);
    return !hasError;
  };
  const [totoalExperience, settotoalExperience] = useState([]);
  const ExperienceFun = async (e) => {
    setIsloading(true);
    e.preventDefault();
    if (addExperiences.company && addExperiences.position) {
      try {
        setIsloading(true);
        const newExperience = {
          company: addExperiences.company,
          position: addExperiences.position,
          country: addExperiences.country,
          period_from: dateValues.period_from,
          period_to: dateValues.period_to,
          description: addExperiences?.description,
          currently_working: ispresent,
          employment_status: addExperiences.employment_status,
          //   seeker: 16,
        };
        settotoalExperience((preExperience) => [
          ...preExperience,
          newExperience,
        ]);
        const reponse = await userapi.UserExperince(newExperience);
        Toast.success('Experince Added!');
        setIsloading(false);
        setaddExperiences({
          company: '',
          position: '',
          country: '',
          description: '',
        });
        setDateValues({ period_from: null, period_to: null });
        onUpdate();
        UserExperinceGet();
        setFormVisibility(false);
      } catch (error) {
        setIsloading(false);
        console.error('Error in user experience', error);
        Toast.error('Try later!');
      }
    } else {
      setIsloading(false);
      Toast.error('Please Complete The Form');
    }
  };
  const handleExperience = (event) => {
    const { name, value } = event.target;
    setaddExperiences({
      ...addExperiences,
      [name]: value,
    });
    validateExperience();
  };
  const handleEditorChange = (value) => {
    setaddExperiences({
      ...addExperiences,
      description: value,
    });
  };
  const handleChange = (event) => {
    setispresent(event.target.checked);
  };

  const toggleFormVisibility = () => {
    setFormVisibility(!isFormVisible);
    setid(null);
    setispresent(false);
    setaddExperiences({
      company: '',
      position: '',
      country: '',
      description: '',
      employment_status: '',
    });
    setDateValues({ period_from: null, period_to: null });
  };

  const UserExperinceGet = async () => {
    try {
      const reponse = await userapi.UserExperinceGet();
      setAllExperice(reponse);
    } catch (error) {
      console.error('Error user experience get', error);
    }
  };

  const DeleteExperience = async (id) => {
    // e.preventDefault();
    try {
      const reponse = await userapi.UserExperinceDelete(id);
      Toast.success('Experince Deleted!');
      UserExperinceGet();
      onUpdate();
    } catch (error) {
      console.error('Error in use experience delete', error);
      Toast.error('Please Try Later!');
    }
  };
  const EditExperience = async (qualification) => {
    try {
      setIsupdate(true);
      setid(qualification?.id);
      setFormVisibility(true);
      setaddExperiences({
        company: qualification.company,
        position: qualification.position,
        country: qualification?.country,
        description: qualification.description,
        employment_status: qualification.employment_status,
      });
      setispresent(qualification?.currently_working);
      setDateValues({
        period_from: qualification.period_from,
        period_to: qualification.period_to,
      });
    } catch (error) {
      console.error('Error in edit experince', error);
    }

    const experSection = document.getElementById('experSection');
    if (experSection) {
      experSection.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  };

  const onUpdateButtonClick = async (e) => {
    setIsloading(true);
    e.preventDefault();
    // if (!validateExperience()) {
    //   return;
    // }
    if (!ispresent && !dateValues?.period_to) {
      Toast.error('Ending Date is Required');
      setIsloading(false);
      return;
    }
    const updateData = {
      company: addExperiences?.company,
      position: addExperiences?.position,
      country: addExperiences?.country,
      period_from: dateValues?.period_from,
      period_to: dateValues?.period_to,
      description: addExperiences?.description,
      currently_working: ispresent,
      employment_status: addExperiences?.employment_status,
    };
    try {
      const response = await userapi.UserExperinceUpdate(id, updateData);
      setFormVisibility(false);
      UserExperinceGet();
      Toast.success('Experince Update!');
      setaddExperiences({
        company: '',
        position: '',
        country: '',
        city: '',
        description: '',
        employment_status: '',
      });
      setIsloading(false);
      setispresent(false);
      setDateValues({ period_from: null, period_to: null });
      onUpdate();
    } catch (error) {
      console.error('Error Exeperience update', error);
      Toast.error(' All Feilds Are Required');
      setIsloading(false);
    }
  };
  const countriesApi = async () => {
    try {
      let response = await userapi.getCountries();
      setcountries(response);
    } catch (error) {
      console.error('Error in Find Job', error);
    }
  };

  useEffect(() => {
    countriesApi();
    UserExperinceGet();
  }, []);

  return (
    <section className={style.myProfile_box} id="experSection">
      <div className={style.boxHeadign}>
        <div>
          <h5>Experience</h5>
        </div>
        <div className={style.addEducation}>
          <button
            title="Add New"
            className="group cursor-pointer outline-none hover:rotate-90 duration-300"
          >
            {/* <svg
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
            </svg> */}
            <IoIosAddCircleOutline style={{ color: 'red' }} />
          </button>
          {isFormVisible ? (
            <a id="addEducation" onClick={toggleFormVisibility}>
              Close
            </a>
          ) : (
            <a id="addEducation" onClick={toggleFormVisibility}>
              Add Experience
            </a>
          )}
        </div>
      </div>
      {isFormVisible ? (
        <>
          <div className="row mt-5">
            <div className="col-sm-6">
              <div className="mb-3">
                <label>Company</label>
                <ResumeInput
                  type="text"
                  className="form-control"
                  id="headline "
                  placeholder="Company Name"
                  onChange={handleExperience}
                  name="company"
                  value={addExperiences.company}
                />
                {errorMessages.company && (
                  <p style={{ lineheight: 0, color: 'red' }}>
                    {errorMessages.company}
                  </p>
                )}
              </div>
            </div>
            <div className="col-sm-6">
              <div className="mb-3">
                <label>Position</label>
                <ResumeInput
                  type="text"
                  className="form-control"
                  id="Position"
                  placeholder="Position/Title"
                  onChange={handleExperience}
                  name="position"
                  value={addExperiences.position}
                />
                {errorMessages.position && (
                  <p style={{ lineheight: 0, color: 'red' }}>
                    {errorMessages.position}
                  </p>
                )}
              </div>
            </div>
          </div>
          <div className="row">
            <div className="col-sm-6">
              <div className="mb-3">
                <label>Country</label>
                {/* <ResumeInput
                  type="text"
                  className="form-control"
                  id="Country Location"
                  placeholder="Country"
                  onChange={handleExperience}
                  name="country"
                  value={addExperiences.country}
                /> */}
                <AutoCompleteInput
                  Value={{ name: addExperiences?.country }}
                  onSelectedChange={(value) =>
                    setaddExperiences({
                      ...addExperiences,
                      country: value?.name,
                    })
                  }
                  label="Choose a Country"
                  data={countries}
                />
                {errorMessages.country && (
                  <p style={{ lineheight: 0, color: 'red' }}>
                    {errorMessages.country}
                  </p>
                )}
              </div>
            </div>
            <div className="col-sm-6">
              <label className="">Employment Status</label>
              <ResumeSelect
                title={
                  addExperiences?.employment_status
                    ? addExperiences?.employment_status
                    : 'Employment status'
                }
                options={employmentStatusChoices}
                name="employment_status"
                value={addExperiences?.employment_status}
                onChange={handleExperience}
                backgroundColor="var(--alice-blue)"
              />
              {/*
              {errorMessages.employment_status && (
                <p className={styles.errorMessage}>
                  {errorMessages.employment_status}
                </p>
              )} */}
            </div>
          </div>
          <FormControlLabel
            control={
              <Checkbox
                checked={ispresent}
                onChange={handleChange}
                inputProps={{ 'aria-label': 'controlled' }}
              />
            }
            label="Currently Working"
          />
          <div className="row">
            <div className="col-sm-6">
              <div className="mb-3">
                <label>Joining Date</label>
                <ResumeInput
                  className="form-control"
                  id="date"
                  placeholder="Passport / passport"
                  name="period_from"
                  type="date" // Set the input type to "date" to show a date picker
                  value={dateValues.period_from}
                  onChange={(e) =>
                    handleDateChange(e.target.value, 'period_from')
                  }
                />
                {errorMessages.period_from && (
                  <p style={{ lineheight: 0, color: 'red' }}>
                    {errorMessages.period_from}
                  </p>
                )}
              </div>
            </div>

            <div className="col-sm-6">
              <div className="mb-3">
                <label>Last Date</label>
                <ResumeInput
                  disabled={ispresent ? true : false}
                  type="date"
                  value={dateValues.period_to}
                  onChange={(e) =>
                    handleDateChange(e.target.value, 'period_to')
                  }
                  className="form-control"
                  id="adte"
                  placeholder="Area of Residence"
                  name="date"
                />
                {errorMessages.period_to && !ispresent && (
                  <p style={{ lineheight: 0, color: 'red' }}>
                    {errorMessages.period_to}
                  </p>
                )}
              </div>
            </div>
          </div>
          <div className="row">
            <div className="col-sm-12">
              <div className="">
                <label htmlFor="completePeriod">Short Description</label>
                <ReactQuill
                  theme="snow"
                  // modules={modules}
                  // formats={formats}
                  value={addExperiences?.description}
                  onChange={handleEditorChange}
                  style={{
                    height: '200px',
                    marginBottom: '3rem',
                    width: '100%',
                    borderradius: '0.25rem',
                  }}
                />
                {/* <textarea
                  type="text"
                  cols={30}
                  rows={4}
                  className="form-control"
                  id="completePeriod"
                  placeholder="Short Description"
                  name="description"
                  onChange={handleExperience}
                  value={addExperiences?.description}
                /> */}
              </div>
            </div>
          </div>
          {isloading ? (
            <CustomSpinner />
          ) : id ? (
            <div style={{ marginBottom: '.5rem' }}>
              <CustomButton
                marginTop={4}
                label="Update"
                onClick={onUpdateButtonClick}
              />
              <CustomButton
                marginTop={4}
                label="Cancel"
                onClick={toggleFormVisibility}
              />
            </div>
          ) : (
            <div style={{ marginBottom: '.5rem' }}>
              <CustomButton
                marginTop={4}
                label="Save"
                onClick={ExperienceFun}
              />
              <CustomButton
                marginTop={4}
                label="Cancel"
                onClick={toggleFormVisibility}
              />
            </div>
          )}
        </>
      ) : null}
      {AllExperice?.length === 0 ? (
        <p>Experience Not Added!</p>
      ) : (
        AllExperice &&
        AllExperice?.map((qualification, index) => (
          <div key={qualification.id} className={styless?.resume_block}>
            <div className={styless?.inner}>
              <span className={styless?.name}>
                {qualification.position.slice(0, 1)}
              </span>
              <div className={styless?.title_box}>
                <div className={styless?.info_box}>
                  <h5>{qualification?.position}</h5>
                  <div>
                    {qualification?.company} -{' '}
                    {qualification?.employment_status}{' '}
                  </div>
                  <div>{qualification?.country}</div>
                </div>
                <div className={styless?.edit_box}>
                  <span className={styless?.year}>
                    {qualification?.period_from?.slice(0, 4)}-
                    {qualification?.currently_working
                      ? 'Present'
                      : qualification?.period_to?.slice(0, 4)}
                  </span>
                  <div className={styless?.edit_btns}>
                    <button className={styless?.icons}>
                      <ImBin
                        style={{ color: 'red', width: '100%' }}
                        // icon={faTrashCan}
                        onClick={() => {
                          DeleteExperience(qualification?.id);
                        }}
                      />
                    </button>
                    <button className={styless?.icons}>
                      <FaEdit
                        style={{ color: 'green', width: '100%' }}
                        onClick={() => {
                          EditExperience(qualification);
                        }}
                        // icon={faPenToSquare}
                      />
                    </button>
                  </div>
                </div>
              </div>
              <div>
                <p style={{ marginTop: '20px' }}>
                  <JobDescriptionComponent
                    description={qualification?.description}
                    isblog={true}
                  />
                  {/* {qualification?.description} */}
                </p>
              </div>
            </div>
          </div>
        ))
      )}
    </section>
  );
}
export default UserExperience;
