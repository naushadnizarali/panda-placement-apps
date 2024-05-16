import { FaPlus } from 'react-icons/fa6';
import { FaEdit } from 'react-icons/fa';
import { FaTrashAlt } from 'react-icons/fa';
import {
  Autocomplete,
  Checkbox,
  FormControlLabel,
  Grid,
  TextField,
} from '@mui/material';
import React, { useEffect, useState } from 'react';
import ReactQuill from 'react-quill';
import { useNavigate, useParams } from 'react-router-dom';
import EmployerAPIS from '../../Apis/EmployerApi';
import UserApi from '../../Apis/UserApi';
import Toast from '../../component/Toast/Toast';
import {
  EXPERIENCE_CHOICES,
  INDUSTRY_CHOICES,
  JOB_TYPE,
  RANGE,
  SALARYRATE,
} from '../../pages/Jsondata/Jsondata';
import AutoCompleteInput from '../AutoCompleteInput/AutoCompleteInput';
import CustomButton from '../Button/CustomButton';
import checkEmptyFields from '../ErrorFunctions/Validation';
import Goback from '../../component/GoBackicon/goback';
import { ResumeInput, ResumeSelect } from '../Input/TextInput';
import CustomSpinner from '../Spinner/Spinner';
import styles from './EmployerForm.module.css';
import { FaMinus } from 'react-icons/fa';

