import React, { useEffect, useState } from 'react';
import UserApi from '../../../Apis/UserApi';
import CustomButton from '../../../component/Button/CustomButton';
import CustomSpinner from '../../../component/Spinner/Spinner';
import Toast from '../../../component/Toast/Toast';
import styles from './CvManager.module.css';
import { GET_OPEN_RESUME } from '../../Jsondata/URL';
import { useSelector } from 'react-redux';
import BasicTabs from './tabs copy';

function CvManager() {
  const userdata = useSelector((state) => state?.userdata?.data);
  const [id, setId] = useState(null);
  const [isloading, setisloading] = useState(false);
  const [isloadingGenerate, setisloadingGenerate] = useState(false);
  const [showcv, setshowcv] = useState(true);
  const userapi = UserApi();
  const [file, setFile] = useState(null);
  const [ResumeAuth, setResumeAuth] = useState(null);
  const [alltemplate, setalltemplate] = useState(null);
  const [cvNotFound, setCvNotFound] = useState(true);
  const [Progress, setProgress] = useState(0);
  const [templateId, settemplateId] = useState(0);
  const [templateImage, settemplateImage] = useState(0);
  const [isTemplateModalOpen, setIsTemplateModalOpen] = useState(false);
  const isAuthenticated = useSelector(
    (state) => state.loginuser.isAuthenticated
  );

  const getAllTemplates = async () => {
    try {
      const response = await userapi.getCvTemplate();
      setalltemplate(response);
    } catch (error) {
      console.log('ERROR:In Fetching Cv Templates', error);
    }
  };

  const getProfileProgress = async () => {
    try {
      const response = await userapi.userProfileProgress();
      setProgress(response?.progress);
    } catch (error) {
      console.error('Progress Profile Error', error);
    }
  };

  // NOTE:This function help to get pdf file from user
  // const handleFileChange = (e) => {
  //   setFile(e.target.files[0]);
  // };

  const handleCompleteProfile = () => {
    Toast.error('Complete Your Profile');
  };

  // const handleFormSubmit = async (e) => {
  //   e.preventDefault();
  //   setisloading(true);
  //   try {
  //     if (file === null) {
  //       setisloading(false);
  //       return Toast.error("Please Upload The CV!");
  //     }
  //     const response = await userapi.uploadPdf(file);
  //     Toast.success("Resume uploaded!");
  //     setTimeout(() => {
  //       window.location.reload();
  //     }, 2000);
  //     setFile(null);
  //     setisloading(false);
  //   } catch (error) {
  //     setisloading(false);
  //     Toast.error("Failed to upload resume!");
  //     console.error("Error uploading file", error);
  //   }
  // };

  const handleGenerateResume = async (e) => {
    setisloadingGenerate(true);
    try {
      const response = await userapi.makeresume(templateId); // Pass the argument to the API call
      Toast.success('Resume Generated!');
      setTimeout(() => {
        window.location.reload();
      }, 2000);
      setisloadingGenerate(false);
    } catch (error) {
      console.error('Error in Cv manager', error);
      setisloadingGenerate(false);
    }
  };

  const updateTemplateID = (id, imageUrl) => {
    if (id === templateId) {
      settemplateId(null);
      settemplateImage(null);
    } else {
      settemplateId(id);
      settemplateImage(imageUrl);
    }
  };

  const GETME = async () => {
    try {
      const response = await userapi.viewResume();
      if (response) {
        setCvNotFound(false);
      }
      const pdfBlob = new Blob([response], { type: 'application/pdf' });
      const pdfUrl = URL.createObjectURL(pdfBlob);
      setResumeAuth(pdfUrl);
      if (pdfUrl) {
        openPdfInNewWindow();
      } else {
        Toast.error('No Resume Found');
      }
    } catch (error) {
      console.error('Error fetching PDF', error);
    }
  };
  const openPdfInNewWindow = () => {
    if (ResumeAuth) {
      window.open(ResumeAuth, '_blank');
    } else {
      console.error('ResumeAuth URL is null');
    }
  };
  const getid = () => {
    const id = localStorage.getItem('userid');
    setshowcv(showcv);
    setId(id);
  };
  useEffect(() => {
    getProfileProgress();
    getAllTemplates();
    GETME();
    getid();
  }, [isAuthenticated]);

  const handleselecttemplate = () => {
    Toast.error('Select a template');
  };

  const selectedTemplate = {
    border: '3px solid #43B7B5',
    borderRadius: '0.8rem',
    width: '100%',
    height: '100%',
    opacity: '0.7',
  };
  const ali = (temID, image) => {
    console.log('ALi Is In Parent ', temID, image);
  };
  return (
    <>
      <div className={styles.cvmanager_wrapper}>
        <div className={styles.contentWrapper}>
          <div className={styles.leftSide}>
            <h4 className={styles.heading}>Select a Template</h4>
            {/* <BasicTabs alltemplate={alltemplate}
              updateTemplate={(temID, image) => ali(temID, image)}
            /> */}
            <div className={styles.modal}>
              <BasicTabs
                alltemplate={alltemplate}
                updateTemplateID={updateTemplateID}
                selectedTemplate={selectedTemplate}
                templateId={templateId}
              />
            </div>
            {/* <div
              className={styles.viewResumeBox}
              onClick={() => openTemplateModel()}
            >
              {templateImage.length ? (
                <div className={styles.CVTemplateImage}>
                  <img src={templateImage} alt="" />
                </div>
              ) : (
                <p className={styles.DefaultText}>Select Template</p>
              )}
              {templateImage.length ? (
                <>
                  <p className={styles.hoverText}>Select Template</p>
                </>
              ) : (
                " "
              )}
            </div>
            {templateImage.length ? (
              <div
                className={styles.templateRow}
                onClick={() => openTemplateModel()}
              >
                <button className={styles.viewButton}>Select Templates</button>
              </div>
            ) : (
              ""
            )}
            {isTemplateModalOpen ? (
              <CVTemplates
                cvTemplates={alltemplate}
                closeTemplateModel={closeTemplateModel}
                updateTemplateID={updateTemplateID}
              />
            ) : (
              ""
            )} */}

            <div
              style={{
                marginTop: '0.5rem',
              }}
            >
              {/* <p>Selected Template will use to generate resume.</p> */}
              {isloadingGenerate ? (
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
                <>
                  <CustomButton
                    onClick={
                      templateImage
                        ? Progress >= 65
                          ? handleGenerateResume
                          : handleCompleteProfile
                        : handleselecttemplate
                    }
                    type="submit"
                    label="Generate Resume"
                  />
                </>
              )}
            </div>
            {/* <form
              onSubmit={handleFormSubmit}
              style={{
                maxWidth: "400px",
                marginTop: "10px",
                padding: "10px",
                border: "1px solid var(--light-gray-color)",
                borderRadius: "8px",
                boxShadow: "0 0 10px rgba(0, 0, 0, 0.1)",
              }}
            >
              <div style={{ marginBottom: "1rem" }}>
                <label
                  htmlFor="pdfFile"
                  style={{
                    display: "block",
                    fontSize: "1.2em",
                    marginBottom: "0.5rem",
                    color: "var(--dark-gray)",
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
                    padding: "8px",
                    borderRadius: "4px",
                    border: "1px solid var(--light-gray-color)",
                    width: "100%",
                    boxSizing: "border-box",
                  }}
                />
              </div>
              {isloading ? (
                <div
                  style={{
                    display: "flex",
                    justifyContent: "start",
                    marginLeft: "10px",
                  }}
                >
                  <CustomSpinner />
                </div>
              ) : (
                <CustomButton
                  style={{
                    width: "60%",
                    backgroundColor: "var(--green)",
                    color: "white",
                    padding: "10px",
                    border: "none",
                    borderRadius: "4px",
                    cursor: "pointer",
                    fontSize: "1rem",
                  }}
                  type="submit"
                  label="Upload PDF"
                />
              )}
            </form> */}
          </div>
          <div className={styles.rightSide}>
            <>
              <div className={styles.toppreviewbutton}>
                <h4>Your Resume</h4>
                <div className={styles.largehidebutton}>
                  <CustomButton
                    backgroundcolor="var(--red)"
                    label={`${showcv ? 'Close Preview' : 'View Resume'}`}
                    onClick={() => {
                      setshowcv(!showcv);
                    }}
                  />
                </div>
                <div className={styles.smallhidebutton}>
                  <CustomButton
                    backgroundcolor="gray"
                    label="Resume Preview"
                    onClick={GETME}
                  />
                </div>
              </div>
              {/* rightSide */}
              <div className={styles.resumePreview}>
                {showcv ? (
                  cvNotFound ? (
                    <div className={styles.resumeshow}>
                      <h4
                        style={{
                          textAlign: 'center',
                          color: 'var(--red-color)',
                          marginTop: '3rem',
                        }}
                      >
                        Please Upload Your Resume
                      </h4>
                    </div>
                  ) : (
                    <div className={styles.resumeshow}>
                      {/* {process.env.REACT_APP_GET_OPEN_RESUME ? ( */}
                      <iframe
                        width="100%"
                        height="100%"
                        // src='http://192.168.0.106:8000/api/view-user-resume/?template=1&user=16'
                        src={`${GET_OPEN_RESUME}${userdata?.id}`}
                        frameborder="0"
                        seamless
                      ></iframe>
                      {/* ) : (<DefaultCVpreview/>)}  */}
                    </div>
                  )
                ) : (
                  <div className={styles.resumeshow}>
                    <div
                      style={{
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        color: 'var(--gray)',
                      }}
                    >
                      <h4>Resume Preview</h4>
                    </div>
                  </div>
                )}
              </div>
            </>
          </div>
        </div>
      </div>
    </>
  );
}
export default CvManager;
