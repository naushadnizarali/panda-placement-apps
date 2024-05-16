import React, { useState } from 'react';
import styles from './Header.module.css';
import { FaSearch, FaSearchLocation } from 'react-icons/fa';
import { useNavigate } from 'react-router-dom';
import { ResumeInput } from '../Input/TextInput';
import { useSelector } from 'react-redux';
import CustomButton from '../Button/CustomButton';

function Header() {
  const navigate = useNavigate();
  const [jobTitle, setJobTitle] = useState('');
  const [jobLocation, setJobLocation] = useState('');
  const isAuthenticated = useSelector(
    (state) => state.loginuser.isAuthenticated
  );
  const handleJobTitleChange = (e) => {
    setJobTitle(e.target.value);
  };

  const handleJobLocationChange = (e) => {
    setJobLocation(e.target.value);
  };

  const handleNavigate = () => {
    if (isAuthenticated) {
      navigate('/findJobs', {
        state: {
          data: {
            jobTitle: jobTitle,
            jobLocation: jobLocation,
          },
        },
      });
    } else {
      navigate('/findJobs', {
        state: {
          data: {
            jobTitle: jobTitle,
            jobLocation: jobLocation,
          },
        },
      });
    }
  };
  const popularSearch = [
    {
      id: 1,
      title: 'Designer',
    },
    {
      id: 2,
      title: 'Developer',
    },
    {
      id: 3,
      title: 'Web Developer',
    },
    {
      id: 4,
      title: 'PHP',
    },
    {
      id: 5,
      title: 'Engineer',
    },
    {
      id: 5,
      title: 'Accounts',
    },
  ];
  return (
    <section className={`${styles.Header_section}`}>
      {/* <Fade bottom> */}
      <div className={`${styles.Header_content}`}>
        <div className={styles.detail_box}>
          <h1>
            There Are <span>Thousand's</span> Postings Here For You!
          </h1>
          <p>Find Jobs, Employment & Career Opportunities,</p>
        </div>
        <div className={styles.contentmain}>
          <div className={styles.inputContainer}>
            <FaSearch
              style={{ cursor: 'pointer', color: 'dimgray' }}
              size={22}
            />
            <ResumeInput
              placeholder="Job Title"
              name="jobtitle"
              onChange={handleJobTitleChange}
              borderColor={'transparent'}
              borderradius={'2px'}
              marginLeft={'10px'}
              value={jobTitle}
            />
          </div>
          <div className={styles.inputContainer}>
            <FaSearchLocation
              style={{ cursor: 'pointer', color: 'dimgray' }}
              size={22}
            />
            <ResumeInput
              placeholder="City or Country"
              name="jobtitle"
              value={jobLocation}
              onChange={handleJobLocationChange}
              borderColor={'transparent'}
              borderradius={'2px'}
              marginLeft={'10px'}
            />
          </div>
          <div>
            <CustomButton onClick={handleNavigate} label={'Find Job'} />
            {/* </CustomButton> */}
          </div>
        </div>
        <div className={styles.popular_searches}>
          <span>Popular Searches </span>
          <div
            style={{
              display: 'flex',
              flexDirection: 'row ',
              flexWrap: 'wrap',
            }}
          >
            {popularSearch.map((e, i) => (
              <div
                style={{
                  display: 'flex',
                  flexDirection: 'row',
                  padding: '2px',
                  cursor: 'pointer',
                  paddingLeft: '1rem',
                }}
              >
                <a
                  href="javascript:void(0)"
                  onClick={(e) => {
                    setJobTitle(e?.target?.textContent);
                  }}
                >
                  {e.title}
                </a>
              </div>
            ))}
          </div>
        </div>
      </div>
      {/* </Fade>
        <Fade bottom> */}
      {/* <div className={styles.HeaderImage}>
          <img width="100%" height="100%" src={HeaderImage} />
        </div> */}
      {/* </Fade> */}
    </section>
  );
}

export default Header;
