import { FaCalendar } from 'react-icons/fa';
import { FaUser } from 'react-icons/fa';
import { FaBriefcase } from 'react-icons/fa';
import { FaStar } from 'react-icons/fa';
import { FaClock } from 'react-icons/fa';
import { FaCreditCard } from 'react-icons/fa';
import { FaLocationDot, FaMoneyBillWave, FaPerson } from 'react-icons/fa6';
import { FaBagShopping } from 'react-icons/fa6';
import { FaEdit } from 'react-icons/fa';
import { BiSolidCategory } from 'react-icons/bi';
import { RiPassExpiredFill, RiUserSearchFill } from 'react-icons/ri';
import { Avatar } from '@mui/material';
import Box from '@mui/material/Box';
import Grid from '@mui/material/Grid';
import * as React from 'react';
import { useEffect, useState } from 'react';
import Modal from 'react-bootstrap/Modal';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import EmployerAPIS from '../../../Apis/EmployerApi';
import UserApi from '../../../Apis/UserApi';
import ChangeDate from '../../../Helpers/DateConvertion';
import { addThousandSeparator } from '../../../Helpers/ThousandSeparator';
import CustomButton from '../../../component/Button/CustomButton';
import Goback from '../../../component/GoBackicon/goback';
import JobDescriptionComponent from '../../../component/JobDescription/JobDescriptionComponent';
import Jobcard from '../../../component/Jobcard/Jobcard';
import CustomSpinner from '../../../component/Spinner/Spinner';
import Toast from '../../../component/Toast/Toast';
import SmalldetailCard from '../../CommonPages/SmalldetailCard/SmalldetailCard';
import { LOCAL_PDF_EMPLOYER } from '../../Jsondata/URL';
import styles from './JobDetails.module.css';
import { useDispatch, useSelector } from 'react-redux';
import {
  bookmarkJob,
  removebookmarkJob,
} from '../../../../redux/slice/jobSlice';

