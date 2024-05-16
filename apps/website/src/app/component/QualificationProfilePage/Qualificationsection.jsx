import React, { useEffect, useState } from 'react';
import Profilecards from '../Profilecards/Profilecards';
import style from '../../pages/User/Hprofile/hprofile.module.css';
import UserApi from '../../Apis/UserApi';
import Toast from '../Toast/Toast';
import checkEmptyFields from '../ErrorFunctions/Validation';
import CustomSpinner from '../Spinner/Spinner';
import { ResumeInput, ResumeSelect } from '../Input/TextInput';
import {
  Checkbox,
  FormControlLabel,
} from '@mui/material';
import {
  DEGREES_DATA,
  EDUCATION_LEVELS,
} from '../../pages/Jsondata/Jsondata';
import AutoCompleteInput from '../AutoCompleteInput/AutoCompleteInput';
import CustomButton from '../Button/CustomButton';
import { IoIosAddCircleOutline } from 'react-icons/io';

function QualificationSection({ onUpdate }) {
  const [show, setShow] = useState(false);
  const [isloading, setisloading] = useState(false);
  const userapi = UserApi();
  const [countries, setcountries] = useState([]);
  const [isupdate, setIsupdate] = useState(false);
  const [id, setid] = useState(null);
  const [ispresent, setispresent] = useState(false);
  const [Qualification, setQualification] = useState([]);
  const [degreeSearch, setdegreeSearch] = useState(DEGREES_DATA);
  const [universities, setuniversities] = useState([]);
  const [addqualification, setaddqualification] = useState({
    degree: '',
    education_level: '',
    location: '',
    institute: '',
  });
  const [dateValues, setDateValues] = useState({
    complete_period: null,
    start_period: null,
  });
  const handleInputChange = (event) => {
    const { name, value } = event.target;
    setaddqualification({
      ...addqualification,
      [name]: value,
    });
  };

  const handleDateChange = (date, field) => {
    const updatedDateValues = { ...dateValues };
    updatedDateValues[field] = date;
    setDateValues(updatedDateValues);
    // validateQualification();
  };

  const toggle = () => {
    setShow(!show);
    setIsupdate(false);
    setaddqualification({
      degree: '',
      education_level: '',
      location: '',
      institute: '',
    });
    setispresent(false);
    setDateValues({
      complete_period: '',
      start_period: '',
    });
  };

  //   Get Qualification
  const UserQualifcationGet = async () => {
    try {
      const response = await userapi.UserEductionsGet();
      setQualification(response);
    } catch (error) {
      console.error('Error in Qualification', error);
    }
  };
  //Add Qualification
  const addQualification = async (e) => {
    setisloading(true);
    e.preventDefault();
    const newExperience = {
      degree: addqualification.degree,
      education_level: addqualification.education_level,
      location: addqualification.location,
      complete_period: ispresent ? null : dateValues.complete_period,
      start_period: dateValues.start_period,
      institute: addqualification.institute,
      currently_enrolled: ispresent,
    };
    // if (!checkEmptyFields(newExperience)) {
    //   setisloading(false);
    //   return;
    // }
    if (dateValues?.start_period) {
      try {
        const response = await userapi.UserEductionsPost(newExperience);
        Toast.success('Qualification Added!');
        UserQualifcationGet();
        setaddqualification({
          degree: '',
          education_level: '',
          location: '',
          complete_period: '',
          start_period: '',
          institute: '',
        });
        setDateValues({
          complete_period: null,
          start_period: null,
        });
        setisloading(false);
        onUpdate();
        toggle();
      } catch (error) {
        setisloading(false);
        Toast.error('Try later!');
        console.error('Error in user education post', error);
      }
    } else {
      setisloading(false);
      Toast.error('Please fill the Dates!');
    }
  };

  //Delete Qualifiction
  const handleDelete = async (id) => {
    setisloading(true);
    try {
      const reponse = await userapi.UserEductionsDelete(id);
      Toast.success('Qualification Deleted!');
      UserQualifcationGet();
      setisloading(false);
    } catch (error) {
      console.error('Error in user education delete', error);
      Toast.error('Please Try Later!');
      setisloading(false);
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
  //Edit Qualifiction
  const handleEdit = (item) => {
    toggle();
    setIsupdate(true);
    setid(item.id);
    setaddqualification({
      degree: item.degree,
      education_level: item.education_level,
      location: item.location,
      institute: item.institute,
    });
    setispresent(item?.currently_enrolled);
    setDateValues({
      complete_period: item.complete_period,
      start_period: item.start_period,
    });
    const formSection = document.getElementById('formSection');
    if (formSection) {
      formSection.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  };

  const getAllUniversities = async (country, name) => {
    if (country?.name) {
      setaddqualification({
        ...addqualification,
        location: country?.name,
      });
      try {
        let response = await userapi.getCountyUniversities(country?.name);
        // setcountries(response);
        setuniversities(response);
      } catch (error) {
        console.error('Error in Find Job', error);
      }
    } else {
      setuniversities([]);
    }
  };

  const handleChange = (event) => {
    setispresent(event.target.checked);
  };

  const onUpdateButtonClick = async (e) => {
    setisloading(true);
    e.preventDefault();
    if (!ispresent && !dateValues?.period_to) {
      Toast.error('Ending Date is Required');
      setisloading(false);
      return;
    }
    const updateData = {
      degree: addqualification.degree,
      education_level: addqualification.education_level,
      location: addqualification.location,
      institute: addqualification.institute,
      complete_period: dateValues.complete_period,
      start_period: dateValues.start_period,
      currently_enrolled: ispresent,
    };
    if (!checkEmptyFields(updateData)) {
      setisloading(false);
      return;
    }
    try {
      const response = await userapi.UserEducationUpdate(id, updateData);
      Toast.success('Qualification Updated!');
      setaddqualification({
        degree: '',
        education_level: '',
        location: '',
        complete_period: '',
        start_period: '',
        institute: '',
      });
      setDateValues({
        complete_period: null,
        start_period: null,
      });
      setShow(false);
      onUpdate();
      setisloading(false);
      UserQualifcationGet();
    } catch (error) {
      setisloading(false);
      console.error('Error user education update', error);
      Toast.error('Please Try Later!');
    }
  };

  useEffect(() => {
    UserQualifcationGet();
    countriesApi();
  }, []);
  useEffect(() => {
    getAllUniversities({ name: addqualification?.location });
  }, [addqualification?.location]);

  return (
    <section className={style.myProfile_box} id="formSection">
      <div className={style.boxHeadign}>
        <div>
          <h5>Qualification</h5>
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
          <a id="addEducation" onClick={toggle}>
            Add Education
          </a>
        </div>
      </div>

      {show ? (
        <div className={style.qualifi_inputs}>
          <div className="row">
            <div className="col-sm-6">
              <div className="">
                <label>Education level</label>
                <ResumeSelect
                  width="100%"
                  backgroundColor="#f0f5f7"
                  title="Education Level"
                  options={EDUCATION_LEVELS}
                  name="education_level"
                  value={addqualification.education_level}
                  onChange={(event) =>
                    setaddqualification({
                      ...addqualification,
                      education_level: event.target.value,
                    })
                  }
                  required
                />
              </div>
            </div>
            <div className="col-sm-6">
              <div className="mb-3">
                <label>Degree</label>
                <AutoCompleteInput
                  onSelectedChange={(value) => {
                    setaddqualification({
                      ...addqualification,
                      degree: value?.name,
                    });
                  }}
                  Value={{ name: addqualification?.degree }}
                  label={`${
                    // addqualification.degree ||
                    // ? addqualification.degree
                    'Choose a Degree'
                    }`}
                  data={DEGREES_DATA}
                />
                {/* <Autocomplete
                  disablePortal
                  id="combo-box-demo"
                  options={DEGREES_DATA}
                  sx={{ width: 500 }}
                  renderInput={(params) => (
                    <TextField {...params} label="Degree" />
                  )}
                /> */}
              </div>
            </div>
          </div>
          <div className="row">
            <div className="col-sm-6">
              <div className="">
                <label>Location</label>
                <AutoCompleteInput
                  Value={{ name: addqualification?.location }}
                  onSelectedChange={getAllUniversities}
                  label={`${addqualification?.location || 'Choose a Country'}`}
                  data={countries}
                />
              </div>
            </div>
            <div className="col-sm-6">
              <div className="mb-4">
                <label>Institute</label>
                {/* <AutoCompleteInput
                  Value={{ name: addqualification.institute }}
                  disabled={!addqualification?.location}
                  onSelectedChange={(value) =>
                    setaddqualification({
                      ...addqualification,
                      institute: value?.name,
                    })
                  }
                  label={`${addqualification?.institute || "Choose a Institute"
                    }`}
                  data={universities}
                /> */}
                <ResumeInput
                  type="text"
                  // id=""
                  placeholder="Institute"
                  name="institute"
                  value={addqualification.institute}
                  onChange={handleInputChange}
                />
              </div>
            </div>
          </div>
          <FormControlLabel
            control={
              <Checkbox
                checked={ispresent}
                onChange={(e) => {
                  setispresent(e.target.checked);
                }}
                inputProps={{ 'aria-label': 'controlled' }}
              />
            }
            label="Currently Enrolled"
          />
          <div className="row">
            <div className="col-sm-6">
              <div className="mb-3">
                <label>Start Period</label>
                <ResumeInput
                  className="form-control"
                  id="startPeriod"
                  placeholder=""
                  name="start_period"
                  type="date"
                  value={dateValues.start_period}
                  onChange={(e) =>
                    handleDateChange(e.target.value, 'start_period')
                  }
                />
              </div>
            </div>
            <div className="col-sm-6">
              <div className="">
                <label>Complete Period</label>
                <ResumeInput
                  // TODO: This added When This Feild Added in the backEnd
                  // disabled={ispresent}
                  name="complete_period"
                  type="date"
                  value={dateValues.complete_period}
                  onChange={(e) =>
                    handleDateChange(e.target.value, 'complete_period')
                  }
                  className="form-control"
                  id="completePeriod"
                  placeholder=""
                  disabled={ispresent}
                />
              </div>
            </div>
          </div>

          {
            //isloading= condition
            // ? = IF OR Condtion True
            // : = else  PR Condition False
            isloading ? (
              <CustomSpinner />
            ) : isupdate ? (
              <>
                <CustomButton
                  onClick={(e) => {
                    onUpdateButtonClick(e);
                  }}
                  label={'Update'}
                />

                <CustomButton
                  marginTop={10}
                  onClick={() => {
                    toggle();
                  }}
                  label={'Cancel'}
                />
              </>
            ) : (
              <>
                <CustomButton
                  onClick={(e) => {
                    addQualification(e);
                  }}
                  label={'Save'}
                />

                <CustomButton
                  marginTop={10}
                  onClick={() => {
                    toggle();
                  }}
                  label={'Cancel'}
                />
              </>
            )
          }
        </div>
      ) : null}
      <div>
        {Qualification?.length == 0 ? (
          <p>Qualification not added</p>
        ) : (
          <Profilecards
            onDelete={handleDelete}
            onEdit={handleEdit}
            data={Qualification}
          />
        )}
      </div>
    </section>
  );
}

export default QualificationSection;
