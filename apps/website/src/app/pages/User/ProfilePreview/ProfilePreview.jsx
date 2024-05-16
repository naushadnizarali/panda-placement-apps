import { Box } from '@mui/material';
import Grid from '@mui/material/Grid';
import React, { useEffect, useState } from 'react';
import { Fade } from 'react-reveal';
import { Link, useLocation } from 'react-router-dom';
import UserApi from '../../../Apis/UserApi';
import CustomButton from '../../../component/Button/CustomButton';
import Toast from '../../../component/Toast/Toast';
import SmalldetailCard from '../../CommonPages/SmalldetailCard/SmalldetailCard';
import { HOSTED_IP, LOCAL_PDF_EMPLOYER } from '../../Jsondata/URL';
import styles from './ProfilePreview.module.css';
import { FaEnvelope, FaFlag, FaLanguage, FaUserTag } from 'react-icons/fa';
import { FaPhoneVolume } from 'react-icons/fa6';
import { IoLocation } from 'react-icons/io5';
import defaultImage from '../../../../assets/defaultImage.webp';
import JobDescriptionComponent from '../../../component/JobDescription/JobDescriptionComponent';

function ProfilePreview() {
  const userapi = UserApi();
  const location = useLocation();
  const [profileData, setprofileData] = useState();
  const [isFilterScreen, setisFilterScreen] = useState(false);
  // const [showAllQualifications, setShowAllQualifications] = useState(false);
  const [loading, setLoading] = useState(false);
  const [showAll, setShowAll] = useState(false);
  const [showEducationCount, setShowEducationCount] = useState(3);
  const [showExperienceCount, setShowExperienceCount] = useState(3);
  const [showProjectCount, setShowProjectCount] = useState(3);

  const handleShowMoreProject = () => {
    setShowProjectCount(profileData?.projects?.length || 3);
  };
  const handleShowMoreExperience = () => {
    setShowExperienceCount(profileData?.experience?.length || 3);
  };
  const handleShowMoreEducation = () => {
    setShowEducationCount(profileData?.qualification?.length || 3);
  };
  const handleShowLessExperience = () => {
    setShowExperienceCount(3);
  };
  const handleShowLessProject = () => {
    setShowProjectCount(3);
  };
  const handleShowLessEducation = () => {
    setShowEducationCount(3);
  };

  const UserApiData = async () => {
    setLoading(true);
    try {
      const response = await userapi.userProfileData();
      setprofileData(response);
      setLoading(false);
    } catch (error) {
      setLoading(false);
      console.error('Error in Find Job', error);
    }
  };

  useEffect(() => {
    UserApiData();
  }, []);

  const imageSrc = profileData?.userInfo?.image
    ? LOCAL_PDF_EMPLOYER + profileData.userInfo.image
    : defaultImage;

  const viewResume = () => {
    if (profileData?.resume?.file) {
      window.open(`${HOSTED_IP}${profileData?.resume?.file}`, '_blank');
    } else {
      console.error('ResumeAuth URL is null');
      Toast.error(`Please Upload Your Resume`);
    }
  };

  return (
    <Fade bottom>
      <div className={styles.jobdetailsWraper}>
        <Box sx={{ flexGrow: 1 }} className={styles.jobdetailsbody}>
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              flexWrap: 'wrap',
            }}
          >
            <h5>Profile Preview</h5>
            {/* <Goback onClick={handleScreenChnagecandidates} /> */}
            <button
              className={
                'my-2 rounded-md px-3 py-2 text-sm font-medium  transition duration-500 bg-[var(--light-grayish-blue-color)] text-[var(--dimgray)] focus:bg-[var(--light-grayish-blue-color)] focus:text-[var(--primary-color)] hover:bg-[var(--light-grayish-blue-color)] hover:text-[var(--primary-color)]  hover:shadow-md '
              }
            >
              <Link to="/profile" className="no-underline">
                Edit Profile Here
              </Link>
            </button>
          </div>
          <Box className={styles.profileheader}>
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
                    src={imageSrc}
                  />
                </div>
                <div className={styles['category-info']}>
                  <div className={styles['title']}>
                    <h2>
                      {profileData?.userInfo?.first_name ?? '----'}
                      {profileData?.userInfo?.last_name ?? '----'}
                    </h2>
                    <p>{profileData?.seeker_info?.headline ?? '----'}</p>
                  </div>
                  <div className={styles.oneiconandnamewrapper}>
                    {/* <div className={styles.oneiconandname}>
                      <FaUserTag
                        color="var(--gray)"
                        style={{ fontSize: "24px" }}
                        // icon={faUserTag}
                      />
                      <p>
                        {profileData?.employment_status?.employment_position ??
                          "----"}
                      </p>
                    </div> */}
                    <div className={styles.oneiconandname}>
                      <IoLocation color="var(--gray)" />
                      <p>
                        {profileData?.seeker_info?.city ?? '----'},
                        {profileData?.seeker_info?.country ?? '----'}
                      </p>
                    </div>
                    {/* <div className={styles.oneiconandname}>
                      <FaFlag
                        color="var(--gray)"
                        // icon={faTrophy}
                      />
                      <p>
                        {profileData?.employment_status
                          ?.employment_experience ?? "----"}
                      </p>
                    </div> */}
                    <div className={styles.oneiconandname}>
                      <FaPhoneVolume
                        color="var(--gray)"
                        //  icon={faPhoneVolume}
                      />
                      <p>{profileData?.userInfo?.phone ?? '----'}</p>
                    </div>
                  </div>
                </div>
              </div>

              <div className={styles.buttonandicon}>
                <div className={styles.buttons}>
                  <CustomButton onClick={viewResume} label={'View Resume'} />
                </div>
              </div>
            </div>
          </Box>
          <Grid
            container
            spacing={2}
            style={{
              alignSelf: 'center',
              margin: '0px',
              width: '100%',
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
                  {profileData?.ssl_info?.summary ?? "----"}
                </p> */}
                <JobDescriptionComponent
                  description={profileData?.ssl_info?.summary ?? '----'}
                  isblog={true}
                />
                <>
                  <div className={styles['upper_title']}>
                    <h4>Education</h4>
                  </div>

                  {loading ? (
                    '----'
                  ) : profileData?.qualification?.length === 0 ? (
                    <p>----</p>
                  ) : (
                    profileData?.qualification &&
                    profileData?.qualification
                      ?.slice(0, showEducationCount)
                      .map((qualification, index) => (
                        <div key={index} className={styles?.resume_block}>
                          <div className={styles?.inner}>
                            <span className={styles?.name}>
                              {qualification?.degree?.slice(0, 1) ?? '----'}
                            </span>
                            <div className={styles?.title_box}>
                              <div className={styles?.info_box}>
                                <h5>{qualification?.degree ?? '----'}</h5>
                                <div>{qualification?.institute ?? '----'}</div>
                              </div>
                              <div className={styles?.edit_box}>
                                <span className={styles?.year}>
                                  {qualification?.start_period.slice(0, 4) ??
                                    '----'}
                                  -
                                  {qualification?.complete_period
                                    ? qualification?.complete_period.slice(0, 4)
                                    : 'Ongoing'}
                                </span>
                              </div>
                            </div>
                          </div>
                        </div>
                      ))
                  )}
                  {profileData?.qualification?.length > 3 &&
                    (showEducationCount < profileData?.qualification?.length ? (
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
                  {loading ? (
                    '----'
                  ) : profileData?.experience?.length === 0 ? (
                    <p>----</p>
                  ) : (
                    profileData?.experience &&
                    profileData?.experience
                      ?.slice(0, showExperienceCount)
                      .map((e, index) => (
                        <div key={index} className={styles?.resume_block}>
                          <div className={styles?.inner}>
                            <span className={styles?.name_work}>
                              {e.position.slice(0, 1) ?? '----'}
                            </span>
                            <div className={styles?.title_box}>
                              <div className={styles?.info_box_work}>
                                <h5>{e?.position ?? '----'}</h5>
                                <div>
                                  <span>{e?.company ?? '----'}</span>
                                </div>
                                <div className={styles.text_des}>
                                  <JobDescriptionComponent
                                    description={e?.description ?? '----'}
                                    isblog={true}
                                  />
                                </div>
                              </div>
                              <div className={styles?.edit_box}>
                                <span className={styles?.year_work}>
                                  {e?.period_from?.slice(0, 4)}-
                                  {e?.currently_working
                                    ? 'Present'
                                    : e?.period_to?.slice(0, 4)}
                                </span>
                              </div>
                            </div>
                          </div>
                        </div>
                      ))
                  )}
                  {profileData?.experience?.length > 3 &&
                    (showExperienceCount < profileData?.experience?.length ? (
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
                        label="See Less"
                      >
                        See Less
                      </p>
                    ))}

                  <div className={styles['upper_title']}>
                    <h4>Projects</h4>
                  </div>
                  {loading ? (
                    '----'
                  ) : profileData?.projects?.length === 0 ? (
                    <p>----</p>
                  ) : (
                    profileData?.projects &&
                    profileData?.projects
                      ?.slice(0, showProjectCount)
                      .map((qualification, index) => (
                        <div key={index} className={styles?.resume_block}>
                          <div className={styles?.inner}>
                            <span className={styles?.name_pro}>
                              {qualification.title.slice(0, 1) ?? '----'}
                            </span>
                            <div className={styles?.title_box}>
                              <div className={styles?.info_box_pro}>
                                <h5>{qualification?.title ?? '----'}</h5>
                                <div>{qualification?.role ?? '----'}</div>
                                <div className={styles.text_des}>
                                  {/* <p>{qualification?.description ?? "----"}</p> */}
                                  <JobDescriptionComponent
                                    description={
                                      qualification?.description ?? '----'
                                    }
                                    isblog={true}
                                  />
                                </div>
                                <div>
                                  <a href={qualification?.url}>View Project</a>
                                </div>
                              </div>
                              <div className={styles?.edit_box}></div>
                            </div>
                          </div>
                        </div>
                      ))
                  )}
                  {profileData?.projects?.length > 3 &&
                    (showProjectCount < profileData?.projects?.length ? (
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
            <Grid xs={12} md={4} className={styles.ProfileOverviewBox}>
              <div
                style={{
                  backgroundColor: 'var(--white-color)',
                  padding: 30,
                  borderRadius: 10,
                }}
              >
                <h5>Profile Overview</h5>
                <SmalldetailCard
                  icon={FaEnvelope}
                  title="Email"
                  detail={profileData?.userInfo?.email}
                  color="var(--primary-color)"
                />
                <SmalldetailCard
                  icon={IoLocation}
                  title="Location:"
                  detail={profileData?.seeker_info?.country}
                  color="var(--primary-color)"
                />
                <SmalldetailCard
                  icon={FaLanguage}
                  title="Language:"
                  color="var(--primary-color)"
                />
                <div className={styles.info}>
                  {(() => {
                    try {
                      const parsedSkills = JSON.parse(
                        profileData?.ssl_info.language
                      );
                      if (
                        parsedSkills &&
                        Array.isArray(parsedSkills) &&
                        parsedSkills.length > 0
                      ) {
                        return parsedSkills.map((skill, skillIndex) => (
                          <div className={styles.item} key={skillIndex}>
                            <p className={styles.text}>
                              {skill?.skill} - <span>{skill?.level}</span>{' '}
                            </p>
                          </div>
                        ));
                      } else {
                        return null;
                      }
                    } catch (error) {
                      return null;
                    }
                  })()}
                </div>
              </div>
              <div
                style={{
                  backgroundColor: 'var(--white-color)',
                  padding: 30,
                  borderRadius: 10,
                  marginTop: 20,
                  marginBottom: 20,
                }}
              >
                <>
                  <h5>Professional Skills</h5>
                  <div className={styles.info}>
                    {(() => {
                      try {
                        const parsedSkills = JSON.parse(
                          profileData?.ssl_info.skill
                        );

                        if (
                          Array.isArray(parsedSkills) &&
                          parsedSkills.length > 0
                        ) {
                          return parsedSkills?.map((skill, skillIndex) => (
                            <div className={styles.item} key={skillIndex}>
                              <p className={styles.text}>
                                {skill?.skill} - <span>{skill?.level}</span>{' '}
                              </p>
                            </div>
                          ));
                        } else {
                          return null;
                        }
                      } catch (error) {
                        return null;
                      }
                    })()}
                  </div>
                </>
              </div>
            </Grid>
          </Grid>
        </Box>
      </div>
    </Fade>
  );
}

export default ProfilePreview;
