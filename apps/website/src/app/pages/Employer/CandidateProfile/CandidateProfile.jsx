import { FaEarthAmericas } from 'react-icons/fa6';
import { FaFlag } from 'react-icons/fa';
import { FaLanguage } from 'react-icons/fa';
import { FaLocationDot } from 'react-icons/fa6';
import { FaPhoneVolume } from 'react-icons/fa6';
import { FaUser } from 'react-icons/fa';
import { IoIosMail } from 'react-icons/io';
import { FaBookmark } from 'react-icons/fa';

import { Box, Button } from '@mui/material';
import Grid from '@mui/material/Grid';
import React, { useEffect, useState } from 'react';
import Modal from 'react-bootstrap/Modal';
import { Fade } from 'react-reveal';
import { useLocation, useNavigate } from 'react-router-dom';
import Toast from '../../../component/Toast/Toast';
import Goback from '../../../component/GoBackicon/goback';
import SmalldetailCard from '../../CommonPages/SmalldetailCard/SmalldetailCard';
import { LOCAL_PDF_EMPLOYER } from '../../Jsondata/URL';
import styles from './CandidatesProfile.module.css';
import CustomButton from '../../../component/Button/CustomButton';
import { DynamicTitle } from '../../../Helpers/DynamicTitle';
import EmployerAPIS from '../../../Apis/EmployerApi';
import JobDescriptionComponent from '../../../component/JobDescription/JobDescriptionComponent';

function CandidateModal({ show, onHide, candidateData }) {
  const [currentSection, setCurrentSection] = useState(1);
  const [Q, setQ] = useState(JSON?.parse(candidateData?.prescreen));
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
          <h6>Pre-Screen Question And Answer</h6>
        </Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <div style={{ height: '60vh', overflowY: 'scroll', marginTop: '1rem' }}>
          {candidateData && candidateData ? (
            Q &&
            Q?.map((e, i) => (
              <React.Fragment key={i}>
                <div>
                  <p
                    style={{
                      color: 'var(--black)',
                      fontWeight: 600,
                    }}
                  >{`Question ${i + 1} ?`}</p>
                  <p
                    style={{
                      fontWeight: 500,
                      color: 'var(--black)',
                      margin: '20px 5px',
                    }}
                  >
                    {e.question}
                  </p>
                  <p>{`Answer ${i + 1}`}</p>
                  <p>{e.answer ? e.answer : 'Answer Not Found'}</p>
                </div>
              </React.Fragment>
            ))
          ) : (
            <div style={{ textAlign: 'center', marginTop: '5rem' }}>
              <>
                <h5>Question Not added!</h5>
                <p>Please Contiune...</p>
              </>
            </div>
          )}
        </div>
      </Modal.Body>
      <Modal.Footer>
        <></>
      </Modal.Footer>
    </Modal>
  );
}

