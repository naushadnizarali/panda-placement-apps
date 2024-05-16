import React from 'react';
import { useParams } from 'react-router-dom';
import { useState } from 'react';
import { useEffect } from 'react';
import Box from '@mui/material/Box';

import { FaCalendar } from 'react-icons/fa';
import { FaClock } from 'react-icons/fa';
import { FaCreditCard } from 'react-icons/fa';
import { FaStar } from 'react-icons/fa';
import { FaBagShopping } from 'react-icons/fa6';
import { FaLocationDot } from 'react-icons/fa6';
import { FaMoneyBillWave } from 'react-icons/fa';
import { FaSignature } from 'react-icons/fa';

import Grid from '@mui/material/Grid';
import { Avatar, Button, makeStyles } from '@mui/material';
import { LOCAL_PDF_EMPLOYER } from '../../Jsondata/URL';
import Toast from '../../../component/Toast/Toast';
import JobDescriptionComponent from '../../../component/JobDescription/JobDescriptionComponent';
import AdminApi from '../../../Apis/AdminApi';
import styles from './ViewJob.module.css';
import Goback from '../../../component/GoBackicon/goback';
import SmalldetailCard from '../../CommonPages/SmalldetailCard/SmalldetailCard';
import Jobcard from '../../../component/Jobcard/Jobcard';
import CustomSpinner from '../../../component/Spinner/Spinner';
function ViewJob() {
  const { id } = useParams();
  const adminapi = AdminApi();
  const [isloading, setIsloading] = useState(false);
  const [jobview, setjobview] = useState('');
  useEffect(() => {
    const getOneJob = async () => {
      setIsloading(true);
      try {
        const response = await adminapi.getOneJob(id);
        setjobview(response);
        setIsloading(false);
      } catch (error) {
        setIsloading(false);
        Toast.error('Please Login Again!');
        console.error('ERROR: In getting the Job details', error);
      }
    };
    getOneJob();
  }, [id]);

  return (
    <>
      {isloading ? (
        <div className={styles.loader}>
          <CustomSpinner />
        </div>
      ) : (
        <Box
          sx={{ flexGrow: 1 }}
          style={{
            position: 'relative',
            //   top: "60px",
          }}
          className={styles.jobdetailsbody}
        >
          <Box>
            <div
              className={styles['popular-job-category']}
              style={{
                backgroundColor: 'white',
                padding: '20px',
                borderRadius: '10px',
                marginBottom: '2rem',
              }}
            >
              <div className={styles.imageandtitlewrapper}>
                <Goback />
                <div style={{ marginLeft: '1.5rem', marginRight: '1.5rem' }}>
                  <Avatar
                    alt="Company Logo"
                    src={`${LOCAL_PDF_EMPLOYER}${jobview?.company?.logo}`}
                    sx={{ width: 100, height: 100 }}
                  />
                  {/* <img
                height={50}
                width={70}
                style={{ borderRadius: 20 }}
                src={`${LOCAL_PDF_EMPLOYER}${jobview?.company?.logo}`}
              /> */}
                </div>
                <div className={styles['category-info']}>
                  <div className={styles['title']}>
                    <h2 className="mt-3">{jobview?.title}</h2>
                  </div>

                  <div className={styles.oneiconandnamewrapper}>
                    <div className={styles.oneiconandname}>
                      <FaBagShopping
                        color="var(--gray)"
                        // icon={faBagShopping}
                      />
                      <p>
                        {jobview?.hiring_number
                          ? jobview?.hiring_number
                          : 'Not Found'}
                      </p>
                    </div>
                    <div className={styles.oneiconandname1}>
                      <FaLocationDot
                        color="var(--gray)"
                        // icon={FaLocationDot}
                      />
                      <p>
                        {jobview?.hiring_city},{jobview?.hiring_country}
                      </p>
                    </div>
                    <div className={styles.oneiconandname1}>
                      <FaClock
                        color="var(--gray)"
                        // icon={faClock}
                      />
                      <p>{jobview?.created_at}</p>
                    </div>
                    <div className={styles.oneiconandname1}>
                      <FaMoneyBillWave
                        color="var(--gray)"
                        // icon={faMoneyBill}
                      />
                      <p>
                        ${jobview?.salary_start_range} - $
                        {jobview?.salary_end_range}
                      </p>
                    </div>
                  </div>
                  {/* JOb TYPE CARD  */}
                  <div className={styles.info}>
                    <div className={styles.item}>
                      <p
                        className={styles.text}
                        style={getTextStyle('Full Time')}
                      >
                        {jobview?.type}
                      </p>
                    </div>
                    <div className={styles.item}>
                      <p
                        className={styles.text}
                        style={getTextStyle('Private')}
                      >
                        Private
                      </p>
                    </div>
                    <div className={styles.item}>
                      <p className={styles.text} style={getTextStyle('Urgent')}>
                        Urgent
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </Box>
          <Grid container spacing={2} className={styles.jobDesc}>
            {/* Left side details */}
            <Grid xs={12} md={8} className={styles.jobDescOnly}>
              <JobDescriptionComponent description={jobview?.description} />
            </Grid>
            {/* Right side content */}
            <Grid xs={12} md={4}>
              <div
                className={styles.detailBox}
                style={{
                  backgroundColor: 'var(--light-shade-grayish-blue)',
                  padding: 30,
                  marginLeft: 20,
                  borderRadius: 10,
                }}
              >
                <h5 className="cursor-pointer">Job Overview</h5>
                <SmalldetailCard
                  icon={FaCalendar}
                  title="Date Posted:"
                  detail={`Posted 1 hours ago`}
                  color="var(--primary-color)"
                />
                {/* <SmalldetailCard
                icon={faEmpire}
                title="Expiration date:"
                // detail={formattedDate}
                color="var(--primary-color)"
              /> */}
                <SmalldetailCard
                  icon={FaLocationDot}
                  title="Location:"
                  detail={`${jobview?.hiring_city}, ${jobview?.hiring_country}`}
                  color="var(--primary-color)"
                />
                <SmalldetailCard
                  icon={FaSignature}
                  title="Job Title:"
                  detail={jobview?.title}
                  color="var(--primary-color)"
                />
                <SmalldetailCard
                  icon={FaStar}
                  title="Rate:"
                  detail={jobview?.salary_rate}
                  color="var(--primary-color)"
                />
                <SmalldetailCard
                  icon={FaCreditCard}
                  title="Salary:"
                  detail={`$${jobview?.salary_start_range}, $${jobview?.salary_end_range}`}
                  color="var(--primary-color)"
                />
              </div>
              <div
                className={styles.detailBox}
                style={{
                  backgroundColor: 'var(--light-shade-grayish-blue)',
                  padding: 30,
                  borderRadius: 10,
                  marginTop: 20,
                  marginBottom: 50,
                  marginLeft: 20,
                }}
              >
                <h5>Company Profile</h5>
                <SmalldetailCard
                  title="Company Name:"
                  detail={jobview?.company?.company_name}
                  color="var(--primary-color)"
                />
                <SmalldetailCard
                  title="Primary industry:"
                  detail={jobview?.company?.company_type}
                  color="var(--primary-color)"
                />
                <SmalldetailCard
                  title="Company size:"
                  detail={jobview?.company?.employer_number}
                  color="var(--primary-color)"
                />
                <SmalldetailCard
                  title="Phone:"
                  detail={jobview?.company?.phone}
                  color="var(--primary-color)"
                />
                <SmalldetailCard
                  title="Founded in:"
                  detail={jobview?.company?.operating_since}
                  color="var(--primary-color)"
                />
                <SmalldetailCard
                  title="Email:"
                  detail={jobview?.company?.email}
                  color="var(--primary-color)"
                />
                <SmalldetailCard
                  title="Location:"
                  detail={`${jobview?.company?.city}, ${jobview?.company?.address}`}
                  color="var(--primary-color)"
                />
              </div>
            </Grid>
          </Grid>
        </Box>
      )}
    </>
  );
}

export default ViewJob;
function getTextStyle(text) {
  switch (text) {
    case 'Full Time':
      return {
        backgroundColor: 'rgba(25,103,210,.15)',
        color: 'var(--primary-color)',
      };
    case 'Private':
      return { backgroundColor: 'rgba(52,168,83,.15)', color: 'var( --green)' };
    case 'Urgent':
      return {
        backgroundColor: 'rgba(249,171,0,.15)',
        color: 'var(--goldenroad)',
      };
    default:
      return {};
  }
}
