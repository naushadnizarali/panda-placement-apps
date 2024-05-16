import React, { useEffect, useState } from 'react';
import { CircularProgressbar } from 'react-circular-progressbar';
import 'react-circular-progressbar/dist/styles.css';
import { Fade } from 'react-reveal';
import { useNavigate } from 'react-router-dom';
import UserApi from '../../../Apis/UserApi';
import Goback from '../../../component/GoBackicon/goback';
import HUserInformation from '../../../component/HUserInformation copy/UserInformation';
import MyProfile from '../../../component/ProfileMyProfileSection/ProfileMyProfileSec';
import ProjectSection from '../../../component/ProjectProfilepage/projectsection';
import QualificationSection from '../../../component/QualificationProfilePage/Qualificationsection';
import UserExperience from '../../../component/experinceProfilepage/experiencesection';
import style from './hprofile.module.css';
import Skillprofile from '../../../component/SkillProfilePage/SkillProfile';
import 'react-circular-progressbar/dist/styles.css';
import Toast from '../../../component/Toast/Toast';
import CustomSpinner from '../../../component/Spinner/Spinner';
import CustomButton from '../../../component/Button/CustomButton';

function Hprofile() {
  const userapi = UserApi();
  const userApi = UserApi();
  const [file, setFile] = useState(null);
  const [isloading, setIsloading] = useState(false);
  const Navigate = useNavigate();
  const [logo, setLogo] = useState(null);
  const [Progress, setProgress] = useState(0);

  const getProfileProgress = async () => {
    try {
      const response = await userApi.userProfileProgress();
      setProgress(response?.progress);
    } catch (error) {
      console.error('Progress Profile Error', error);
    }
  };

  const handleFileChange = (e) => {
    setFile(e.target.files[0]);
  };
  const handleFormSubmit = async (e) => {
    e.preventDefault();
    setIsloading(true);
    try {
      if (file === null) {
        setIsloading(false);
        return Toast.error('Please Upload The CV!');
      }
      const response = await userapi.uploadPdf(file);
      Toast.success('Resume uploaded!');
      // setTimeout(() => {
      //   window.location.reload();
      // }, 2000);
      // setFile(null);
      setIsloading(false);
    } catch (error) {
      setIsloading(false);
      Toast.error('Failed to upload resume!');
      console.error('Error uploading file', error);
    }
  };

  useEffect(() => {
    getProfileProgress();
  }, []);

  return (
    <>
      <main className={style.profile_maindiv}>
        <div className={style.profile_Box}>
          <div className={style.page_heading}>
            <div className={style.arrow_heading}>
              <Goback
                // <BsArrowLeftCircle/>
                // icon={faArrowLeft}
                style={{
                  fontSize: '2rem',
                  cursor: 'pointer',
                  marginRight: '0.7rem',
                }}
                col-sm-6or="black"
                onClick={() => {
                  Navigate('/user/home');
                }}
              />
              <h2>My Profile!</h2>
            </div>
            <div className={style.progress_bar}>
              <CircularProgressbar value={Progress} text={`${Progress}%`} />
            </div>
          </div>
          <span className={style.descrip}> Ready to jump back in?</span>

          <form
            onSubmit={handleFormSubmit}
            style={{
              maxWidth: '400px',
              marginTop: '10px',
              padding: '10px',
              backgroundColor: 'white',
              border: '1px solid var(--light-gray-color)',
              borderRadius: '8px',
              boxShadow: '0 0 10px rgba(0, 0, 0, 0.1)',
            }}
          >
            <div style={{ marginBottom: '1rem' }}>
              <label
                htmlFor="pdfFile"
                style={{
                  display: 'block',
                  fontSize: '1.2em',
                  marginBottom: '0.5rem',
                  color: 'var(--dark-gray)',
                }}
              >
                Or upload your custom resume.
              </label>
              <input
                type="file"
                id="pdfFile"
                accept=".pdf"
                onChange={handleFileChange}
                style={{
                  padding: '8px',
                  borderRadius: '4px',
                  border: '1px solid var(--light-gray-color)',
                  width: '100%',
                  boxSizing: 'border-box',
                }}
              />
            </div>
            {isloading ? (
              <div
                style={{
                  display: 'flex',
                  justifyContent: 'start',
                  marginLeft: '10px',
                }}
              >
                <CustomSpinner />
              </div>
            ) : (
              <CustomButton
                style={{
                  width: '60%',
                  backgroundColor: 'var(--green)',
                  color: 'white',
                  padding: '10px',
                  border: 'none',
                  borderRadius: '4px',
                  cursor: 'pointer',
                  fontSize: '1rem',
                }}
                type="submit"
                label="Upload PDF"
              />
            )}
          </form>
          <>
            <Fade bottom>
              <MyProfile onUpdate={getProfileProgress} />
            </Fade>
            {/* <Fade bottom>
            <EmployementStatus onUpdate={getProfileProgress} />
          </Fade> */}
            <Fade bottom>
              <HUserInformation onUpdate={getProfileProgress} />
            </Fade>
            <Fade bottom>
              <QualificationSection onUpdate={getProfileProgress} />
            </Fade>
            <Fade bottom>
              <Skillprofile onUpdate={getProfileProgress} />
            </Fade>
            <Fade bottom>
              <ProjectSection onUpdate={getProfileProgress} />
            </Fade>
            <Fade bottom>
              <UserExperience onUpdate={getProfileProgress} />
            </Fade>
          </>
        </div>
      </main>
    </>
  );
}

export default Hprofile;
