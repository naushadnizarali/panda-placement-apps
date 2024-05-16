import { faBookmark } from '@fortawesome/free-regular-svg-icons';
import { faBookmark as solidBookmark } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import Avatar from '@mui/material/Avatar';
import React, { useEffect, useState } from 'react';
import { GrAnnounce } from 'react-icons/gr';
import { IoLocationOutline, IoTimeOutline } from 'react-icons/io5';
import { LiaMoneyBillWaveSolid } from 'react-icons/lia';
import { useSelector } from 'react-redux';
import { Fade } from 'react-reveal';
import { useNavigate } from 'react-router-dom';
import { addThousandSeparator } from '../../Helpers/ThousandSeparator';
import { LOCAL_PDF_EMPLOYER } from '../../pages/Jsondata/URL';
import CustomButton from '../Button/CustomButton';
import CustomSpinner from '../Spinner/Spinner';
import styles from './Jobcard.module.css';

function Jobcard({
  data,
  isFilterScreen,
  ishowpagination,
  isloading,
  handleClick,
  handleAddBookmark,
  job,
  isApplicationCard,
}) {
  const navigate = useNavigate();
  const bookmarkedJobs = useSelector((state) => state.job.bookmarkedJobs);
  const [currentPage, setCurrentPage] = useState(1);

  const isAuthenticated = useSelector(
    (state) => state.loginuser.isAuthenticated,
  );

  const itemsPerPage = 6;
  const totalPages = Math.ceil(data?.length / itemsPerPage);

  const generatePageNumbers = () => {
    const range = 2; // Number of page numbers to show on either side of the current page
    const pageNumbers = [];
    for (
      let i = Math.max(1, currentPage - range);
      i <= Math.min(totalPages, currentPage + range);
      i++
    ) {
      pageNumbers.push(i);
    }

    return pageNumbers;
  };
  const pageNumbers = generatePageNumbers();
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = Math.min(startIndex + itemsPerPage, data?.length);
  const currentData = data?.slice(startIndex, endIndex);

  // navigate(`/job/${e.slug}`);
  const handleJobDetailPage = (e) => {
    if (isApplicationCard) {
      navigate(`/myapplication/${e.applicationID}/${e.slug}`);
      // navigate(`/job/${e.slug}`, { state: { data: e } });
    } else {
      // navigate(`/job/${e.slug}`, { state: { data: e } });
      navigate(`/job/${e.slug}`);
    }
  };

  return (
    <div>
      <div className={styles.warapper}>
        {isloading ? (
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            <CustomSpinner />
          </div>
        ) : (
          currentData &&
          currentData?.map((e, i) => (
            <Fade bottom key={i}>
              <div
                className={
                  isFilterScreen
                    ? styles['popular-job-categoryOnIsFilter']
                    : currentData?.length === 1
                      ? styles['popular-job-category-oneCard']
                      : styles['popular-job-category']
                }
              >
                <div className={styles['icon-bg']}>
                  <Avatar
                    alt="Company Logo"
                    src={`${LOCAL_PDF_EMPLOYER}${
                      e?.company?.logo ? e?.company?.logo : e?.logo
                    }`}
                    sx={{ width: 80, height: 80 }}
                  />
                  {/* <img
                  height={"100%"}
                  width={"100%"}
                  alt="Company Logo"
                  src={`${LOCAL_PDF_EMPLOYER}${
                    e?.company?.logo ? e?.company?.logo : e?.logo
                  }`}
                /> */}
                </div>
                <div className={styles['category-info']}>
                  <div className={styles['title']}>
                    <h2
                      onClick={() => {
                        handleJobDetailPage(e);
                      }}
                    >
                      {e?.title}
                    </h2>
                    <div>
                      <FontAwesomeIcon
                        onClick={() => {
                          (bookmarkedJobs && bookmarkedJobs?.includes(e.id)) ||
                          e?.bookmark
                            ? handleClick(e.id)
                            : handleAddBookmark(e.id);
                        }}
                        className={styles.bookmark}
                        icon={
                          bookmarkedJobs?.includes(e.id)
                            ? solidBookmark
                            : faBookmark
                        }
                      />
                    </div>
                  </div>
                  {/* JOB TYPE CARD  */}

                  <div className={styles.info}>
                    <div className={styles.item}>
                      <p
                        className={styles.text}
                        style={getTextStyle('Full Time')}
                      >
                        {e?.type}
                      </p>
                    </div>
                    {e?.hide_company && (
                      <div className={styles.item}>
                        <p
                          className={styles.text}
                          style={getTextStyle('Private')}
                        >
                          Private
                        </p>
                      </div>
                    )}
                    {e?.hiring_timeline && (
                      <div className={styles.item}>
                        <p
                          className={styles.text}
                          style={getTextStyle('Urgent')}
                        >
                          Urgent
                        </p>
                      </div>
                    )}
                  </div>
                  <div
                    // Card Click
                    onClick={() => {
                      handleJobDetailPage(e);
                    }}
                    className={` ${styles.oneiconandnamewrapper} `}
                  >
                    <div className={`${styles.row} row`}>
                      <div className={`${styles.oneiconandname} col-5 my-2`}>
                        <GrAnnounce
                          style={
                            !e?.application_status
                              ? { color: 'var(--primary-color)' }
                              : getJobStatus(e?.application_status)
                          }
                        />
                        <p style={getJobStatus(e?.application_status)}>
                          {e?.application_status === 'Reject' ? (
                            'Unselected'
                          ) : e?.application_status ? (
                            e?.application_status
                          ) : (
                            <span className={styles.applynow}>Apply Now</span>
                          )}
                        </p>
                      </div>
                      <div className={`${styles.oneiconandname1} col-7 my-2`}>
                        <IoLocationOutline
                          color="var(--gray)"
                          //  icon={faLocationArrow}
                        />
                        <p className={styles.cardText}>
                          {e?.hiring_city},{'  '}
                          {e?.hiring_country}
                        </p>
                      </div>
                    </div>
                    <div className="row">
                      {e?.appliedAgo ? (
                        <div className={`${styles.oneiconandname1} col-5 my-2`}>
                          <IoTimeOutline
                            color="var(--gray)"
                            // icon={faClock}
                          />
                          {/* <FontAwesomeIcon color="var(--gray)" icon={faClock} /> */}
                          <p>{e?.appliedAgo}</p>
                        </div>
                      ) : (
                        <div className={`${styles.oneiconandname1} col-5 my-2`}>
                          <IoTimeOutline
                            color="var(--gray)"
                            // icon={faClock}
                          />
                          <p>{e?.postedAgo}</p>
                        </div>
                      )}
                      <div className={`${styles.oneiconandname1} col-7 my-2`}>
                        <LiaMoneyBillWaveSolid
                          color="var(--gray)"
                          //  icon={faMoneyBill}
                        />
                        {e?.salary_start_range && e?.salary_end_range && (
                          <p>
                            {addThousandSeparator(e?.salary_start_range)} -{' '}
                            {addThousandSeparator(e?.salary_end_range)}
                          </p>
                        )}
                        {!e?.salary_start_range && !e?.salary_end_range && (
                          <p>Market Compatible</p>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </Fade>
          ))
        )}
      </div>

      {ishowpagination ? (
        <div className="flex items-center justify-center">
          <CustomButton
            onClick={() => {
              navigate('/findJobs');
            }}
            label={'Load more'}
          />
        </div>
      ) : (
        <div className="flex items-center justify-between border-gray-200 px-4 py-3 sm:px-6 w-3/4 mx-auto">
          <div className="flex flex-wrap items-center justify-between sm:flex sm:flex-1 sm:items-center sm:justify-between">
            <>
              <p className="text-sm text-gray">
                Showing <span className="font-medium">{startIndex + 1}</span> to
                <span className="font-medium">{endIndex}</span> of
                <span className="font-medium">{data?.length}</span> results
              </p>
            </>
            <>
              <nav
                className="isolate inline-flex -space-x-px rounded-md shadow-sm"
                aria-label="Pagination"
              >
                <button
                  onClick={() => setCurrentPage(currentPage - 1)}
                  disabled={currentPage === 1}
                  className={`relative inline-flex items-center rounded-l-md px-2 py-1 text-black ring-1 ring-inset ring-gray-300 hover:bg-gray-50 focus:z-20 focus:outline-offset-0 ${
                    currentPage === 1 ? 'cursor-not-allowed' : ''
                  }`}
                >
                  <span className="sr-only">Previous</span>
                  Previous
                </button>
                {pageNumbers &&
                  pageNumbers.map((pageNumber) => (
                    <button
                      key={pageNumber}
                      onClick={() => setCurrentPage(pageNumber)}
                      className={`relative inline-flex items-center px-4 py-2 text-sm font-semibold ${
                        currentPage === pageNumber
                          ? 'bg-white text-black'
                          : 'text-gray-900 ring-1 ring-inset ring-gray-300 hover:bg-gray-50 focus:z-20 focus:outline-offset-0'
                      }`}
                    >
                      {pageNumber}
                    </button>
                  ))}
                <button
                  onClick={() => setCurrentPage(currentPage + 1)}
                  disabled={currentPage === totalPages}
                  className={`relative inline-flex items-center rounded-r-md px-2 py-2 text-black ring-1 ring-inset ring-gray-300 hover:bg-gray-50 focus:z-20 focus:outline-offset-0 ${
                    currentPage === totalPages ? 'cursor-not-allowed' : ''
                  }`}
                >
                  <span className="sr-only">Next</span>
                  Next
                </button>
              </nav>
            </>
          </div>
        </div>
      )}
    </div>
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
function getJobStatus(text) {
  switch (text) {
    case 'Shortlist':
      return { color: 'var(--green)' };
    case 'Reject':
      return { color: 'var(--red-color)' };
    case 'Pending':
      return { color: 'var(--goldenroad)' };
    case 'Viewed':
      return { color: 'var(--bright-blue)' };
    default:
      return {};
  }
}
export default Jobcard;
