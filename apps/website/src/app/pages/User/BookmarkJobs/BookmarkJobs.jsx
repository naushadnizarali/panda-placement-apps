import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useParams } from 'react-router-dom';
import UserApi from '../../../Apis/UserApi';
import ChangeDate from '../../../Helpers/DateConvertion';
import { removebookmarkJob } from '../../../../redux/slice/jobSlice';
import {
  addSaveJobs,
  removeSaveJobs,
} from '../../../../redux/slice/saveJobsSlice';
import Jobcard from '../../../component/Jobcard/Jobcard';
import CustomSpinner from '../../../component/Spinner/Spinner';
import Toast from '../../../component/Toast/Toast';
import styles from './BookmarkJobs.module.css';

function BookmarkJobs() {
  const dispatch = useDispatch();
  const userapi = UserApi();
  const { id } = useParams();
  const [data1, setData] = useState([]);
  const [isloading, setisloading] = useState(false);
  const data = useSelector((state) => state?.saveJobs?.data);

  const appliedJobs = async () => {
    setisloading(true);
    try {
      const response = await userapi.getSaveJobs();
      const jobsArray = response?.map((item) => item?.job);
      // console.log(jobsArray)
      const JobsWithTimeAgo = jobsArray.map((job) => {
        if (job && job?.created_at) {
          const timeAgo = ChangeDate(job?.created_at);
          return {
            ...job,
            postedAgo: timeAgo,
            bookmark: true,
          };
        }
      });
      dispatch(addSaveJobs(JobsWithTimeAgo));
      setData(JobsWithTimeAgo);
      setisloading(false);
    } catch (error) {
      setisloading(false);
      console.error('Error in My JOb', error);
    }
  };

  const deleteSaveJobs = async (id) => {
    // setisloading(true)
    try {
      const response = await userapi.deleteSaveJobs(id);
      Toast.success('Job unSaved');
      // setisloading(false)
      dispatch(removeSaveJobs(id));
      dispatch(removebookmarkJob(id));
      // appliedJobs();
    } catch (error) {
      // setisloading(false)
      console.error('Error in My JOb', error);
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
            <h1 className={styles.pageHeading}>Saved Jobs</h1>
            <p className={styles.appliedCount}>
              You have Saved {data?.length} Jobs
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
            <div style={{ margin: '0 -5%' }}>
              <Jobcard
                handleClick={(e) => {
                  deleteSaveJobs(e);
                }}
                islogin
                data={data}
              />
            </div>
          ) : (
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                height: '50vh',
              }}
            >
              <h4>No Job Saved yet</h4>
            </div>
          )}
        </div>
      </div>
    </>
  );
}

export default BookmarkJobs;
