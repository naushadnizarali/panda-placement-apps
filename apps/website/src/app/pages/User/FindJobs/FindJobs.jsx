import React, { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { useLocation, useParams } from 'react-router-dom';
import UserApi from '../../../Apis/UserApi';
import ChangeDate from '../../../Helpers/DateConvertion';
import UserFilter from '../../../component/Filters/Fliter';
import styles from './FindJobs.module.css';
import { bookmarkJob } from '../../../../redux/slice/jobSlice';
import { useDispatch } from 'react-redux';
import { fetchDataSuccess } from '../../../../redux/slice/getAuthUserJobsSlice';

function FindJobs() {
  const { data } = useSelector((state) => state?.getAuthUserJobs);
  const selectedCountry = useSelector(
    (state) => state?.SelectedCountry?.Country
  );
  const location = useLocation();
  const isAuthenticated = useSelector(
    (state) => state.loginuser.isAuthenticated
  );

  const userapi = UserApi();
  const { id } = useParams();
  const usedispatch = useDispatch();
  // const [jobs, setjobs] = useState(data); //Showing data From Store
  const [jobs, setjobs] = useState([]); //Showing data From Store
  const [isloading, setIsloading] = useState(false);
  const [filteredJobs, setFilteredJobs] = useState([]);

  //Showing data From Store

  const getAllJobs = async () => {
    setIsloading(true);
    try {
      let response = [];
      if (isAuthenticated) {
        response = await userapi.GetuserJobs();
        // console.log(response)
        setIsloading(false);
      } else {
        response = await userapi.GetAllJobs();
        setIsloading(false);
      }
      const jobsWithTimeAgo =
        response &&
        response?.map((job) => {
          // Check if 'created_at' property exists
          if (job && job.created_at) {
            const timeAgo = ChangeDate(job?.created_at);
            const postedTimestamp = new Date(job.created_at);

            return {
              ...job,
              postedAgo: timeAgo,
              timestamp: postedTimestamp.getTime(),
            };
          } else {
            console.warn("Job object is missing 'created_at' property:", job);
            setIsloading(false);
            return job;
          }
        });
      const sortedJobs = jobsWithTimeAgo.sort(
        (a, b) => b.timestamp - a.timestamp
      );
      setjobs(sortedJobs);
      usedispatch(fetchDataSuccess(sortedJobs));
      setIsloading(false);
    } catch (error) {
      setIsloading(false);
      console.error('Error in Find Job', error);
    }
  };

  const filterJobs = (title, location) => {
    if (!title && !location && !selectedCountry) {
      setFilteredJobs(jobs); // Show all jobs if both fields are empty
    } else {
      const filtered = jobs?.filter((job) => {
        const titleMatch = title
          ? job.title.toLowerCase().includes(title.toLowerCase())
          : true;
        const locationMatch = location
          ? job.hiring_city.toLowerCase().includes(location.toLowerCase())
          : true;
        return titleMatch && locationMatch;
      });
      setFilteredJobs(filtered);
    }
  };

  useEffect(() => {
    if (jobs.length === 0) {
      setFilteredJobs([]);
    } else {
      setFilteredJobs(jobs);
    }
  }, [jobs]);

  useEffect(() => {
    getAllJobs();
    // filterJobs();
  }, []);

  useEffect(() => {
    window.scrollTo(0, 0); // Scroll to the top when the component mounts
  }, []);

  return (
    <>
      <div className={styles.FindJobsContainer}>
        <div className={styles.header}>
          <h1>Find Jobs</h1>
          <p>Home / Jobs</p>
        </div>
        <div style={{ marginTop: 90 }}>
          <UserFilter
            loading={isloading}
            location={
              selectedCountry
                ? selectedCountry
                : location?.state?.data?.jobLocation
            }
            title={location?.state?.data?.jobTitle}
            Alljobs={filteredJobs}
          />
        </div>
      </div>
    </>
  );
}

export default FindJobs;
