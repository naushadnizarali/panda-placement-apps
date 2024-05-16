import { React, useEffect, useState } from 'react';
import { IoIosAddCircleOutline } from 'react-icons/io';
import UserApi from '../../Apis/UserApi';
import style from '../../pages/User/Hprofile/hprofile.module.css';
import CustomButton from '../Button/CustomButton';
import SearchInput from '../SearchInput/Search';
import CustomSpinner from '../Spinner/Spinner';
import Toast from '../Toast/Toast';
import ReactQuill from 'react-quill';
import JobDescriptionComponent from '../JobDescription/JobDescriptionComponent';
import { LiaTimesSolid } from 'react-icons/lia';
import { Autocomplete, TextField } from '@mui/material';
import { generalSkills, INDUSTRY_CHOICES } from '../../pages/Jsondata/Jsondata';

function SkillsSection({ onUpdate }) {
  const [showSkills, setShowSkills] = useState(false);
  const [showdomain, setshowdomain] = useState(false)
  const [domain, setdomain] = useState([]);
  const [showLanguages, setShowLanguages] = useState(false);
  const [showsummary, setShowsummary] = useState(false);
  const [isloading, setIsloading] = useState(false);
  const [Summary, setSummary] = useState('');
  //New Skills States With The Level
  const [myskills, setmySkills] = useState([]);
  const [currentSkill, setCurrentSkill] = useState('');
  const [currentLevel, setCurrentLevel] = useState('');
  //New Language States With The Level
  const [myLanguage, setmyLanguage] = useState([]);
  const [currentlanguage, setCurrentlanguage] = useState('');
  const [currentLanguageLevel, setCurrentLanguageLevel] = useState('');

  const levels = ['Beginner', 'Intermediate', 'Expert'];
  const languageLevels = [
    'Basic',
    'Conversational',
    'Fluent',
    'Native/Bilingual',
  ];

  const userapi = UserApi();

  const toggleSkills = () => {
    setShowSkills(!showSkills);
  };

  const toggleLanguages = () => {
    setShowLanguages(!showLanguages);
  };

  const toggle = () => {
    setShowsummary(!showsummary);
  };

  const handleButtonClick = async () => {
    toggleSkills();
    setShowSkills(false);
    setShowLanguages(false);
    setShowsummary(false);
    await handleSslPost();
  };

  const handleSslPost = async () => {
    setIsloading(true);
    const SSL = {
      // domain: JSON.stringify(domain),//TODO:Send to BackEnd
      skill: JSON.stringify(myskills),
      language: JSON.stringify(myLanguage),
      summary: Summary,
    };
    try {
      const response = await userapi.sslPostInformation(SSL);
      Toast.success('Information Save');
      await handleSslGet();
      setIsloading(false);
      onUpdate();
    } catch (error) {
      setIsloading(false);
      console.error(error);
    }
  };

  const handleEditorChange = (value) => {
    setSummary(value);
  };

  const handleSslGet = async () => {
    try {
      const response = await userapi.sslinformation();
      const Changelanguage = JSON.parse(response[0].language);
      setmyLanguage(Changelanguage);
      const typeChange = JSON.parse(response[0].skill);
      setmySkills(typeChange);
      setSummary(response[0].summary);
      // setdomain(JSON.parse(response[0].domain))//TODO:Update The Domain State
    } catch (error) {
      console.error(error);
    }
  };
  const handleRemoveSkill = (index) => {
    const updatedSkills = [...myskills];
    updatedSkills.splice(index, 1);
    setmySkills(updatedSkills);
  };

  const handleRemoveLanguage = (index) => {
    const updatedLanguages = [...myLanguage];
    updatedLanguages.splice(index, 1);
    setmyLanguage(updatedLanguages);
  };

  useEffect(() => {
    handleSslGet();
  }, []);

  const MAX_SKILLS = 6

  return (
    <>
      <section className={style.myProfile_box}>
        <div style={{ fontSize: '12px', marginBottom: '10px' }}>
          <span>Note:</span> Kindly Save Your Information
        </div>
        <div className={style.boxHeadign}>
          <div>
            <h5>Multiple Domains</h5>
          </div>
        </div>
        <div className="col-sm-8 mb-4">
          <div >
            <Autocomplete
              filterSelectedOptions
              limitTags={4}
              multiple
              id="tags-filled"
              options={INDUSTRY_CHOICES?.map((option) => option?.value)}
              defaultValue={[]}
              value={domain}
              onChange={(event, newValue) => {
                if (newValue?.length <= MAX_SKILLS) {
                  setdomain(newValue);
                }
              }}
              renderInput={(params) => (
                <TextField {...params} placeholder="Select Multiple Domains" />
              )}
            />
            <CustomButton
              onClick={handleButtonClick}
              label="Save"
              marginTop={10}
            />
          </div>
        </div>
        {/* //FIX: Catgeory  */}

        <div className={style.boxHeadign}>
          <div>
            <h5>Skills</h5>
          </div>
          <div className={style.addEducation}>
            <button
              onClick={toggleSkills}
              title="Add New"
              className="group cursor-pointer outline-none hover:rotate-90 duration-300"
            >
              <IoIosAddCircleOutline style={{ color: 'red' }} />
            </button>
            {showSkills ? (
              <a onClick={toggleSkills}>Close</a>
            ) : (
              <a onClick={toggleSkills}>Add Skills</a>
            )}
          </div>
        </div>


        <div className={style.chipwrapper}>
          {myskills.map((skill, index) => (
            <div className={style.chip}>
              <div key={index}>
                <span>
                  {skill.skill} - {skill.level}
                </span>
              </div>
              <button
                className={style.clearSkil}
                onClick={() => handleRemoveSkill(index)}
              >
                <LiaTimesSolid />
              </button>
            </div>
          ))}
        </div>
        <div></div>
        {/* //TODO:Fix the condidtions */}
        {showSkills ? (
          <div className="row">
            <div className="col-sm-12">
              <SearchInput
                placeholder="Type Skills.."
                skills={myskills}
                setSkills={setmySkills}
                currentSkill={currentSkill}
                setCurrentSkill={setCurrentSkill}
                currentLevel={currentLevel}
                setCurrentLevel={setCurrentLevel}
                levels={levels}
                inputType={'Skills'}
              />
            </div>
          </div>
        ) : null}

        <div className={style.boxHeadign}>
          <div className="mt-5">
            <h5>Languages</h5>
          </div>
          <div className={style.addEducation}>
            <button
              onClick={toggleLanguages}
              title="Add New"
              className="group cursor-pointer outline-none hover:rotate-90 duration-300 mt-5"
            >
              <IoIosAddCircleOutline style={{ color: 'red' }} />
            </button>
            {showLanguages ? (
              <a className="mt-5" onClick={toggleLanguages}>
                Close
              </a>
            ) : (
              <a className="mt-5" onClick={toggleLanguages}>
                Add Language
              </a>
            )}
          </div>
        </div>
        <div className={style.chipwrapper}>
          {myLanguage.map((skill, index) => (
            <div className={style.chip} key={index}>
              <span>
                {skill.skill} - {skill.level}
              </span>
              <button
                className={style.clearSkil}
                onClick={() => handleRemoveLanguage(index)}
              >
                <LiaTimesSolid />
              </button>{' '}
            </div>
          ))}
        </div>
        {showLanguages ? (
          <div className="row">
            <div className="col-sm-12">
              <SearchInput
                placeholder="Type Language..."
                skills={myLanguage}
                setSkills={setmyLanguage}
                currentSkill={currentlanguage}
                setCurrentSkill={setCurrentlanguage}
                currentLevel={currentLanguageLevel}
                setCurrentLevel={setCurrentLanguageLevel}
                levels={languageLevels}
                inputType={'Language'}
              />
            </div>
          </div>
        ) : null}
        <div>
          <div className="d-flex justify-content-between  ">
            <h5 className="my-5">Summary</h5>
            <div className={style.addEducation}>
              <button
                title="Add New"
                className="group cursor-pointer outline-none hover:rotate-90 duration-300"
                onClick={toggle}
              >
                <IoIosAddCircleOutline style={{ color: 'red' }} />
              </button>
              {showsummary ? (
                <a onClick={toggle}>Close</a>
              ) : (
                <a onClick={toggle}>Add Summary</a>
              )}
            </div>
          </div>
          {Summary ? (
            <JobDescriptionComponent description={Summary} isblog={true} />
          ) : (
            // <p className={style.text}>{Summary}</p>
            <p className={style.text}>Not Added Yet</p>
          )}
          {showsummary ? (
            <>
              {/* <textarea
                onChange={(e) => {
                  setSummary(e.target.value);
                }}
                value={Summary}
                col-sm-6s="30"
                rows="7"
                className="form-control mt-3"
                placeholder="Spent several years working on sheep on Wall Street. Had moderate success investing in Yugo's on Wall Street. Managed a small team buying and selling Pogo sticks for farmers"
              ></textarea> */}
              <ReactQuill
                theme="snow"
                // modules={modules}
                // formats={formats}
                // onChange={(e) => {
                //   setSummary(e.target.value);
                // }}
                onChange={handleEditorChange}
                name="description"
                value={Summary}
                style={{
                  height: '200px',
                  marginBottom: '3rem',
                  width: '100%',
                  borderradius: '0.25rem',
                }}
              />
            </>
          ) : null}
        </div>

        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'right',
          }}
        >
          {isloading ? (
            <CustomSpinner />
          ) : (
            <>
              <CustomButton
                onClick={handleButtonClick}
                label="Save All"
                marginTop={10}
              />
            </>
          )}
        </div>
      </section>
    </>
  );
}

export default SkillsSection;
