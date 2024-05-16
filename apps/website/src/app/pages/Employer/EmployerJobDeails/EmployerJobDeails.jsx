import {
  FaCalendar,
  FaSignature,
  FaStar,
  FaCreditCard,
  FaShoppingBag,
  FaClock,
} from 'react-icons/fa';
import { FaLocationDot } from 'react-icons/fa6';
import { RiPassExpiredFill } from 'react-icons/ri';
import { FaMoneyBillWave } from 'react-icons/fa';
import Box from '@mui/material/Box';
import Grid from '@mui/material/Grid';
import Paper from '@mui/material/Paper';
import { styled } from '@mui/material/styles';
import * as React from 'react';
import { useEffect, useState, useRef } from 'react';
import { Fade } from 'react-reveal';
import { useLocation, useNavigate } from 'react-router-dom';
import UserApi from '../../../Apis/UserApi';
import { addThousandSeparator } from '../../../Helpers/ThousandSeparator';
import Goback from '../../../component/GoBackicon/goback';
import JobDescriptionComponent from '../../../component/JobDescription/JobDescriptionComponent';
import SmalldetailCard from '../../CommonPages/SmalldetailCard/SmalldetailCard';
import { LOCAL_PDF_EMPLOYER } from '../../Jsondata/URL';
import styles from './EmployerJobDeails.module.css';
import { DynamicTitle } from '../../../Helpers/DynamicTitle';
import CustomButton from '../../../component/Button/CustomButton';
import GenerateCode from '../../../component/GenerateCode/GenerateCode';
const Item = styled(Paper)(({ theme }) => ({
  backgroundColor:
    theme.palette.mode === 'dark'
      ? 'var(--dark-shade-black)'
      : 'var(--white-color)',
  ...theme.typography.body2,
  padding: theme.spacing(1),
  textAlign: 'center',
  color: theme.palette.text.secondary,
}));

export default function EmployerJobDeails() {
  const location = useLocation();
  const navigate = useNavigate();
  const userapi = UserApi();
  const [jodIDFound, setjodIDFound] = useState(null);
  const data = location?.state?.data;
  const postedAgo = location?.state?.created_at;
  const dateString = data?.application_deadline;
  const date = new Date(dateString);
  const date1 = new Date(postedAgo);
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
  const postedDateConvertformattedDate = `${month} ${day
    .toString()
    .padStart(2, '0')}, ${year}`;

  useEffect(() => {
    window.scrollTo(0, 0); // Scroll to the top when the component mounts
  }, []);

  React.useMemo(() => {
    // cheakAlreadyApply();
  }, [data]);

  useEffect(() => {
    DynamicTitle('JobDeails');
  }, []);

  return (
    <>
      <Fade bottom>
        <div style={{ marginLeft: '1rem' }}>
          <Goback
            onClick={() => {
              navigate('/employer/jobs');
            }}
          />
        </div>
        <Box sx={{ flexGrow: 1 }} className={styles.jobdetailsbody}>
          <Box>
            <div
              style={{
                backgroundColor: 'var(--white-color)',
                padding: '1.5rem',
                borderRadius: '10px',
                marginBottom: '2rem',
              }}
            >
              <div className={styles.imageandtitlewrapper}>
                <div className={styles['category-info']}>
                  <div className={styles['title']}>
                    <h2 className="mt-3">{data?.title}</h2>
                  </div>

                  <div className={styles.oneiconandnamewrapper}>
                    <div className={styles.oneiconandname}>
                      <FaShoppingBag
                        color="var(--secondary-gray-color)"
                        // icon={faBagShopping}
                      />
                      <p>
                        {data?.hiring_number
                          ? data?.hiring_number
                          : 'Not Found'}
                      </p>
                    </div>
                    <div className={styles.oneiconandname1}>
                      <FaLocationDot
                        color="var(--secondary-gray-color)"
                        // icon={faLocationArrow}
                      />
                      <p>
                        {data?.hiring_city},{data?.hiring_country}
                      </p>
                    </div>
                    <div className={styles.oneiconandname1}>
                      <FaMoneyBillWave
                        color="var(--secondary-gray-color)"
                        // icon={faMoneyBill}
                      />
                      <p>
                        {/* <FormatPrice value={data?.salary_start_range} /> */}
                        {data?.salary_currency ?? data?.salary_currency}
                        {''}
                        {addThousandSeparator(data?.salary_start_range)} -
                        {data.salary_currency ?? data.salary_currency}
                        {''}
                        {addThousandSeparator(data?.salary_end_range)}
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
                        {data?.type}
                      </p>
                    </div>

                    <div className={styles.item}>
                      {data.hide_company && (
                        <p
                          className={styles.text}
                          style={getTextStyle('Private')}
                        >
                          Private
                        </p>
                      )}
                    </div>
                    <div className={styles.item}>
                      {data.hiring_timeline && (
                        <p
                          className={styles.text}
                          style={getTextStyle('Urgent')}
                        >
                          Urgent
                        </p>
                      )}
                    </div>
                  </div>
                </div>
                {data?.status === 'Approved' && data.phase === 'Open' ? (
                  <div>
                    <GenerateCode title={data?.slug} />
                  </div>
                ) : (
                  <div>
                    <p style={{ color: 'red' }}>
                      This Job Status is {data?.status} and Phase is{' '}
                      {data?.phase}
                    </p>
                  </div>
                )}
              </div>
            </div>
          </Box>
          <Grid container spacing={2} className={styles.jobDesc}>
            {/* Left side details */}
            <Grid
              xs={12}
              md={8}
              style={{ backgroundColor: '#fff', padding: '1rem' }}
            >
              <JobDescriptionComponent description={data?.description} />
            </Grid>
            {/* Right side content */}
            <Grid xs={12} md={4}>
              <div
                className={styles.detailBox}
                style={{
                  backgroundColor: 'var(--white-color)',
                  padding: 30,
                  borderRadius: 10,
                  marginLeft: '0.9rem',
                  '@media (max-width: 768px)': {
                    marginLeft: '0rem',
                  },
                }}
              >
                <h5 className="cursor-pointer">Job Overview</h5>
                <SmalldetailCard
                  icon={FaCalendar}
                  title="Date Posted:"
                  detail={postedDateConvertformattedDate}
                  color="var(--primary-color)"
                />
                <SmalldetailCard
                  icon={RiPassExpiredFill}
                  title="Expiration date:"
                  detail={formattedDate}
                  color="var(--primary-color)"
                />
                <SmalldetailCard
                  icon={FaLocationDot}
                  title="Location:"
                  detail={`${data?.hiring_city}, ${data?.hiring_country}`}
                  color="var(--primary-color)"
                />
                <SmalldetailCard
                  icon={FaSignature}
                  title="Job Title:"
                  detail={data?.title}
                  color="var(--primary-color)"
                />
                <SmalldetailCard
                  icon={FaStar}
                  title="Rate:"
                  detail={data?.salary_rate}
                  color="var(--primary-color)"
                />
              </div>
            </Grid>
          </Grid>
        </Box>
      </Fade>
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