function CandidateModal({ show, onHide, candidateData }) {
  const userapi = UserApi();
  const questionLenght = JSON?.parse(candidateData?.question);
  const navigate = useNavigate();
  const [isloading, setisloading] = useState(false);
  const employerapi = EmployerAPIS();
  const [file, setFile] = useState(null);
  const [cheak, setcheak] = useState(false);
  const [currentSection, setCurrentSection] = useState(0);
  const [Q, setQ] = useState(JSON?.parse(candidateData?.question));

  const handleAnswerChange = (i, answer) => {
    setQ((prevQ) => {
      return (
        prevQ &&
        prevQ?.map((value, index) => {
          if (index === i) {
            return { ...value, answer };
          }
          return value;
        })
      );
    });
  };

  const handleFileChange = (event) => {
    setFile(event.target.files[0]);
  };
  const GETME = async () => {
    try {
      const response = await userapi.viewResume();
      const pdfBlob = new Blob([response], { type: 'application/pdf' });
      const pdfUrl = URL.createObjectURL(pdfBlob);
      setFile(pdfUrl);
      // if (pdfUrl) {
      //   openPdfInNewWindow();
      // } else {
      //   setNotFound(true);
      // }
    } catch (error) {
      console.error('Error fetching PDF', error);
    }
  };

  const openPdfInNewWindow = () => {
    if (file) {
      window.open(file, '_blank');
    } else {
      console.error('ResumeAuth URL is null');
    }
  };

  const handleNext = () => {
    if (currentSection === 2) {
      const NewDAta = {
        prescreen: Q,
      };
      const allAnswersFilled = NewDAta.prescreen.every(
        (item) => item.answer.trim() !== ''
      );
      if (!allAnswersFilled) {
        Toast.error('Please Answer The Following Questions!');
        return;
      }
    }
    setCurrentSection(currentSection + 1);
  };

  const handleBack = () => {
    if (questionLenght.length > 0) {
      setCurrentSection(currentSection - 1);
    } else {
      setCurrentSection(0);
    }
  };

  const SubmitApplication = async () => {
    setisloading(true);
    const NewDAta = {
      resume: file,
      prescreen: Q,
      status: cheak,
    };
    if (!file) {
      Toast.error('Please Upload or Create Resume');
      setisloading(false);
      return;
    }
    const allAnswersFilled = NewDAta.prescreen.every(
      (item) => item.answer.trim() !== ''
    );
    if (!allAnswersFilled) {
      Toast.error('Please Answer The Following Questions!');
      setisloading(false);
      return;
    }
    try {
      const Data = new FormData();
      Data.append('resume', NewDAta.resume);
      const prescreenData = JSON?.stringify(NewDAta?.prescreen);
      Data.append('prescreen', prescreenData);
      Data.append('check', NewDAta?.status);
      Data.append('job', candidateData?.id);
      const response = await userapi.userjobApply(Data);
      Toast.success('Thanks For Apply!');
      setisloading(false);
      navigate('/findJobs');
    } catch (error) {
      Toast.error('Please Try Later!');
      setisloading(false);
    }
  };

  useEffect(() => {
    GETME();
  }, []);

  return (
    <Modal
      show={show}
      size="lg"
      aria-labelledby="contained-modal-title-vcenter"
      centered
      onHide={onHide}
    >
      <Modal.Header closeButton>
        <Modal.Title id="contained-modal-title-vcenter">
          {currentSection === 0 ? `PandaPlacement` : `Step # ${currentSection}`}
        </Modal.Title>
        <Box sx={{ width: '70%' }}>{/* <LinearProgress /> */}</Box>
      </Modal.Header>
      <Modal.Body>
        {currentSection === 0 && (
          <>
            <div style={{ textAlign: 'center' }}>
              <>
                <p>Want to Update Profile Before Applying this Job?</p>
                <Link
                  to="/profile"
                  style={{
                    textDecoration: 'none',
                    color: 'var(--primary-color)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    marginTop: '1rem',
                  }}
                >
                  <span style={{ marginRight: '0.5rem' }}>Edit Profile</span>
                  <FaEdit
                  //  icon={faEdit}
                  />
                </Link>
              </>
            </div>
          </>
        )}

        {currentSection === 1 && (
          <>
            {!file ? (
              <div style={{ textAlign: 'center' }}>
                <p
                  style={{
                    color: 'var(--red-color)',
                    lineHeight: '0px',
                    marginBottom: '1rem',
                  }}
                >
                  {/* Resume Already Upload */}
                  Please Upload Resume
                </p>
                <input
                  onClick={() => {
                    setcheak(!cheak);
                  }}
                  type="checkbox"
                />
                <label style={{ marginLeft: '1rem' }}>Upload Resume Here</label>
              </div>
            ) : (
              <div style={{ textAlign: 'center' }}>
                <p
                  style={{
                    color: 'var(--green)',
                    lineHeight: '1px',
                    marginBottom: '1rem',
                  }}
                >
                  Resume Already Upload
                </p>
                <input
                  onClick={() => {
                    setcheak(!cheak);
                  }}
                  type="checkbox"
                />
                <label style={{ marginLeft: '1rem' }}>
                  Upload A New Resume Here
                </label>
              </div>
            )}
            <div className={styles?.leftSide}>
              {cheak ? (
                <div className="form-group w-full border border-var(--black) my-2 px-8 py-8 rounded flex items-center justify-center">
                  <input
                    type="file"
                    id="pdfFile"
                    accept=".pdf"
                    onChange={handleFileChange}
                  />
                </div>
              ) : null}

              {isloading ? (
                <div style={{ display: 'flex', justifyContent: 'center' }}>
                  <CustomSpinner />
                </div>
              ) : (
                <div
                  style={{
                    display: 'flex',
                    justifyContent: 'space-around',
                    marginTop: '1rem',
                  }}
                >
                  {cheak ? (
                    // />
                    <></>
                  ) : (
                    <CustomButton
                      backgroundcolor="var(--gray)"
                      width="40%"
                      type="submit"
                      label="View Resume"
                      onClick={openPdfInNewWindow}
                    />
                  )}
                </div>
              )}
            </div>
          </>
        )}

        {currentSection === 2 && (
          <div style={{ height: '60vh', overflowY: 'scroll' }}>
            {candidateData && questionLenght.length > 0 ? (
              JSON?.parse(candidateData?.question)?.map((e, i) => (
                <React.Fragment key={i}>
                  <p
                    style={{
                      fontWeight: 500,
                      color: 'var(--black)',
                      margin: '20px 5px',
                    }}
                  >
                    <span
                      style={{
                        color: 'var(--black)',
                        fontSize: 15,
                        marginRight: 10,
                        fontWeight: 400,
                        cursor: 'pointer',
                      }}
                    >
                      Q. {i + 1}
                    </span>
                    {e.question}
                  </p>
                  <input
                    className={styles.QuesInput}
                    onChange={(e) => handleAnswerChange(i, e.target.value)}
                    placeholder="Please Answer Below"
                  />
                  {/* <p>{e.answer ? e.answer : "Answer Not Found"}</p> */}
                </React.Fragment>
              ))
            ) : (
              <>{currentSection === 2 && handleNext()}</>
            )}
          </div>
        )}

        {currentSection === 3 && (
          <div>
            <h5 style={{ textAlign: 'center' }}>
              Application Ready Please Submit.
            </h5>
            {/* <LinearProgress /> */}
          </div>
        )}
      </Modal.Body>
      <Modal.Footer>
        <>
          {currentSection > 0 && (
            <CustomButton label="< back" onClick={handleBack} />
          )}

          {currentSection < 3 && (
            <CustomButton label="next >" onClick={handleNext} />
          )}

          {currentSection == 3 &&
            (isloading ? (
              <CustomSpinner />
            ) : (
              <CustomButton label="Submit" onClick={SubmitApplication} />
            ))}
        </>
      </Modal.Footer>
    </Modal>
  );
}

