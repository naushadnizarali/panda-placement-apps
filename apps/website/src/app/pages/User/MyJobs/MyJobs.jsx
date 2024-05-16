import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import UserApi from '../../../Apis/UserApi';
import ChangeDate from '../../../Helpers/DateConvertion';
import Jobcard from '../../../component/Jobcard/Jobcard';
import CustomSpinner from '../../../component/Spinner/Spinner';
import Toast from '../../../component/Toast/Toast';
import styles from './MyJobs.module.css';
import { useDispatch } from 'react-redux';
import {
  bookmarkJob,
  removebookmarkJob,
} from '../../../../redux/slice/jobSlice';

function MyJobs() {
  const dispatch = useDispatch();
  const userapi = UserApi();
  const { id } = useParams();
  const [data, setData] = useState([]);
  const [isloading, setisloading] = useState(false);

  const appliedJobs = async () => {
    setisloading(true);
    try {
      const response = await userapi.userAppliedJobs();
      const companyLogo = response?.map((item) => item?.company?.logo);
      const jobsArray = response?.map((item) => item.job);

      // Sort by applied_date in descending order
      const sortedJobs = response?.sort((a, b) => {
        const dateA = new Date(a.applied_date);
        const dateB = new Date(b.applied_date);
        return dateB - dateA;
      });

      const jobsWithTimeAgo = sortedJobs?.map((job, index) => {
        const appliedDate = job.applied_date;
        // Check if 'applied_date' is a valid date
        if (!isNaN(new Date(appliedDate))) {
          // NOTE: ChangeDate Is A Helper Function To convert The Date into readAbleFormat
          const me = ChangeDate(job?.job?.created_at);
          const timeAgo = ChangeDate(appliedDate);
          setisloading(false);
          return {
            ...job?.job,
            company: response[index]?.company,
            logo: companyLogo[index],
            postedAgo: me,
            appliedAgo: timeAgo,
            applicationID: response[index]?.id,
          };
        } else {
          setisloading(false);
          console.warn("Invalid 'applied_date' format:", job);
          return job;
        }
      });
      setData(jobsWithTimeAgo);
      setisloading(false);
    } catch (error) {
      setisloading(false);
      console.error('Error in My JOb', error);
    }
  };

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
      console.error('Error in My Job', error);
      Toast.error('ERROR: Please Try Later');
    }
  };
  useEffect(() => {
    appliedJobs();
  }, []);

  return (
    <>
      <div style={{ position: 'relative', top: '60px', marginBottom: '50px' }}>
        <div className={styles.backgroundImage}>
          <div className={styles.text}>
            <h1 className={styles.pageHeading}>Applied Jobs</h1>
            <p className={styles.appliedCount}>
              You have applied to {data?.length} Jobs
            </p>
          </div>
        </div>
        {/* job cards here */}
        <div className={styles.cards}>
          {isloading ? (
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                height: '50vh',
              }}
            >
              <CustomSpinner />
            </div>
          ) : data?.length > 0 ? (
            <Jobcard
              isApplicationCard={true}
              handleClick={(e) => deleteBookmark(e)} //Delete Bookmark
              handleAddBookmark={(e) => addBookmark(e)} //Saved Bookmark
              islogin
              data={data}
            />
          ) : (
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                height: '50vh',
              }}
            >
              <h4>Applied Jobs Not Found</h4>
            </div>
          )}
        </div>
      </div>
    </>
  );
}

export default MyJobs;
