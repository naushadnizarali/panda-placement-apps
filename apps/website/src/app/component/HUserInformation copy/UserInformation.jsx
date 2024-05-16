import React, { useEffect, useState } from 'react';
import UserApi from '../../Apis/UserApi';
import style from '../../pages/User/Hprofile/hprofile.module.css';
import AutoCompleteInput from '../AutoCompleteInput/AutoCompleteInput';
import { ResumeInput, ResumeSelect } from '../Input/TextInput';
import CustomSpinner from '../Spinner/Spinner';
import Toast from '../Toast/Toast';
import checkEmptyFields from '../ErrorFunctions/Validation';
import CustomButton from '../Button/CustomButton';
import { IoIosAddCircleOutline } from 'react-icons/io';

function HUserInformation({ onUpdate }) {
  const userapi = UserApi();
  const [isloading, setisloading] = useState(false);
  const [formloading, setFormloading] = useState(false);
  const [isuserinformation, setisuserinformation] = useState(false);
  const [id, setid] = useState(null);
  const [show, setShow] = useState(false);
  const [countries, setcountries] = useState([]);
  const [allstates, setallstates] = useState([]);
  const [countryID, setcountryID] = useState('');
  const [allcities, setAllcities] = useState([]);
  const [Nationality, setNationality] = useState();
  const [allselected, setallselected] = useState({
    country: '',
    state: '',
    city: '',
    gender: '',
    married: '',
  });
  const [userinformation, setUserInformation] = useState({
    headline: '',
    place_of_birth: '',
    passport: '',
    area_of_residence: '',
    zip_code: '',
  });

  const [dateValues, setDateValues] = useState({
    date_of_birth: null,
  });
  const [errors, setErrors] = useState({
    passport: '',
    gender: '',
  });

  //Saving the Country and Filter The Cities using this Function
  const handleCountryChange = async (value) => {
    setFormloading(true);
    setallselected({
      ...allselected,
      country: value?.name,
      state: '',
      city: '',
    });
    if (value) {
      setNationality(value?.nationality);
      try {
        setcountryID(value?.id);
        const allstates = await userapi.getStates(value?.id);
        setallstates(allstates);
        setFormloading(false);
      } catch (error) {
        console.log(error);
        setFormloading(false);
      }
    } else {
      setFormloading(false);
      console.log('Not Found');
    }
  };

  const handleStateChange = async (value) => {
    setFormloading(true);
    setallselected({
      ...allselected,
      state: value?.name,
      city: '',
    });
    const withOutSpace = value?.name;
    if ((allselected?.country, withOutSpace)) {
      try {
        const jsonString = await userapi.getCities(
          allselected?.country,
          withOutSpace,
        );
        const correctedJsonString = jsonString?.cities?.replace(/'/g, '"');
        const citiesObjects = JSON.parse(correctedJsonString);
        setAllcities(citiesObjects);
        setFormloading(false);
      } catch (error) {
        setFormloading(false);
        console.log(error);
      }
    } else {
      setFormloading(false);
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

  //Saving the City using this Function
  const handleSelectChange = (event) => {
    const { name, value } = event.target;
    setallselected({
      ...allselected,
      [name]: value,
    });
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setUserInformation((prevUserInformation) => ({
      ...prevUserInformation,
      [name]: value,
    }));
    // Validate gender
    if (name === 'gender') {
      const genderError =
        value.toLowerCase() === 'male' ||
        value.toLowerCase() === 'female' ||
        value.toLowerCase() === 'not preferred to ask'
          ? ''
          : 'Gender must be either Male, Female, or Not Preferred to Ask';
      setErrors((prevErrors) => ({
        ...prevErrors,
        gender: genderError,
      }));
    }
  };

  const Gender = [
    { label: 'Male', value: 'Male' },
    { label: 'Female', value: 'Female' },
    { label: 'Not preferred to answer', value: 'Not preferred to answer' },
  ];

  const marriedStatus = [
    { label: 'Married', value: 'Married' },
    { label: 'Unmarried', value: 'Unmarried' },
    { label: 'Not preferred to answer', value: 'Not preferred to answer' },
  ];

  const handleDateChange = (date, field) => {
    const updatedDateValues = { ...dateValues };
    updatedDateValues[field] = date;
    setDateValues(updatedDateValues);
  };

  const ErrorHandler = () => {
    Toast.error('Provide Correct Information');
  };
  // const toggleFormVisibility = () => {
  //   setIsFormVisible(!isFormVisible);
  // };
  const toggle = () => {
    setShow(!show);
  };
  const postUserInformation = async () => {
    setisloading(true);
    const NewData = {
      headline: userinformation.headline,
      place_of_birth: userinformation.place_of_birth,
      date_of_birth: dateValues.date_of_birth,
      gender: allselected.gender,
      passport: userinformation.passport,
      area_of_residence: userinformation.area_of_residence,
      zip_code: userinformation.zip_code,
      nationality: Nationality,
      country: allselected.country,
      city: allselected.city,
      state: allselected.state,
      married: allselected.married,
    };
    // if (!checkEmptyFields(NewData)) {
    //   return;
    // }
    if (allselected.country && allselected.state && allselected.city) {
      try {
        const resposne = await userapi.UserInformationPost(NewData);
        setUserInformation({
          headline: '',
          place_of_birth: '',
          passport: '',
          area_of_residence: '',
          zip_code: '',
        });
        setallselected({
          city: '',
          country: '',
          gender: '',
          state: '',
          married: '',
        });
        setNationality('');
        setDateValues({
          date_of_birth: '',
        });
        getUserInformation();
        Toast.success('Information UPloaded!');
        onUpdate();
        toggle();
        setisloading(false);
      } catch (error) {
        Toast.error('Try Later!');
        setisloading(false);
        console.error('Error in Userinformation', error);
      }
    } else {
      Toast.error('Please Add Country, State and City');
    }
  };

  const getUserInformation = async () => {
    try {
      const response = await userapi.UserInformationGet();
      setid(response[0]?.id);
      if (response[0]?.id) {
        const userData = response[0];
        setUserInformation({
          headline: userData?.headline,
          place_of_birth: userData?.place_of_birth,
          passport: userData?.passport,
          area_of_residence: userData?.area_of_residence,
          zip_code: userData?.zip_code,
        });
        setDateValues({
          date_of_birth: userData?.date_of_birth,
        });
        setallselected({
          country: userData?.country,
          state: userData?.state,
          city: userData?.city,
          gender: userData?.gender,
          married: userData?.married,
        });
        setNationality(userData?.nationality);
        onUpdate();
      } else {
        setisuserinformation(true);
      }
      onUpdate();
    } catch (error) {
      console.error('Error', error.response);
    }
  };

  const updateUserInformation = async (e) => {
    setisloading(true);
    e.preventDefault();
    const updatedData = {
      headline: userinformation.headline,
      place_of_birth: userinformation.place_of_birth,
      date_of_birth: dateValues.date_of_birth,
      passport: userinformation.passport,
      area_of_residence: userinformation.area_of_residence,
      zip_code: userinformation.zip_code,
      nationality: Nationality,
      gender: allselected.gender,
      country: allselected?.country ? allselected?.country : '',
      city: allselected?.city ? allselected?.city : '',
      state: allselected?.state ? allselected?.state : '',
      married: allselected?.married,
    };
    // if (!checkEmptyFields(allselected)) {
    //   setisloading(false);
    //   return;
    // }
    try {
      const resposne = await userapi.UserInformationUpdate(id, updatedData);
      Toast.success('User Information Updated!');
      toggle();
      getUserInformation();
      onUpdate();
      setisloading(false);
    } catch (error) {
      setisloading(false);
      Toast.error(error.response.data);
      console.error('Updated API ERROR', error.response.data);
    }
  };

  useEffect(() => {
    getUserInformation();
    countriesApi();
  }, []);

  useEffect(() => {
    if (allselected?.country) {
      const NEWID =
        countries && countries?.filter((e) => e?.name === allselected?.country);
      handleCountryChange({
        name: allselected?.country,
        nationality: Nationality,
        id: NEWID[0]?.id,
      });
    }
  }, [allselected?.country]);

  useEffect(() => {
    if (allselected?.country && allselected?.state) {
      handleStateChange({ name: allselected.state });
    }
  }, [allselected?.country, allselected?.state]);

  return (
    <section className={style.myProfile_box}>
      <div className={style.boxHeadign}>
        <div>
          <h5>User Information</h5>
        </div>
        <div className={style.addEducation}>
          <button
            title="Add New"
            onClick={toggle}
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
            Add Information
          </a>
        </div>
      </div>

      {show ? (
        formloading ? (
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              height: '80vh',
            }}
          >
            <CustomSpinner />
          </div>
        ) : (
          <>
            <div className="row mt-5">
              <div className="col-sm-6">
                <div className="mb-3">
                  <label>Head Line</label>
                  <ResumeInput
                    type="text"
                    className="form-control"
                    id="headline "
                    placeholder="Full Stack Developer"
                    name="headline"
                    value={userinformation.headline}
                    onChange={handleInputChange}
                  />
                </div>
              </div>
              <div className="col-sm-6">
                <div className="mb-3">
                  <label>Date Of Birth</label>
                  <ResumeInput
                    type="date"
                    className="form-control"
                    id="date_of_birth"
                    placeholder="Wick"
                    name="date_of_birth"
                    value={dateValues.date_of_birth}
                    onChange={(e) =>
                      handleDateChange(e.target.value, 'date_of_birth')
                    }
                  />
                </div>
              </div>
            </div>
            <div className="row">
              <div className="col-sm-6">
                <div className="mb-3">
                  <label>Place Of Birth</label>
                  <ResumeInput
                    type="text"
                    className="form-control"
                    id="place_of_birth"
                    placeholder="Place of Birth"
                    name="place_of_birth"
                    value={userinformation.place_of_birth}
                    onChange={handleInputChange}
                  />
                </div>
              </div>
              <div className="col-sm-6">
                <div className="">
                  <label>Gender</label>
                  <ResumeSelect
                    // disabled={Gender ? false : true}
                    width="100%"
                    backgroundColor="var(--alice-blue)"
                    title={allselected.gender ? allselected.gender : 'gender'}
                    options={Gender}
                    name="gender"
                    value={allselected.gender}
                    onChange={handleSelectChange}
                    required
                  />
                  {errors.gender && (
                    <span className="text-danger">{errors.gender}</span>
                  )}
                </div>
              </div>
            </div>
            <div className="row">
              <div className="col-sm-6">
                <div className="mb-3">
                  <label>National Id Card</label>
                  <ResumeInput
                    type="text"
                    className="form-control"
                    id="passport"
                    placeholder="National Id Card"
                    name="passport"
                    value={userinformation.passport}
                    onChange={handleInputChange}
                    helperText="Incorrect entry."
                  />
                  {errors.passport && (
                    <span className="text-danger">{errors.passport}</span>
                  )}
                </div>
              </div>

              <div className="col-sm-6">
                <div className="mb-3">
                  <label>Address </label>
                  <ResumeInput
                    type="text"
                    className="form-control"
                    id="area_of_residence "
                    placeholder="Address"
                    name="area_of_residence"
                    value={userinformation.area_of_residence}
                    onChange={handleInputChange}
                  />
                </div>
              </div>
            </div>

            <div className="row">
              <div className="col-sm-6">
                <div className="mb-3">
                  <label>Choose a Country</label>
                  <AutoCompleteInput
                    Value={{ name: allselected?.country }}
                    onSelectedChange={handleCountryChange}
                    label="Choose a Country"
                    data={countries ? countries : []}
                  />
                </div>
              </div>

              <div className="col-sm-6">
                <div className="mb-3">
                  <label>Choose a State</label>
                  <AutoCompleteInput
                    disabled={!allselected?.country}
                    onSelectedChange={handleStateChange}
                    label="Choose a State"
                    data={allstates}
                    Value={{ name: allselected?.state }}
                  />
                </div>
              </div>

              <div className="col-sm-6">
                <label>Choose a City</label>
                <AutoCompleteInput
                  disabled={!allselected?.country && !allselected?.state}
                  onSelectedChange={(value) => {
                    setallselected({
                      ...allselected,
                      city: value?.name,
                    });
                  }}
                  label="Choose City"
                  Value={{ name: allselected?.city }} //Passing City
                  data={allcities}
                />
              </div>
              <div className="col-sm-6">
                <label>Married Status</label>
                <ResumeSelect
                  // disabled={married ? false : true}
                  width="100%"
                  backgroundColor="var(--alice-blue)"
                  title={allselected.married ? allselected.married : 'married'}
                  options={marriedStatus}
                  name="married"
                  value={allselected.married}
                  onChange={handleSelectChange}
                  required
                />
                {errors.gender && (
                  <span className="text-danger">{errors.gender}</span>
                )}
              </div>
              <div className="col-sm-6">
                <div className="mt-3">
                  <label>Nationality</label>
                  <ResumeInput
                    type="text"
                    className="form-control"
                    placeholder="Nationality"
                    value={Nationality}
                    disabled={Nationality}
                  />
                </div>
              </div>
              <div className="col-sm-6">
                <div className="mt-3">
                  <label>Zip code</label>
                  <ResumeInput
                    type="number"
                    className="form-control"
                    id="zip_code "
                    placeholder="Zip code"
                    name="zip_code"
                    value={userinformation.zip_code}
                    onChange={handleInputChange}
                  />
                </div>
              </div>
            </div>

            {isloading ? (
              <CustomSpinner />
            ) : id ? (
              <CustomButton
                onClick={
                  errors.gender || errors.passport
                    ? ErrorHandler
                    : updateUserInformation
                }
                label={'Update'}
                marginTop={10}
              />
            ) : (
              <CustomButton
                onClick={
                  errors.gender || errors.passport
                    ? ErrorHandler
                    : postUserInformation
                }
                label={'Save'}
                marginTop={10}
              />
            )}
          </>
        )
      ) : (
        <div className={style.card}>
          <div className="row">
            <div className="col-sm-4 mt-2">
              <div className="mb-3">
                <h6>Head line</h6>
                {userinformation.headline == '' ? (
                  <p>Headline not added</p>
                ) : (
                  <p className={style.cardText}>
                    {userinformation.headline ?? '---'}
                  </p>
                )}
              </div>
            </div>
            <div className="col-sm-4 mt-2">
              <div className="mb-3">
                <h6>Date Of Birth</h6>
                {dateValues?.date_of_birth === null ? (
                  <p>Date Of Birth not added</p>
                ) : (
                  <p className={style.cardText}>{dateValues?.date_of_birth}</p>
                )}
              </div>
            </div>
            <div className="col-sm-4 mt-2">
              <div className="mb-3">
                <h6>Place Of Birth</h6>
                {userinformation.place_of_birth == '' ? (
                  <p>Place Of Birth not added</p>
                ) : (
                  <p className={style.cardText}>
                    {userinformation.place_of_birth}
                  </p>
                )}
              </div>
            </div>
          </div>
          <div className="row">
            <div className="col-sm-4 mt-2">
              <div className="mb-3">
                <h6>Gender</h6>
                {userinformation?.gender == '' ? (
                  <p>Gender not added</p>
                ) : (
                  <p className={style.cardText}>{allselected?.gender}</p>
                )}
              </div>
            </div>
            <div className="col-sm-4 mt-2">
              <div className="mb-3">
                <h6>Married Status</h6>
                {allselected.married == '' ? (
                  <p>Married not added</p>
                ) : (
                  <p className={style.cardText}>{allselected.married}</p>
                )}
              </div>
            </div>
            <div className="col-sm-4 mt-2">
              <div className="mb-3">
                <h6>National Id Card</h6>
                {userinformation.passport == '' ? (
                  <p>National Id Card not added</p>
                ) : (
                  <p lassName={style.cardText}>{userinformation.passport}</p>
                )}
              </div>
            </div>
          </div>
          <div className="row">
            <div className="col-sm-4 mt-2">
              <div className="mb-3">
                <h6>Country</h6>
                {allselected.country === '' ? (
                  <p>Country not added</p>
                ) : (
                  <p className={style.cardText}>{allselected.country}</p>
                )}
              </div>
            </div>
            <div className="col-sm-4 mt-2">
              <div className="mb-3">
                <h6>State</h6>
                {allselected?.state === '' ? (
                  <p>State not added</p>
                ) : (
                  <p className={style.cardText}>{allselected.state}</p>
                )}
              </div>
            </div>
            <div className="col-sm-4 mt-2">
              <div className="mb-3">
                <h6>City</h6>
                {allselected?.city === '' ? (
                  <p>City not added</p>
                ) : (
                  <p className={style.cardText}>{allselected.city}</p>
                )}
              </div>
            </div>
            <div className="col-sm-4 mt-2">
              <div className="mb-3">
                <h6>Nationality</h6>
                {userinformation.zip_code == '' ? (
                  <p>Nationality not added</p>
                ) : (
                  <p className={style.cardText}>{Nationality}</p>
                )}
                {/* <h6>Zip code</h6>
                {userinformation.zip_code == "" ? (
                  <p>Zip code not added</p>
                ) : (
                  <p className={style.cardText}>{userinformation.zip_code}</p>
                )} */}
              </div>
            </div>
            <div className="col-sm-4 mt-2">
              <div className="mb-3">
                <h6>Zip code</h6>
                {userinformation.zip_code == '' ? (
                  <p>Zip code not added</p>
                ) : (
                  <p className={style.cardText}>{userinformation.zip_code}</p>
                )}
              </div>
            </div>
            <div className="col-sm-4 mt-2">
              <div className="mb-3">
                <h6>Address</h6>
                {userinformation.area_of_residence == '' ? (
                  <p>Address Not added</p>
                ) : (
                  <p className={style.cardText}>
                    {userinformation.area_of_residence.slice(0, 100)}...
                  </p>
                )}
              </div>
            </div>
          </div>
        </div>
      )}
    </section>
  );
}

export default HUserInformation;