function CandidateProfile() {
  const [isFilterScreen, setisFilterScreen] = useState(false);
  const navigate = useNavigate();
  const employerApi = EmployerAPIS();
  const location = useLocation();
  const [modalShow, setModalShow] = React.useState(false);
  const data = location?.state?.data;
  const ResumeAuth = data?.seeker_resume;
  const [showEducationCount, setShowEducationCount] = useState(3);
  const [showExperienceCount, setShowExperienceCount] = useState(3);
  const [showProjectCount, setShowProjectCount] = useState(3);

  const handleShowMoreProject = () => {
    setShowProjectCount(data?.projects?.length || 3);
  };
  const handleShowLessProject = () => {
    setShowProjectCount(3);
  };
  const handleShowMoreExperience = () => {
    setShowExperienceCount(data?.experience?.length || 3);
  };
  const handleShowLessExperience = () => {
    setShowExperienceCount(3);
  };
  const handleShowMoreEducation = () => {
    setShowEducationCount(data?.qualification?.length || 3);
  };
  const handleShowLessEducation = () => {
    setShowEducationCount(3);
  };
  const profileView = async () => {
    try {
      const response = await employerApi.candidateProfileView(data?.id);
    } catch (error) {
      console.error('ERROR:Employer Visit The Candidate Profile', error);
    }
  };

  const language = () => {
    try {
      const language = JSON?.parse(data?.ssl?.language);
      return (
        language &&
        language.map((language, index) => (
          <div className={styles.item} key={index}>
            <p className={styles.text}>{language.trim()}</p>
          </div>
        ))
      );
    } catch (error) {
      return [];
    }
  };

  const handleScreenChnagecandidates = () => {
    navigate(-1);
  };

  const viewResume = () => {
    // Toast.success("working On..");
    // return;
    if (ResumeAuth) {
      window.open(ResumeAuth, '_blank');
    } else {
      console.error('ResumeAuth URL is null');
      Toast.error(`${data.seeker_name} Resume Not Found!`);
    }
  };

  const handleApplyClick = async (job) => {
    setModalShow(true);
  };

  useEffect(() => {
    DynamicTitle('Candidate-Profile-PandaPlacement');
  }, []);
  useEffect(() => {
    profileView();
  }, [data]);

  return (
    <Fade bottom>
      <CandidateModal
        show={modalShow}
        onHide={() => setModalShow(false)}
        candidateData={data}
      />
      <Box sx={{ flexGrow: 1 }} className={styles.jobdetailsbody}>
        <div>
          {/* <IoArrowBackCircleOutline
          /> */}
          <Goback fontSize={40} onClick={handleScreenChnagecandidates} />
        </div>
        <Box>
          <div
            className={
              isFilterScreen
                ? styles['popular-job-categoryOnIsFilter']
                : styles['popular-job-category']
            }
          >
            <div className={styles.imageandtitlewrapper}>
              <div className={styles['icon-bg']}>
                <img
                  height={100}
                  width={100}
                  // style={{ borderRadius: '6rem' }}
                  alt="image"
                  src={LOCAL_PDF_EMPLOYER + data?.user.image}
                />
              </div>
              <div className={styles['category-info']}>
                <div className={styles['title']}>
                  <h2>{data?.seeker_name}</h2>
                </div>
                <div className={styles.oneiconandnamewrapper}>
                  <div className={styles.oneiconandname}>
                    <FaUser
                      color="var(--secondary-gray-color)"
                      // icon={faUserTag}
                    />
                    <p>{data.seeker_info.headline}</p>
                  </div>
                  <div className={styles.oneiconandname}>
                    <FaEarthAmericas
                      color="var(--secondary-gray-color)"
                      //  icon={faEarthAmericas}
                    />
                    <p>{data?.user.country}</p>
                  </div>
                  <div className={styles.oneiconandname}>
                    <FaPhoneVolume
                      color="var(--secondary-gray-color)"
                      //  icon={faPhoneVolume}
                    />
                    <p>{data?.user.phone}</p>
                  </div>
                </div>

                {/* JOb TYPE CARD  */}
                {/* <div className={styles.info}>
                  <div className={styles.item}>
                    <p className={styles.text}>Recent</p>
                  </div>
                  <div className={styles.item}>
                    <p className={styles.text}>Private</p>
                  </div>
                  <div className={styles.item}>
                    <p className={styles.text}>Urgent</p>
                  </div>
                </div> */}
              </div>
            </div>

            <div className={styles.buttonandicon}>
              <div className={styles.buttons}>
                <CustomButton onClick={viewResume} label={'View Resume'} />

                <CustomButton
                  onClick={handleApplyClick}
                  label={'View Pre Screen Answer'}
                />
              </div>
              {/* <FaBookmark
                color="var(--secondary-gray-color)"
                className={styles.bookmark}
                // icon={faBookmark}
              /> */}
            </div>
          </div>
        </Box>
        <Grid
          container
          // spacing={2}
          style={{
            alignSelf: 'center',
          }}
        >
          {/* Left side details */}
          <Grid
            item
            xs={12}
            md={8}
            style={{ padding: '2rem 2rem', borderRadius: '8px' }}
            backgroundColor={'var(--white-color)'}
          >
            <div>
              <p className={styles.jobdesHeading}>Profile Summary</p>
              {/* <p className={styles.jobdesdetail}>
                {data?.ssl?.summary ? data?.ssl?.summary : "Not Found"}
              </p> */}
              <JobDescriptionComponent
                description={
                  data?.ssl?.summary ? data?.ssl?.summary : 'Not Found'
                }
                isblog={true}
              />
              <>
                <div className={styles['upper_title']}>
                  <h4>Education</h4>
                </div>

                {!data?.qualification_data?.length > 0 ? (
                  <p>Education Not Found</p>
                ) : (
                  data?.qualification_data &&
                  data?.qualification_data
                    ?.slice(0, showEducationCount)
                    .map((qualification, index) => (
                      <div key={index} className={styles?.resume_block}>
                        <div className={styles?.inner}>
                          <span className={styles?.name}>
                            {qualification.degree.slice(0, 1)}
                          </span>
                          <div className={styles?.title_box}>
                            <div className={styles?.info_box}>
                              <h5>
                                {qualification?.education_level} from{' '}
                                {qualification?.degree}
                              </h5>
                              <div>{qualification?.institute}</div>
                              {/* <div className={styles.text_des}>{qualification?.description}</div> */}
                            </div>
                            <div className={styles?.edit_box}>
                              <span className={styles?.year}>
                                {qualification?.start_period.slice(0, 4)}-
                                {qualification.currently_enrolled
                                  ? 'Enrolled'
                                  : qualification?.complete_period.slice(0, 4)}
                              </span>
                            </div>
                          </div>
                        </div>
                      </div>
                    ))
                )}
                {data?.qualification?.length > 3 &&
                  (showEducationCount < data?.qualification.length ? (
                    <p
                      onClick={handleShowMoreEducation}
                      className={`${styles.readMoreButton} ${styles.alignRight}`}
                      label="See More"
                    >
                      See More
                    </p>
                  ) : (
                    <p
                      onClick={handleShowLessEducation}
                      className={`${styles.readMoreButton} ${styles.alignRight}`}
                      label="See Less"
                    >
                      See Less
                    </p>
                  ))}
              </>
              <>
                <div className={styles['upper_title']}>
                  <h4>Work Experience</h4>
                </div>
                {
                  (data.experience.lenght = 0 ? (
                    <p>Experience Not Found</p>
                  ) : (
                    data?.experience &&
                    data?.experience
                      ?.slice(0, showExperienceCount)
                      .map((qualification, index) => (
                        <div key={index} className={styles?.resume_block}>
                          <div className={styles?.inner}>
                            <span className={styles?.name_work}>
                              {qualification.position.slice(0, 1)}
                            </span>
                            <div className={styles?.title_box}>
                              <div className={styles?.info_box_work}>
                                {/* <h5>{qualification?.position}</h5> */}
                                <div>
                                  <span>{qualification?.company}</span>
                                </div>
                                <div className={styles.text_des}>
                                  <JobDescriptionComponent
                                    description={qualification?.description}
                                    isblog={true}
                                  />
                                </div>
                              </div>
                              <div className={styles?.edit_box}>
                                <span className={styles?.year_work}>
                                  {qualification?.period_from?.slice(0, 4)}-
                                  {qualification?.currently_working
                                    ? 'Present'
                                    : qualification?.period_to?.slice(0, 4)}
                                </span>
                              </div>
                            </div>
                          </div>
                        </div>
                      ))
                  ))
                }
                {data?.experience?.length > 3 &&
                  (showExperienceCount < data?.experience.length ? (
                    <p
                      onClick={handleShowMoreExperience}
                      className={`${styles.readMoreButton} ${styles.alignRight}`}
                      label="See More"
                    >
                      See More
                    </p>
                  ) : (
                    <p
                      onClick={handleShowLessExperience}
                      className={`${styles.readMoreButton} ${styles.alignRight}`}
                      label="Show Less"
                    >
                      See Less
                    </p>
                  ))}
              </>
              <>
                <div className={styles['upper_title']}>
                  <h4>Projects</h4>
                </div>
                {
                  (data.projects.lenght = 0 ? (
                    <p>Projects Not Found</p>
                  ) : (
                    data?.projects &&
                    data?.projects
                      .slice(0, showProjectCount)
                      .map((qualification, index) => (
                        <div key={index} className={styles?.resume_block}>
                          <div className={styles?.inner}>
                            <span className={styles?.name_pro}>
                              {qualification.title.slice(0, 1)}
                            </span>
                            <div className={styles?.title_box}>
                              <div className={styles?.info_box_pro}>
                                <h5>{qualification?.title}</h5>
                                <div>{qualification?.role}</div>
                                <div className={styles.text_des}>
                                  {/* <p>{qualification?.description}</p> */}
                                  <JobDescriptionComponent
                                    description={qualification?.description}
                                    isblog={true}
                                  />
                                </div>
                                <div>
                                  <a href={qualification?.url}>Vuew Project</a>
                                </div>
                              </div>
                              <div className={styles?.edit_box}></div>
                            </div>
                          </div>
                        </div>
                      ))
                  ))
                }
                {data?.projects?.length > 3 &&
                  (showProjectCount < data?.projects.length ? (
                    <p
                      onClick={handleShowMoreProject}
                      className={`${styles.readMoreButton} ${styles.alignRight}`}
                      label="See More"
                    >
                      See More
                    </p>
                  ) : (
                    <p
                      onClick={handleShowLessProject}
                      className={`${styles.readMoreButton} ${styles.alignRight}`}
                      label="See Less"
                    >
                      See Less
                    </p>
                  ))}
              </>
            </div>
          </Grid>
          {/* Right side content */}
          <Grid item xs={12} md={4}>
            <div className={styles.profileOverview}>
              <h5>Profile Overview</h5>
              {/* <SmalldetailCard
                icon={FaFlag}
                title="Experience:"
                detail={data?.seeker_info.experience}
                color="var(--primary-color)"
              /> */}
              <SmalldetailCard
                icon={IoIosMail}
                title="Email"
                detail={data?.user.email}
                color="var(--primary-color)"
              />
              <SmalldetailCard
                icon={FaLocationDot}
                title="Location:"
                detail={data?.user.country}
                color="var(--primary-color)"
              />

              <SmalldetailCard
                icon={FaLanguage}
                title="Language:"
                color="var(--primary-color)"
                detail={language}
              />

              <div className={styles.info}>
                {(() => {
                  try {
                    const parsedSkills = JSON.parse(data?.ssl.language);

                    return (
                      parsedSkills &&
                      parsedSkills.map((skill, skillIndex) => (
                        <div className={styles.item} key={skillIndex}>
                          <p className={styles.text}>
                            {skill.skill}-{skill.level}
                          </p>
                        </div>
                      ))
                    );
                  } catch (error) {
                    // You can decide how to handle the error here.
                    // For example, you might want to return a default value or an empty array.
                    return [];
                  }
                })()}
              </div>
            </div>
            <div className={styles.professionalSkills}>
              <>
                <h5>Professional Skills</h5>
                <div className={styles.info}>
                  {(() => {
                    try {
                      const parsedSkills = JSON.parse(data?.ssl.skill);

                      return (
                        parsedSkills &&
                        parsedSkills.map((skill, skillIndex) => (
                          <div className={styles.item} key={skillIndex}>
                            <p className={styles.text}>
                              {skill.skill}-{skill.level}
                            </p>
                          </div>
                        ))
                      );
                    } catch (error) {
                      // You can decide how to handle the error here.
                      // For example, you might want to return a default value or an empty array.
                      return [];
                    }
                  })()}
                </div>
              </>
            </div>
          </Grid>
        </Grid>
      </Box>
    </Fade>
  );
}

export default CandidateProfile;
