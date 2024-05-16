import React, { useEffect, useMemo } from 'react';
import { useState } from 'react';
import styles from './PostNewJob.module.css';
import { FaEdit, FaTrashAlt } from 'react-icons/fa';

import { useNavigate, useParams } from 'react-router-dom';
import { Checkbox, FormControlLabel, Grid } from '@mui/material';
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';
import Goback from '../../../component/GoBackicon/goback';
import EmployerAPIS from '../../../Apis/EmployerApi';
import Toast from '../../../component/Toast/Toast';
import { ResumeInput, ResumeSelect } from '../../../component/Input/TextInput';
import {
  INDUSTRY_CHOICES,
  JOB_TYPE,
  RANGE,
  SALARYRATE,
  STATUS,
} from '../../Jsondata/Jsondata';
import CustomSpinner from '../../../component/Spinner/Spinner';
import CustomButton from '../../../component/Button/CustomButton';
import checkEmptyFields from '../../../component/ErrorFunctions/Validation';
import AdminApi from '../../../Apis/AdminApi';
import JsonData from '../../../pages/Jsondata/new_countries_data.json';

function PostNewJob({ jobeditdata }) {
  const { id } = useParams();
  const adminapi = AdminApi();
  // const EditData = jobeditdata;
  const countriesData = JsonData;
  const [isloading, setIsloading] = useState(false);
  const [EditData, setEditData] = useState('');
  const navigate = useNavigate();
  const employerapi = EmployerAPIS();
  const [selectedCountry, setSelectedCountry] = useState('');
  const [cityOptions, setCityOptions] = useState([]);
  const [countries, setcountries] = useState([]);
  const [isFormVisible, setFormVisibility] = useState(false);
  const [questions, setQuestions] = useState([]);
  const [newQuestion, setNewQuestion] = useState('');
  const [editIndex, setEditIndex] = useState(-1);
  const [questionandanswer, setquestionandanswer] = useState([]);
  const [hide_company, sethide_company] = useState(false);
  const [urgenthiring, seturgenthiring] = useState(false);
  const [jobDetails, setjobDetails] = useState({
    job_title: '',
    jobPosterEmail: '',
    minimunpay: '',
    maximumpay: '',
    description: '',
  });
  const [dateValues, setDateValues] = useState({
    applicationDeadline: null,
  });
  const [allselected, setallselected] = useState({
    numberofhiring: '', //select
    city: '', //select
    jobtype: '', //select
    category: '', //select
    range: '', //select
    rate: '', //select
    status: '', //select
  });

  useMemo(() => {
    const getOneJob = async () => {
      if (id) {
        setIsloading(true);
        try {
          const response = await adminapi.getOneJob(id);
          setEditData(response);
          setjobDetails({
            job_title: response.title,
            jobPosterEmail: response?.employer?.email,
            minimunpay: response.salary_start_range,
            maximumpay: response.salary_end_range,
            description: response.description,
          });
          setallselected({
            numberofhiring: response.hiring_number,
            city: response.hiring_city,
            jobtype: response.type,
            category: response.category,
            range: response.salary_rate,
            rate: response.salary_type,
            status: response.status,
          });
          setSelectedCountry(response?.hiring_country);
          const countryName = response?.hiring_country;
          const selectedCountryData = countriesData.find(
            (country) => country?.countryname === countryName,
          );
          const cities =
            selectedCountryData &&
            selectedCountryData?.cities?.map((city) => ({
              value: city,
              label: city,
            }));
          setCityOptions(cities);
          seturgenthiring(response.hiring_timeline);
          sethide_company(response.hide_company);
          setQuestions(JSON.parse(response?.question));
          setDateValues({
            applicationDeadline: response.application_deadline,
          });
          setIsloading(false);
        } catch (error) {
          setIsloading(false);
          console.error('ERROR: In getting the Job details', error);
        }
      }
    };
    getOneJob();
  }, [id]);

  useEffect(() => {
    const countrie =
      countriesData &&
      countriesData.map((country) => ({
        value: country.countryname,
        label: country.countryname,
        countryId: country.countryid,
      }));
    setcountries(countrie);
  }, []);

  const handleChange = (event) => {
    sethide_company(event.target.checked);
  };

  const handleUrgentHiring = (event) => {
    seturgenthiring(event.target.checked);
  };

  const handleCountryChange = (selectedCountry) => {
    const { value } = selectedCountry.target;
    setSelectedCountry(value);
    const selectedCountryData = countriesData.find(
      (country) => country.countryname === value,
    );
    if (selectedCountryData) {
      const cities =
        selectedCountryData &&
        selectedCountryData.cities.map((city) => ({
          value: city,
          label: city,
        }));
      setCityOptions(cities);
    } else {
      console.error(`Data not found for country: ${value}`);
      setCityOptions([]); // Clear the city options
    }
  };
  const options = [
    { label: '1', value: '1' },
    { label: '2', value: '2' },
    { label: '3', value: '3' },
    { label: '4', value: '4' },
    { label: '5', value: '5' },
    { label: '6', value: '6' },
    { label: '7', value: '7' },
    { label: '8', value: '8' },
    { label: '9', value: '9' },
    { label: '10', value: '10' },
  ];

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setjobDetails({
      ...jobDetails,
      [name]: value,
    });
  };

  const handleDateChange = (date, field) => {
    const updatedDateValues = { ...dateValues };
    updatedDateValues[field] = date;
    setDateValues(updatedDateValues);
  };

  const handleSelectChange = (event) => {
    const { name, value } = event.target;
    setallselected({
      ...allselected,
      [name]: value,
    });
  };

  const handleAddQuestion = () => {
    if (newQuestion.trim() !== '') {
      if (editIndex === -1) {
        setQuestions([...questions, { question: newQuestion, answer: '' }]);
      } else {
        const updatedQuestions = [...questions];
        updatedQuestions[editIndex] = { question: newQuestion, answer: '' };
        setQuestions(updatedQuestions);
        setEditIndex(-1);
      }
      setNewQuestion('');
    }
  };

  const handleEditQuestion = (index) => {
    if (questions[index]) {
      setNewQuestion(questions[index].question);
      setEditIndex(index);
    }
  };

  const handleDeleteQuestion = (index) => {
    const updatedQuestions = [...questions];
    updatedQuestions.splice(index, 1);
    setQuestions(updatedQuestions);
  };

  const Submit = async () => {
    setIsloading(true);
    const newdata = {
      title: jobDetails.job_title,
      employer: jobDetails.jobPosterEmail,
      hiring_timeline: urgenthiring,
      hiring_number: allselected.numberofhiring,
      hiring_country: selectedCountry,
      hiring_city: allselected.city,
      category: allselected.category,
      description: jobDetails.description,
      type: allselected.jobtype,
      hide_company: hide_company,
      salary_rate: allselected.range,
      salary_start_range: jobDetails.minimunpay,
      salary_type: allselected.rate,
      salary_end_range: jobDetails.maximumpay,
      status: allselected.status,
      application_deadline: dateValues.applicationDeadline,
      question: JSON.stringify(questions),
    };
    const data = {
      title: jobDetails.job_title,
      hiring_number: allselected.numberofhiring,
      hiring_country: selectedCountry,
      hiring_city: allselected.city,
      category: allselected.category,
      description: jobDetails.description,
      type: allselected.jobtype,
      hide_company: hide_company,
      salary_rate: allselected.range,
      salary_start_range: jobDetails.minimunpay,
      salary_type: allselected.rate,
      salary_end_range: jobDetails.minimunpay,
      employer: jobDetails.jobPosterEmail,
      hiring_timeline: urgenthiring,
      status: allselected.status,
      application_deadline: dateValues.applicationDeadline,
      question: JSON.stringify(questions),
    };
    if (
      !checkEmptyFields(allselected.rate === 'Extact Amount' ? data : newdata)
    ) {
      setIsloading(false);
      return;
    }
    try {
      const response = await adminapi.PostJob(
        allselected.rate === 'Extact Amount' ? data : newdata,
      );
      Toast.success('Job Posted!');
      //   setTimeout(() => {
      //     navigate("/employer/jobs");
      //     setIsloading(false);
      //   }, 1000);
      setIsloading(false);
    } catch (error) {
      Toast.error('Please Try Later!');
      setIsloading(false);
    }
  };

  const handleEditorChange = (value) => {
    setjobDetails({
      ...jobDetails,
      description: value,
    });
  };

  const updateJobDetails = async () => {
    setIsloading(true);
    const updatedData = {
      title: jobDetails.job_title,
      employer: jobDetails.jobPosterEmail,
      hiring_timeline: urgenthiring,
      hiring_number: allselected.numberofhiring,
      hiring_country: selectedCountry,
      hiring_city: allselected.city,
      category: allselected.category,
      description: jobDetails.description,
      type: allselected.jobtype,
      hide_company: hide_company,
      salary_rate: allselected.range,
      salary_start_range: jobDetails.minimunpay,
      salary_type: allselected.rate,
      salary_end_range: jobDetails.maximumpay,
      status: allselected.status,
      application_deadline: dateValues.applicationDeadline,
      question: JSON.stringify(questions),
    };
    const updatedDatawithExatcAmount = {
      title: jobDetails.job_title,
      hiring_number: allselected.numberofhiring,
      hiring_country: selectedCountry,
      hiring_city: allselected.city,
      category: allselected.category,
      description: jobDetails.description,
      type: allselected.jobtype,
      hide_company: hide_company,
      salary_rate: allselected.range,
      salary_start_range: jobDetails.minimunpay,
      salary_type: allselected.rate,
      salary_end_range: jobDetails.minimunpay,
      employer: jobDetails.jobPosterEmail,
      hiring_timeline: urgenthiring,
      status: allselected.status,
      application_deadline: dateValues.applicationDeadline,
      question: JSON.stringify(questions),
    };
    return;
    if (!checkEmptyFields(updatedData || updatedDatawithExatcAmount)) {
      setIsloading(false);
      return;
    }
    try {
      const response = await adminapi.editjobDetails(
        allselected.rate === 'Extact Amount'
          ? updatedData
          : updatedDatawithExatcAmount,
        id,
      );
      Toast.success('Job Update Successfully!');
      setIsloading(false);
    } catch (error) {
      console.error('ERROR In updating job', error);
      Toast.error('Job Not Update Successfully!');
      setIsloading(false);
    }
  };

  return (
    <>
      <div
        className="bg-white px-10 py-10 rounded"
        style={{ margin: '0px 20px' }}
      >
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            flexWrap: 'wrap',
            marginBottom: '1rem',
          }}
        >
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              flexWrap: 'wrap',
            }}
          >
            <Goback
              onClick={() => {
                navigate('/employer/jobs');
              }}
            />
            <h2
              style={{
                cursor: 'pointer',
                marginTop: '.5rem',
                marginLeft: '.5rem',
              }}
              className="fw-bold"
            >
              Post A New Job
            </h2>
          </div>
          <div>
            <FormControlLabel
              control={
                <Checkbox
                  checked={urgenthiring}
                  onChange={handleUrgentHiring}
                  inputProps={{ 'aria-label': 'controlled' }}
                />
              }
              label="Urgent Hiring"
            />
            <FormControlLabel
              control={
                <Checkbox
                  checked={hide_company}
                  onChange={handleChange}
                  inputProps={{ 'aria-label': 'controlled' }}
                />
              }
              label="Hide Company Profile"
            />
          </div>
        </div>
        {/* job Basic */}
        <div className="mr-md-4 flex items-left flex-col ">
          <div>
            <Grid item sx={12}>
              <ResumeInput
                placeholder="Job Title"
                name="job_title"
                value={jobDetails.job_title}
                onChange={handleInputChange}
                required
                borderradius={'0.25rem'}
                padding={13}
              />
            </Grid>
            <Grid
              style={{
                marginTop: '0.5rem',
                width: '100%', // Set to 100% width
              }}
              item
              xs={12}
              md={8} // Adjust the number of columns for medium-sized screens
              lg={6} // Adjust the number of columns for large screens
            >
              <ReactQuill
                theme="snow"
                value={jobDetails.description}
                onChange={handleEditorChange}
                style={{
                  height: '200px',
                  marginBottom: '1.5rem',
                  width: '100%',
                  borderradius: '0.25rem',
                }}
              />
              {/* Additional content or components */}
            </Grid>
            <div style={{ marginTop: '4rem' }}>
              <div className="row">
                <div className="col-md-6 mb-2">
                  <ResumeSelect
                    title="Category"
                    options={INDUSTRY_CHOICES}
                    name="category"
                    value={allselected.category}
                    onChange={handleSelectChange}
                    required
                  />
                </div>
                <div className="col-md-6 mb-2">
                  <ResumeSelect
                    title="Job Status"
                    options={STATUS}
                    name="status"
                    value={allselected.status}
                    onChange={handleSelectChange}
                    required
                  />
                </div>
              </div>
              <div className="row">
                <div className="col-md-6 mb-2">
                  <ResumeSelect
                    title="Number of Hiring"
                    options={options}
                    name="numberofhiring"
                    value={allselected.numberofhiring}
                    onChange={handleSelectChange}
                    required
                  />
                </div>
                <div className="col-md-6 mb-2">
                  <ResumeSelect
                    title="Job Country"
                    options={countries}
                    name="country"
                    value={selectedCountry}
                    onChange={handleCountryChange}
                    required
                  />
                </div>
              </div>
              <div className="row">
                <div className="col-md-6 mb-2">
                  <ResumeSelect
                    width="100%"
                    // title={`${EditData?.hiring_city?EditData?.hiring_city:"Job City"}`}
                    title={`Job City`}
                    options={cityOptions}
                    name="city"
                    value={allselected.city}
                    onChange={handleSelectChange}
                    required
                  />
                </div>
                <div className="col-md-6 mb-2">
                  <ResumeSelect
                    width="100%"
                    title="Job Type"
                    options={JOB_TYPE}
                    name="jobtype"
                    value={allselected.jobtype}
                    onChange={handleSelectChange}
                    required
                  />
                </div>
              </div>
              <div className="row">
                <div className="col-md-6 mb-2">
                  <ResumeSelect
                    width="100%"
                    title="Salary Rate"
                    options={SALARYRATE}
                    name="range"
                    value={allselected.range}
                    onChange={handleSelectChange}
                    required
                  />
                </div>
                <div className="col-md-6 mb-2">
                  <ResumeSelect
                    title="Rate"
                    options={RANGE}
                    name="rate"
                    value={allselected.rate}
                    onChange={handleSelectChange}
                    width="100%"
                    required
                  />
                </div>
              </div>
              {allselected.rate === 'Range' ? (
                <>
                  <div className="row">
                    <div className="col-md-6 mb-2">
                      <ResumeInput
                        placeholder="Minimum"
                        name="minimunpay"
                        value={jobDetails.minimunpay}
                        onChange={handleInputChange}
                        required
                        borderradius={'0.25rem'}
                        padding={13}
                      />
                    </div>
                    <div className="col-md-6 mb-2">
                      <ResumeInput
                        placeholder="Maximum"
                        name="maximumpay"
                        value={jobDetails.maximumpay}
                        onChange={handleInputChange}
                        required
                        borderradius={'0.25rem'}
                        padding={13}
                      />
                    </div>
                  </div>
                </>
              ) : allselected.rate === 'Extact Amount' ? (
                <div className="row">
                  <div className="col-12">
                    <ResumeInput
                      placeholder="Extact Amount"
                      name="minimunpay"
                      value={jobDetails.minimunpay}
                      onChange={handleInputChange}
                      required
                      borderradius={'0.25rem'}
                      padding={13}
                    />
                  </div>
                </div>
              ) : null}

              <div className="row">
                <div className="col-md-6 mb-2">
                  <label
                    style={{
                      fontSize: '12px',
                    }}
                  >
                    Employer Email
                  </label>
                  <ResumeInput
                    placeholder="Employer Email"
                    name="jobPosterEmail"
                    type="email"
                    value={jobDetails.jobPosterEmail}
                    onChange={handleInputChange}
                    required
                    borderradius={'0.25rem'}
                    padding={13}
                  />
                </div>
                <div className="col-md-6 mb-2">
                  <label
                    style={{
                      fontSize: '12px',
                    }}
                  >
                    Application Deadline
                  </label>
                  <ResumeInput
                    placeholder="Maxiapplication_deadlineum"
                    name="applicationDeadline"
                    type="date"
                    value={dateValues.applicationDeadline}
                    onChange={(e) =>
                      handleDateChange(e.target.value, 'applicationDeadline')
                    }
                    required
                    borderradius={'0.25rem'}
                    padding={13}
                  />
                </div>
              </div>
            </div>
          </div>
          <div className={styles.prescreenQuestion}>
            <h2 style={{ cursor: 'pointer' }}>Pre-screen Applicants</h2>
            <div style={{ paddingLeft: '0rem' }}>
              {questions.length > 0 ? (
                questions &&
                questions.map((question, index) => (
                  <div key={index} className={styles.Questions}>
                    <div style={{ width: '100%', wordWrap: 'break-word' }}>
                      <p className="text-light">{question.question}</p>
                    </div>
                    <div
                      style={{ display: 'flex', justifyContent: 'flex-end' }}
                    >
                      <FaEdit
                        fontSize={33}
                        onClick={() => handleEditQuestion(index)}
                        className={styles.QuesBoxIcon}
                        // icon={faEdit}
                      />
                      <FaTrashAlt
                        fontSize={33}
                        onClick={() => handleDeleteQuestion(index)}
                        className={styles.QuesBoxIcon}
                        // icon={faTrash}
                      />
                    </div>
                  </div>
                ))
              ) : (
                <h5 style={{ textAlign: 'center', color: 'gray' }}>
                  No Questions Added
                </h5>
              )}
            </div>
            <div>
              <ResumeInput
                // marginRight={10}
                // marginLeft={10}
                marginTop={10}
                type="text"
                placeholder="Enter a question"
                value={newQuestion}
                onChange={(e) => setNewQuestion(e.target.value)}
                width="100%"
                borderradius={'0.25rem'}
                padding={13}
              />
              <CustomButton
                onClick={handleAddQuestion}
                label={editIndex === -1 ? 'Add Question' : 'Save Question'}
              />
            </div>
          </div>

          <div className={styles.buttons}>
            {isloading ? (
              <div>
                <CustomSpinner />
              </div>
            ) : EditData ? (
              <CustomButton
                onClick={updateJobDetails}
                label="Update Job"
                width={'100%'}
                borderRadius={10}
                boxShadow={'2px 2px 10px var( --primary-color)'}
                className={styles.hfhfhf}
              />
            ) : (
              <CustomButton
                onClick={Submit}
                label="Create Job"
                width={'100%'}
                borderRadius={10}
                boxShadow={'2px 2px 10px var( --primary-color)'}
                className={styles.hfhfhf}
              />
            )}
          </div>
        </div>
      </div>
    </>
  );
}

export default PostNewJob;