export function EmployerForm({ jobeditdata }) {
  const { id } = useParams();
  const EditData = id;
  const navigate = useNavigate();
  const employerapi = EmployerAPIS();
  const userapi = UserApi();
  const [new_countries_data, setNew_countries_data] = useState([]);
  const [new_allstates, setNew_allstates] = useState([]);
  const [new_allcities, setNew_Allcities] = useState([]);
  const [countryID, setcountryID] = useState('');
  const [formloading, setFormloading] = useState(false);
  const [isloading, setIsloading] = useState(false);
  const [isaddQuestion, setisaddQuestion] = useState(false); //
  const [isaddSkills, setisaddSkills] = useState(false); //
  const [skills, setSkills] = useState([]);
  const [questions, setQuestions] = useState([]);
  const [newQuestion, setNewQuestion] = useState('');
  const [Selectedcity, setSelectedcity] = useState('');
  const [editIndex, setEditIndex] = useState(-1);
  const [hide_company, sethide_company] = useState(false);
  const [urgenthiring, seturgenthiring] = useState(false);
  // const [show, setshow] = useState()
  const [allselected, setallselected] = useState({
    numberofhiring: '', //select
    jobtype: '', //select
    category: '', //select
    range: '', //select
    rate: '', //select
    country: '',
    state: '',
    city: '', //select
    expereince: '',
  });

  const [dateValues, setDateValues] = useState({
    applicationDeadline: null,
  });
  const [jobDetails, setjobDetails] = useState({
    job_title: '',
    minimunpay: '',
    maximumpay: '',
    description: '',
  });

  const getJobInformation = async () => {
    setFormloading(true);
    try {
      const response = await employerapi.getOneJob(EditData);
      if (response) {
        setallselected({
          country: response?.hiring_country,
          state: response?.hiring_state,
          city: response?.hiring_city, //select
          numberofhiring: response?.hiring_number, //select
          jobtype: response?.type, //select
          category: response?.category, //select
          range: response?.salary_rate, //select
          rate: response?.salary_type, //select
          expereince: response?.experience,
        });
        setSelectedcity(response?.hiring_city);
        setjobDetails({
          job_title: response?.title,
          minimunpay: response?.salary_start_range,
          maximumpay: response?.salary_end_range,
          description: response?.description,
        });
        setQuestions(JSON?.parse(response?.question));
        setSkills(JSON?.parse(response?.skills));
        setDateValues({
          applicationDeadline: response?.application_deadline,
        });
        seturgenthiring(response?.hiring_timeline);
        sethide_company(response?.hide_company);
        setFormloading(false);
      } else {
        setFormloading(false);
        console.error('Error');
      }
    } catch (error) {
      setFormloading(false);
      console.error('Error', error);
    }
  };

  const handleNewCountryChange = async (value) => {
    setFormloading(true);
    setallselected({
      ...allselected,
      country: value?.name,
      state: '',
      city: '',
    });
    if (value) {
      try {
        // setSelectedcity("");
        setcountryID(value?.id);
        const allstates = await userapi.getStates(value?.id);
        setNew_allstates(allstates);
        setFormloading(false);
        if (allstates.length === 0) {
          Toast.error('States Not Found!');
          setFormloading(false);
        }
        setSelectedcity('');
      } catch (error) {
        console.error('Error', error);
        setFormloading(false);
      }
    } else {
      setFormloading(false);
      Toast.error('States Not Found!');
      console.error('Not Found');
    }
  };

  const handleNewStateChange = async (value) => {
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
        setNew_Allcities(citiesObjects);
        setFormloading(false);
        if (citiesObjects?.length === 0) {
          Toast.error('Cities Not Found!');
          setFormloading(false);
        }
      } catch (error) {
        setFormloading(false);
        console.error(error);
      }
    } else {
      setFormloading(false);
      console.warn('Select The Country and State Again');
    }
  };

  const countriesApi = async () => {
    try {
      let response = await userapi.getCountries();
      setNew_countries_data(response);
    } catch (error) {
      console.error('Error in Find Job', error);
    }
  };
  const handleChange = (event) => {
    sethide_company(event.target.checked);
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
  const handleUrgentHiring = (event) => {
    seturgenthiring(event.target.checked);
  };
  const handleDeleteQuestion = (index) => {
    const updatedQuestions = [...questions];
    updatedQuestions.splice(index, 1);
    setQuestions(updatedQuestions);
  };

  // const Submit = () => {
  //     // Toggle the showDialog state based on its current value
  //     setShowDialog((prevShowDialog) => !prevShowDialog);
  // };

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
      hiring_number: allselected.numberofhiring,
      hiring_country: allselected.country,
      hiring_state: allselected.state,
      hiring_city: allselected.city,
      category: allselected.category,
      description: jobDetails.description,
      type: allselected.jobtype,
      hide_company: hide_company,
      experience: allselected.expereince,
      salary_rate: allselected.range,
      salary_start_range: parseInt(jobDetails.minimunpay?.replace(',', ''), 10),
      salary_end_range: parseInt(jobDetails.maximumpay?.replace(',', ''), 10),
      salary_type: allselected.rate,
      hiring_timeline: urgenthiring,
      application_deadline: dateValues.applicationDeadline,
      skills: JSON.stringify(skills),
      question: JSON.stringify(questions),
    };
    const updatedDatawithExatcAmount = {
      title: jobDetails.job_title,
      hiring_number: allselected.numberofhiring,
      hiring_country: allselected.country,
      hiring_state: allselected.state,
      hiring_city: allselected.city,
      category: allselected.category,
      description: jobDetails.description,
      experience: allselected.expereince,
      type: allselected.jobtype,
      hide_company: hide_company,
      salary_rate: allselected.range,
      salary_start_range: parseInt(jobDetails.minimunpay?.replace(',', ''), 10),
      salary_end_range: parseInt(jobDetails.minimunpay?.replace(',', ''), 10),
      salary_type: allselected.rate,
      hiring_timeline: urgenthiring,
      application_deadline: dateValues.applicationDeadline,
      skills: JSON.stringify(skills),
      question: JSON.stringify(questions),
    };
    if (!checkEmptyFields(updatedData || updatedDatawithExatcAmount)) {
      setIsloading(false);
      return;
    }
    try {
      const response = await employerapi.editjobDetails(
        allselected.rate === 'Extact Amount'
          ? updatedData
          : updatedDatawithExatcAmount,
        EditData,
      );
      Toast.success('Job Update Successfully!');
      navigate('/employer/jobs');
      setIsloading(false);
    } catch (error) {
      Toast.error('Please Try Later!');
      setIsloading(false);
    }
    setIsloading(false);
  };
  const generalSkills = [
    { skill: 'Communication' },
    { skill: 'Problem Solving' },
    { skill: 'Critical Thinking' },
    { skill: 'Creativity' },
    { skill: 'Time Management' },
    { skill: 'Teamwork' },
    { skill: 'Leadership' },
    { skill: 'Adaptability' },
    { skill: 'Flexibility' },
    { skill: 'Attention to Detail' },
    { skill: 'Organizational Skills' },
    { skill: 'Interpersonal Skills' },
    { skill: 'Decision Making' },
    { skill: 'Emotional Intelligence' },
    { skill: 'Analytical Skills' },
    { skill: 'Numeracy' },
    { skill: 'Research Skills' },
    { skill: 'Presentation Skills' },
    { skill: 'Customer Service' },
    { skill: 'Sales Skills' },
    { skill: 'Negotiation Skills' },
    { skill: 'Project Management' },
    { skill: 'Data Analysis' },
    { skill: 'Programming' },
    { skill: 'Web Development' },
    { skill: 'Graphic Design' },
    { skill: 'Video Editing' },
    { skill: 'Photography' },
    { skill: 'Content Writing' },
    { skill: 'SEO (Search Engine Optimization)' },
    { skill: 'Social Media Management' },
    { skill: 'Financial Literacy' },
    { skill: 'Public Speaking' },
    { skill: 'Networking' },
    { skill: 'Problem-solving' },
    { skill: 'Collaboration' },
    { skill: 'Decision-making' },
    { skill: 'Adaptability' },
    { skill: 'Leadership' },
    { skill: 'Conflict Resolution' },
    { skill: 'Time Management' },
    { skill: 'Stress Management' },
    { skill: 'Self-Motivation' },
    { skill: 'Learning Agility' },
    { skill: 'Research Skills' },
    { skill: 'Digital Literacy' },
    { skill: 'Risk Management' },
    { skill: 'Quality Assurance' },
    { skill: 'Strategic Thinking' },
    { skill: 'Business Development' },
    { skill: 'Market Analysis' },
    { skill: 'Customer Relationship Management (CRM)' },
    { skill: 'Supply Chain Management' },
    { skill: 'Human Resources Management' },
    { skill: 'Talent Acquisition' },
    { skill: 'Performance Management' },
    { skill: 'Employee Training and Development' },
    { skill: 'Legal Knowledge' },
    { skill: 'Regulatory Compliance' },
    { skill: 'Foreign Languages' },
    { skill: 'Cross-Cultural Competence' },
    { skill: 'First Aid/CPR' },
    { skill: 'Mechanical Skills' },
    { skill: 'Electrical Skills' },
    { skill: 'Coding' },
    { skill: 'Problem-solving' },
    { skill: 'Debugging' },
    { skill: 'Version Control (e.g., Git)' },
    { skill: 'Data Structures and Algorithms' },
    { skill: 'Object-Oriented Programming (OOP)' },
    { skill: 'Web Development Frameworks (e.g., React, Angular)' },
    { skill: 'Mobile App Development' },
    { skill: 'Database Management' },
    { skill: 'Cybersecurity' },
    { skill: 'Cloud Computing' },
    { skill: 'Machine Learning' },
    { skill: 'Artificial Intelligence' },
    { skill: 'Data Visualization' },
    { skill: 'Statistical Analysis' },
    { skill: 'Mathematical Modeling' },
    { skill: 'Quantitative Research' },
    { skill: 'Qualitative Research' },
    { skill: 'Experimental Design' },
    { skill: 'Literature Review' },
    { skill: 'Interviewing Skills' },
    { skill: 'Survey Design' },
    { skill: 'Report Writing' },
    { skill: 'Presentation Skills' },
    { skill: 'Project Management' },
    { skill: 'Time Management' },
    { skill: 'Budgeting' },
    { skill: 'Risk Management' },
    { skill: 'Stakeholder Management' },
    { skill: 'Agile Methodologies' },
    { skill: 'Scrum' },
    { skill: 'Kanban' },
    { skill: 'Lean Methodologies' },
    { skill: 'Six Sigma' },
    { skill: 'Continuous Improvement' },
    { skill: 'Change Management' },
    { skill: 'Strategic Planning' },
    { skill: 'Market Research' },
    { skill: 'Competitive Analysis' },
    { skill: 'Financial Analysis' },
    { skill: 'Business Intelligence Tools' },
    { skill: 'Data Management' },
    { skill: 'Data Visualization Tools' },
    { skill: 'Forecasting' },
    { skill: 'Inventory Management' },
    { skill: 'Logistics' },
    { skill: 'Procurement' },
    { skill: 'Retail Management' },
    { skill: 'Sales Forecasting' },
    { skill: 'Customer Relationship Management (CRM)' },
    { skill: 'E-commerce Platforms' },
    { skill: 'Digital Marketing' },
    { skill: 'Content Management Systems (CMS)' },
    { skill: 'Search Engine Optimization (SEO)' },
    { skill: 'Social Media Marketing' },
    { skill: 'Email Marketing' },
    { skill: 'Analytics and Reporting' },
    { skill: 'User Experience (UX) Design' },
    { skill: 'User Interface (UI) Design' },
    { skill: 'Wireframing' },
    { skill: 'Prototyping' },
    { skill: 'Usability Testing' },
    { skill: 'Responsive Design' },
    { skill: 'Cross-Browser Compatibility' },
    { skill: 'Accessibility Standards' },
    { skill: 'Graphic Design Software (e.g., Adobe Creative Suite)' },
    { skill: 'Typography' },
    { skill: 'Color Theory' },
    { skill: 'Print Design' },
    { skill: 'Brand Identity Design' },
    { skill: 'Illustration' },
    { skill: 'Motion Graphics' },
    { skill: 'Animation Software (e.g., Adobe After Effects)' },
    { skill: '3D Modeling Software (e.g., Autodesk Maya, Blender)' },
    { skill: 'Game Design' },
    { skill: 'Virtual Reality (VR) Development' },
    { skill: 'Augmented Reality (AR) Development' },
    { skill: 'Video Production' },
    { skill: 'Photography' },
    { skill: 'Audio Editing' },
    { skill: 'Music Production' },
    { skill: 'Live Streaming' },
    { skill: 'Podcasting' },
    { skill: 'Scriptwriting' },
    { skill: 'Voiceover' },
    { skill: 'Storytelling' },
    { skill: 'Narration' },
    { skill: 'Speechwriting' },
    { skill: 'Language Translation' },
    { skill: 'Other' },
  ];

  useEffect(() => {
    getJobInformation();
    countriesApi();
  }, []);

  useEffect(() => {
    if (allselected?.country) {
      const NEWID = new_countries_data?.filter(
        (e) => e?.name === allselected?.country,
      );
      handleNewCountryChange({
        name: allselected?.country,
        id: NEWID[0]?.id,
      });
    }
  }, [allselected?.country]);

  useEffect(() => {
    if (allselected?.country && allselected?.state) {
      handleNewStateChange({ name: allselected?.state });
    }
  }, [allselected?.country, allselected?.state]);

  const MAX_SKILLS = 6;

  return (
    <>
      {formloading ? (
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            height: '90vh',
          }}
        >
          <CustomSpinner />
        </div>
      ) : (
        <>
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
                fontSize={45}
                // style={{fontSize=}}
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
                <label className={styles.inputLabels}>Job Title</label>
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
                <label className={styles.inputLabels}>Job Deatils</label>
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
                  <div className="col-md-12 mb-2">
                    <label className={styles.inputLabels}>Job Category</label>
                    <ResumeSelect
                      title="Category"
                      options={INDUSTRY_CHOICES}
                      name="category"
                      value={allselected.category}
                      onChange={handleSelectChange}
                      required
                    />
                  </div>
                </div>
                <div className="row">
                  <div className="col-md-6 mb-2">
                    <label className={styles.inputLabels}>
                      Number of Hiring
                    </label>
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
                    <label className={styles.inputLabels}>Job Country</label>
                    <AutoCompleteInput
                      onSelectedChange={handleNewCountryChange}
                      label="Choose a Country"
                      data={new_countries_data}
                      Value={{ name: allselected?.country }}
                    />
                  </div>
                  <div className="col-md-6 mb-2">
                    <label>Choose a State</label>
                    <AutoCompleteInput
                      disabled={!allselected?.country}
                      onSelectedChange={handleNewStateChange}
                      label="Choose a State"
                      data={new_allstates}
                      Value={{ name: allselected?.state }}
                    />
                  </div>
                  <div className="col-md-6 mb-2">
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
                      Value={{
                        name: allselected?.city
                          ? allselected?.city
                          : Selectedcity,
                      }}
                      data={new_allcities}
                    />
                  </div>
                </div>
                <div className="row">
                  <div className="col-md-6 mb-2">
                    <label className={styles.inputLabels}>Job Type *</label>
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
                  <div className="col-md-6 mb-2">
                    <label className={styles.inputLabels}>
                      Expereince Required *
                    </label>
                    <ResumeSelect
                      width="100%"
                      title="Expereince"
                      options={EXPERIENCE_CHOICES}
                      name="expereince"
                      value={allselected?.expereince}
                      onChange={handleSelectChange}
                      required
                    />
                  </div>
                </div>
                <div className="row">
                  <div className="col-md-6 mb-2">
                    <label className={styles.inputLabels}>Salary Rate</label>
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
                    <label className={styles.inputLabels}>Salary Type</label>
                    <ResumeSelect
                      title="Type"
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
                        <label className={styles.inputLabels}>
                          Minimum Salary
                        </label>
                        <ResumeInput
                          placeholder="Minimum"
                          name="minimunpay"
                          value={jobDetails.minimunpay}
                          // value={jobDetails.minimunpay.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",")}
                          onChange={handleInputChange}
                          required
                          borderradius={'0.25rem'}
                          padding={13}
                          thousandSeparator
                        />
                      </div>
                      <div className="col-md-6 mb-2">
                        <label className={styles.inputLabels}>
                          Maximum Salary
                        </label>
                        <ResumeInput
                          placeholder="Maximum"
                          name="maximumpay"
                          value={jobDetails.maximumpay}
                          onChange={handleInputChange}
                          required
                          borderradius={'0.25rem'}
                          padding={13}
                          thousandSeparator
                        />
                      </div>
                    </div>
                  </>
                ) : allselected.rate === 'Extact Amount' ? (
                  <div className="row">
                    <div className="col-12">
                      <label className={styles.inputLabels}>
                        Extact Amount
                      </label>
                      <ResumeInput
                        placeholder="Extact Amount"
                        name="minimunpay"
                        value={jobDetails.minimunpay}
                        onChange={handleInputChange}
                        thousandSeparator
                        required
                        borderradius={'0.25rem'}
                        padding={13}
                      />
                    </div>
                  </div>
                ) : null}

                <div className="row">
                  <div className="col-md-12 mb-2">
                    <label
                      style={{
                        fontSize: '14.inputLabelspx',
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

            <div
              onClick={() => setisaddQuestion(!isaddQuestion)}
              style={{
                display: 'flex',
                alignItems: 'center',
                marginTop: '.5rem',
                cursor: 'pointer',
              }}
            >
              <p>{`${!isaddQuestion ? 'Add Question' : 'Close Question Tab'}`}</p>
              {/* <FontAwesomeIcon icon={!isaddQuestion ? <FaPlus/> : <FaMinus/>} />
               */}
              {isaddQuestion ? <FaMinus /> : <FaPlus />}
            </div>
            {isaddQuestion && (
              <div className={styles.prescreenQuestion}>
                <h2 style={{ cursor: 'pointer' }}>Pre-screen Applicants</h2>
                <div style={{ paddingLeft: '0rem', margin: '0.5rem 0rem' }}>
                  {questions.length > 0 ? (
                    questions &&
                    questions?.map((question, index) => (
                      <div key={index} className={styles.Questions}>
                        <div style={{ width: '100%', wordWrap: 'break-word' }}>
                          <p className={styles.text}>{question.question}</p>
                        </div>
                        <div
                          style={{
                            display: 'flex',
                            justifyContent: 'flex-end',
                          }}
                        >
                          {/* <FontAwesomeIcon
                                              onClick={() => handleEditQuestion(index)}
                                              className={styles.QuesBoxIcon}
                                              icon={faEdit}
                                            /> */}
                          <FaEdit
                            onClick={() => handleEditQuestion(index)}
                            className={styles.QuesBoxIcon1}
                          />
                          {/* <FontAwesomeIcon
                                              onClick={() => handleDeleteQuestion(index)}
                                              className={styles.QuesBoxIcon}
                                              icon={faTrash}
                                            /> */}
                          <FaTrashAlt
                            onClick={() => handleDeleteQuestion(index)}
                            className={styles.QuesBoxIcon1}
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
                  <label className={styles.inputLabels}>Enter Questions</label>
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
                  <button
                    style={{
                      backgroundColor: 'gray',
                      padding: 10,
                      borderRadius: 20,
                      color: 'white',
                      marginTop: 15,
                    }}
                    onClick={handleAddQuestion}
                  >
                    {editIndex === -1 ? 'Add Question' : 'Save Question'}
                  </button>
                </div>
              </div>
            )}
            <div
              onClick={() => setisaddSkills(!isaddSkills)}
              style={{
                display: 'flex',
                alignItems: 'center',
                marginTop: '.5rem',
                cursor: 'pointer',
              }}
            >
              <p>{`${!isaddSkills ? 'Add Skills' : 'Close Skills Tab'}`}</p>
              {/* <FontAwesomeIcon icon={!isaddSkills ? faPlus : faMinus} /> */}
              {isaddSkills ? <FaMinus /> : <FaPlus />}
            </div>

            {isaddSkills && (
              <div className="col-sm-6">
                {/* <div className={style.skillinputfield}> */}
                <div>
                  <Autocomplete
                    limitTags={4}
                    multiple
                    id="tags-filled"
                    options={generalSkills?.map((option) => option?.skill)}
                    defaultValue={[]}
                    freeSolo
                    value={skills}
                    onChange={(event, newValue) => {
                      if (newValue?.length <= MAX_SKILLS) {
                        setSkills(newValue);
                      }
                    }}
                    renderInput={(params) => (
                      <TextField
                        {...params}
                        // variant="filled"
                        // label="Add Skills"
                        placeholder="Add Skills"
                      />
                    )}
                  />
                </div>
              </div>
            )}

            <div className={styles.buttons}>
              {isloading ? (
                <div>
                  <CustomSpinner />
                </div>
              ) : EditData ? (
                <CustomButton
                  onClick={updateJobDetails}
                  label="Update Job"
                  width={'20%'}
                  borderRadius={10}
                  boxShadow={'2px 2px 10px #1967d2'}
                  className={styles.hfhfhf}
                />
              ) : (
                <CustomButton
                  onClick={Submit}
                  label="Create Job"
                  width={'20%'}
                  borderRadius={10}
                  boxShadow={'2px 2px 10px #1967d2'}
                  className={styles.hfhfhf}
                />
              )}
            </div>
          </div>
        </>
      )}
    </>
  );
}