export default function JobDetails() {
  const dispatch = useDispatch();
  const userapi = UserApi();
  const location = useLocation();
  const jobSlug = location?.pathname?.slice(5);
  const navigate = useNavigate();
  const isAuthenticated = useSelector(
    (state) => state.loginuser.isAuthenticated
  );
  const [isloading, setIsloading] = useState(false);
  const [Progress, setProgress] = useState(0);
  const [isFilterScreen, setisFilterScreen] = useState(false);
  const [related_job, setrelated_job] = useState();
  const [modalShow, setModalShow] = useState(false);
  const [jodIDFound, setjodIDFound] = useState(null);
  const [jobDetail, setJobDetail] = useState('');
  // const bookmarkJob = useSelector((state) => state.bookmarkedJob);

  // const datePostedAgo = jobDetail.created_at
  // const dateObj = new Date(datePostedAgo);
  // const time = dateObj.toLocaleTimeString([], {hour: '2-digit', minute: '2-digit', hour12: false});

  const dateString = jobDetail?.application_deadline;
  const date = new Date(dateString);
  const monthNames = [
    'January',
    'February',
    'March',
    'April',
    'May',
    'June',
    'July',
    'August',
    'September',
    'October',
    'November',
    'December',
  ];
  const month = monthNames[date.getMonth()];
  const day = date.getDate();
  const year = date.getFullYear();
  const formattedDate = `${month} ${day.toString().padStart(2, '0')}, ${year}`;
  const addBookmark = async (e) => {
    try {
      const response = await userapi.postSaveJobs(e);
      Toast.success('Job Saved');
      dispatch(bookmarkJob(e));
    } catch (error) {
      console.error('ERROR:ADDING THE BOOKMARK', error);
    }
  };

  const deleteBookmark = async (id) => {
    // setisloading(true)
    try {
      const response = await userapi.deleteSaveJobs(id);
      Toast.success('Job unSaved');
      dispatch(removebookmarkJob(id));
    } catch (error) {
      // setisloading(false)
      console.log('Error in My JOb', error);
      Toast.error('ERROR: Please Try Later');
    }
  };

  const getRelatedJobs = async (title) => {
    try {
      const response = await userapi.getRelatedJobs(title);
      const jobsWithTimeAgo = response?.map((job) => {
        // Check if 'created_at' property exists
        if (job && job.created_at) {
          const timeAgo = ChangeDate(job?.created_at); //Converting date Into Human Readable Format ::Helper fun()
          return {
            ...job,
            postedAgo: timeAgo,
          };
        } else {
          console.warn("Job object is missing 'created_at' property:", job);
          return job;
        }
      });
      setrelated_job(jobsWithTimeAgo);
    } catch (error) {
      console.error('Error In Related Jobs', error);
    }
  };

  useEffect(() => {
    getRelatedJobs(jobDetail?.title);
    window.scrollTo(0, 0);
  }, [jobDetail?.title, isAuthenticated]);

  useEffect(() => {
    window.scrollTo(0, 0); // Scroll to the top when the component mounts
  }, []);

  const getProfileProgress = async () => {
    try {
      const response = await userapi.userProfileProgress();
      setProgress(response?.progress);
    } catch (error) {
      console.error('Progress Profile Error', error);
    }
  };

  const getGuestJobDetail = async () => {
    try {
      const response = await userapi.GetOneJob(jobSlug);
      setJobDetail(response);
    } catch (error) {
      console.error('One Job Details Error', error);
    }
  };
  const handleJobView = async () => {
    try {
      const chackJobs = localStorage.getItem('viewedJobs');
      await userapi.userJobViewCount(jobSlug);
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    getGuestJobDetail();
  }, [jobSlug]);

  useEffect(() => {
    getProfileProgress();
    handleJobView();
  }, [isAuthenticated]);

  const handleApplyClick = async () => {
    // Add your logic to handle the application here
    if (isAuthenticated) {
      if (Progress >= 65) {
        setModalShow(true);
      } else {
        Toast.error('Please Complete Your Profile More Than 65%');
      }
    } else {
      Toast.error('Please Login First!');
    }
    return;
  };

  const cheakAlreadyApply = async () => {
    try {
      const response = await userapi?.userAppliedJobs();
      const matchingJobs = response?.filter(
        (job) => job?.job_id === jobDetail?.id
      );
      if (matchingJobs?.length > 0) {
        setjodIDFound(true);
      } else {
        setjodIDFound(false);
      }
    } catch (error) {
      console.error('Error: fetching applied jobs', error);
    }
  };

  React.useMemo(() => {
    if (isAuthenticated) {
      cheakAlreadyApply();
    }
  }, [jobDetail, isAuthenticated]);

  return (
    <>
      {/* <Fade bottom> */}
      {jobDetail && (
        <CandidateModal
          show={modalShow}
          onHide={() => setModalShow(false)}
          candidateData={jobDetail}
        />
      )}
      <div
        style={{
          backgroundColor: 'var(--light-shade-blue-gray)',
        }}
      >
        <Box
          sx={{ flexGrow: 1 }}
          style={{
            position: 'relative',
            top: '50px',
          }}
          className={styles.jobdetailsbody}
        >
          <Box>
            <div
              className={
                isFilterScreen
                  ? styles['popular-job-categoryOnIsFilter']
                  : styles['popular-job-category']
              }
              style={{
                backgroundColor: 'var(--white-color)',
                padding: '30px',
                borderRadius: '10px',
              }}
            >
              <div className={styles.imageandtitlewrapper}>
                <Goback />
                <div style={{ marginLeft: '1.5rem', marginRight: '1.5rem' }}>
                  <Avatar
                    alt="Company Logo"
                    src={`${LOCAL_PDF_EMPLOYER}${jobDetail?.company?.logo}`}
                    sx={{ width: 100, height: 100 }}
                  />
                </div>
                <div className={styles['category-info']}>
                  <div className={styles['title']}>
                    <h2 className="mt-3">{jobDetail?.title}</h2>
                  </div>

                  <div className={styles.oneiconandnamewrapper}>
                    <div className={styles.oneiconandname}>
                      <FaPerson
                        color="var(--gray)"
                        // icon={faBagShopping}
                      />
                      <p>
                        {jobDetail?.hiring_number
                          ? jobDetail?.hiring_number
                          : 'Not Found'}
                      </p>
                    </div>
                    <div className={styles.oneiconandname1}>
                      <FaLocationDot
                        color="var(--gray)"
                        // icon={faLocationArrow}
                      />
                      <p>
                        {jobDetail?.hiring_city},{jobDetail?.hiring_country}
                      </p>
                    </div>
                    <div className={styles.oneiconandname1}>
                      <FaClock
                        color="var(--gray)"
                        // icon={faClock}
                      />
                      <p>{ChangeDate(jobDetail?.created_at)}</p>
                    </div>
                    <div className={styles.oneiconandname1}>
                      <FaMoneyBillWave
                        color="var(--gray)"
                        // icon={faMoneyBill}
                      />
                      {jobDetail?.salary_start_range &&
                        jobDetail?.salary_end_range && (
                          <p>
                            {jobDetail.salary_currency}{' '}
                            {addThousandSeparator(
                              jobDetail?.salary_start_range
                            )}{' '}
                            -{jobDetail.salary_currency}{' '}
                            {addThousandSeparator(jobDetail?.salary_end_range)}
                          </p>
                        )}
                      {!jobDetail?.salary_start_range &&
                        !jobDetail?.salary_end_range && (
                          <p>Market Compatible</p>
                        )}
                    </div>
                  </div>
                  {/* JOb TYPE CARD  */}
                  <div className={styles.info}>
                    <div className={styles.item}>
                      <p
                        className={styles.text}
                        style={getTextStyle('Full Time')}
                      >
                        {jobDetail?.type}
                      </p>
                    </div>
                    {jobDetail?.hide_company === true ? (
                      <div className={styles.item}>
                        <p
                          className={styles.text}
                          style={getTextStyle('Private')}
                        >
                          Private
                        </p>
                      </div>
                    ) : null}
                    {/* <div className={styles.item}>
                    <p className={styles.text} style={getTextStyle("Urgent")}>
                      Urgent
                    </p>
                  </div> */}
                  </div>
                </div>
              </div>

              <div className={styles.buttonandicon}>
                {isloading ? (
                  <CustomSpinner />
                ) : jodIDFound ? (
                  <CustomButton
                    onClick={() => {
                      Toast.error('Already Applied!');
                      navigate('/findJobs');
                    }}
                    label={'Apply For A Job'}
                  />
                ) : (
                  <CustomButton
                    onClick={handleApplyClick}
                    variant="contained"
                    size="large"
                    label={'Apply For A Job'}
                  />
                )}
                {/* <FontAwesomeIcon
                onClick={() => {
                  Toast.success("Coming Soon...");
                }}
                color="var(--gray)"
                className={styles.bookmark}
                icon={faBookmark}
              /> */}
              </div>
            </div>
          </Box>
          <Grid container spacing={2} className={styles.jobDesc}>
            {/* Left side details */}
            <Grid xs={12} md={8}>
              <div
                style={{
                  backgroundColor: '#fff',
                  borderRadius: '5px',
                  padding: '10px',
                }}
              >
                <JobDescriptionComponent description={jobDetail?.description} />
              </div>
              <Grid>
                <div className={styles.RelatedJobs}>
                  <h4 style={{ textAlign: 'left', marginTop: '20px' }}>
                    Related Jobs
                  </h4>
                  <div style={{ margin: '0  -6%' }}>
                    <Jobcard
                      isFilterScreen
                      handleClick={(e) => deleteBookmark(e)}
                      handleAddBookmark={(e) => addBookmark(e)}
                      ishowpagination
                      data={related_job}
                    />
                  </div>
                </div>
              </Grid>
            </Grid>
            {/* Right side content */}
            <Grid xs={12} md={4}>
              <div
                className={styles.detailBox}
                style={{
                  backgroundColor: 'var(--white-color)',
                  padding: 30,
                  borderRadius: 10,
                  marginBottom: 15,
                  marginLeft: 20,
                }}
              >
                <h5>Job Skills*</h5>
                <div className={styles.info}>
                  {(() => {
                    try {
                      const parsedSkills = JSON.parse(jobDetail?.skills);
                      return (
                        parsedSkills &&
                        parsedSkills?.map((skill, skillIndex) => (
                          <div className={styles.item} key={skillIndex}>
                            <p className={styles.text}>{skill.trim()}</p>
                          </div>
                        ))
                      );
                    } catch (error) {
                      return [];
                    }
                  })()}
                </div>
              </div>
              <div
                className={styles.detailBox}
                style={{
                  backgroundColor: 'var(--white-color)',
                  padding: 30,
                  marginLeft: 20,
                  borderRadius: 10,
                }}
              >
                <h5 className="cursor-pointer">Job Overview</h5>
                {/* <SmalldetailCard
                icon={FaCalendar}
                title="Date Posted"
                detail={data?.postedAgo}
                color="var(--primary-color)"
              /> */}
                {/* <SmalldetailCard
                icon={FaUser}
                title="No of Hiring"
                detail={data?.hiring_number}
                color="var(--primary-color)"
              /> */}
                {/* <SmalldetailCard
                icon={FaBriefcase}
                title="Experience"
                detail={data?.experience}
                color="var(--primary-color)"
              /> */}
                <SmalldetailCard
                  icon={RiPassExpiredFill}
                  title="Expiration date"
                  detail={formattedDate}
                  color="var(--primary-color)"
                />
                <SmalldetailCard
                  icon={BiSolidCategory}
                  title="Job Category"
                  detail={jobDetail?.category}
                  color="var(--primary-color)"
                />
                <SmalldetailCard
                  icon={FaStar}
                  title="Rate"
                  detail={jobDetail?.salary_rate}
                  color="var(--primary-color)"
                />
                {/* <SmalldetailCard
                icon={RiUserSearchFill}
                title="Job Type"
                detail={data?.type}
                color="var(--primary-color)"
              /> */}
                {/* <SmalldetailCard
                icon={FaCreditCard}
                title="Salary:"
                detail={`$ ${addThousandSeparator(
                  data?.salary_start_range
                )}, $ ${addThousandSeparator(data?.salary_end_range)}`}
                color="var(--primary-color)"
              /> */}
                {/* <SmalldetailCard
                icon={FaLocationDot}
                title="Location:"
                detail={`${data?.hiring_city}, ${data?.hiring_country}`}
                color="var(--primary-color)"
              /> */}
              </div>
              <div
                className={styles.detailBox}
                style={{
                  backgroundColor: 'var(--white-color)',
                  padding: 30,
                  borderRadius: 10,
                  marginTop: 20,
                  marginBottom: 50,
                  marginLeft: 20,
                }}
              >
                <h5>Company Profile</h5>
                <SmalldetailCard
                  title="Company Name"
                  detail={jobDetail?.company?.company_name}
                  color="var(--primary-color)"
                />
                <SmalldetailCard
                  title="Primary industry"
                  detail={jobDetail?.company?.company_type}
                  color="var(--primary-color)"
                />
                <SmalldetailCard
                  title="Company size"
                  detail={jobDetail?.company?.employer_number}
                  color="var(--primary-color)"
                />
                <SmalldetailCard
                  title="Founded in"
                  detail={jobDetail?.company?.operating_since}
                  color="var(--primary-color)"
                />
                {/* <SmalldetailCard
                title="Location"
                detail={`${data?.company?.city}, ${data?.company?.address}`}
                color="var(--primary-color)"
              /> */}
              </div>
            </Grid>
          </Grid>
        </Box>
      </div>
      {/* </Fade> */}
    </>
  );
}
function getTextStyle(text) {
  switch (text) {
    case 'Full Time':
      return {
        backgroundColor: 'rgba(25,103,210,.15)',
        color: 'var(--primary-color)',
      };
    case 'Private':
      return { backgroundColor: 'rgba(52,168,83,.15)', color: 'var(--green)' };
    case 'Urgent':
      return {
        backgroundColor: 'rgba(249,171,0,.15)',
        color: 'var(--goldenroad)',
      };
    default:
      return {};
  }
}
