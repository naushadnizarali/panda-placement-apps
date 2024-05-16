import { faCoins } from '@fortawesome/free-solid-svg-icons';
import React, { useEffect, useState } from 'react';
import { Fade } from 'react-reveal';
import UserApi from '../../../Apis/UserApi';
import ChangeDate from '../../../Helpers/DateConvertion';
import { fetchUserData } from '../../../../redux/slice/userdataSlice';
import Featured from '../../../component/Featured/Featured';
import GettingStart from '../../../component/Get Started/GettingStart';
import Header from '../../../component/Header/Header';
import NewsLetter from '../../../component/Newletter/Newletter';
import PopularJobCategory from '../../../component/PopularJobCategories/PopularJobCategories';
import { useDispatch } from 'react-redux';
import { fetchDataSuccess } from '../../../../redux/slice/getAuthUserJobsSlice';
import BlogCard from '../../../component/Blogcard/BlogCard';
import NotifyModal from '../../../component/notifyModal/NotifyModal';
import { bookmarkJob } from '../../../../redux/slice/jobSlice';

function UserHome() {
  const dispatch = useDispatch();
  const userapi = UserApi();
  const [filteredJobs, setFilteredJobs] = useState([]);
  const [jobs, setjobs] = useState([]);
  const [isloading, setIsloading] = useState(false);
  const [blogs, setBlogs] = useState(null);
  const [data, setData] = useState();
  const [isblogload, setisblogload] = useState(false);
  const [usercurrency, setusercurrency] = useState('second');
  const getRandomIcon = () => {
    const availableIcons = [
      'faShoppingBag',
      'faChartSimple',
      'faCubes',
      'faWindowRestore',
      'faSunPlantWilt',
      'faRobot',
      'faCubes',
      'faWindowRestore',
      'faWindowRestore',
    ];
    const randomIndex = Math.floor(Math.random() * availableIcons.length);
    return availableIcons[randomIndex];
  };

  const userdata = async () => {
    try {
      const response = await userapi.UserProfileInformation();
      dispatch(fetchUserData(response));
    } catch (error) {
      console.error('Error in user data', error);
    }
  };
  useEffect(() => {
    userdata();
  }, []);

  // const getUserCurrency = async () => {
  //   try {
  //     const response = await userapi.getUserCurrency();
  //     console.log("response", response?.length);
  //     if (response?.length === 0) {
  //       await localStorage?.setItem("currency", "PKR - Pakistani Rupee (₨)");
  //     }
  //   } catch (error) {
  //     console.error("Error in User home", error);
  //   }
  // };

  // useEffect(() => {
  //   const currency = localStorage.getItem("currency");
  //   // setistoken(token);
  //   setusercurrency(currency);
  // }, []);

  // const getAllJobs = async () => {
  //   setIsloading(true);
  //   try {
  //     const response = await userapi.GetuserJobs();
  //     const jobsWithTimeAgo = response?.map(async (job) => {
  //       // NOTE:converting the Currency
  //       // const convertedStartRange = await ConvertCurrency(
  //       //   USD - United States Dollar ($)",
  //       //   "PKR - Pakistani Rupee (₨)",
  //       //   job?.salary_start_range
  //       // );
  //       // const convertedEndRange = await ConvertCurrency(
  //       //   "USD - United States Dollar ($)",
  //       //   "PKR - Pakistani Rupee (₨)",
  //       //   job?.salary_end_range
  //       // );
  //       if (job && job.created_at) {
  //         const timeAgo = ChangeDate(job?.created_at);
  //         // Update the job object with converted salary values
  //         const jobWithConvertedSalary = {
  //           ...job,
  //           postedAgo: timeAgo,
  //           // isBookMark: // SEND BOOKMARK
  //           // currency: convertedStartRange.currency,
  //           // salary_start_range: convertedStartRange.currencyResult,
  //           // salary_end_range: convertedEndRange.currencyResult,
  //         };
  //         return jobWithConvertedSalary;
  //       } else {
  //         console.warn("Job object is missing 'created_at' property:", job);
  //         setIsloading(false);
  //         return job;
  //       }
  //     });
  //     // Wait for all salary conversions to complete
  //     const jobsWithConvertedSalaries = await Promise.all(jobsWithTimeAgo);
  //     setjobs(jobsWithConvertedSalaries);
  //     dispatch(fetchDataSuccess(jobsWithConvertedSalaries)); //Jobs Is in Store
  //     const categoryCounts = {};
  //     jobsWithConvertedSalaries?.forEach((job) => {
  //       const category = job?.category || "others";
  //       if (category) {
  //         categoryCounts[category] = (categoryCounts[category] || 0) + 1;
  //       }
  //     });
  //     const categoryArray = Object.keys(categoryCounts)
  //       ?.map((category) => ({
  //         iconwhite: faCoins,
  //         title: category,
  //         opening: categoryCounts[category],
  //       }))
  //       .sort((a, b) => b.opening - a.opening)
  //       .slice(0, 9);
  //     setData(categoryArray);
  //     setIsloading(false);
  //   } catch (error) {
  //     setIsloading(false);
  //     console.error("Error in Get all job in USER", error);
  //   }
  // };

  const getAllblogPosts = async () => {
    setisblogload(true);
    try {
      const response = await userapi.blogs();
      setBlogs(response);
      setisblogload(false);
    } catch (error) {
      setisblogload(false);
      console.error(error);
    }
  };

  const getAllJobs = async () => {
    setIsloading(true);
    try {
      const response = await userapi.GetuserJobs();
      response.forEach((job) => {
        if (job?.bookmark === true) {
          // Dispatch the bookmarkJob action to save the ID of the bookmarked job
          dispatch(bookmarkJob(job.id));
        }
      });
      const jobsWithTimeAgo =
        response &&
        response.map((job) => {
          // Check if 'created_at' property exists
          if (job && job.created_at) {
            const timeAgo = ChangeDate(job.created_at);
            return {
              ...job,
              postedAgo: timeAgo,
            };
          } else {
            console.warn("Job object is missing 'created_at' property:", job);
            return job;
          }
        });
      setjobs(jobsWithTimeAgo);
      const categoryCounts = {};
      jobsWithTimeAgo.forEach((job, index) => {
        const category = job?.category || 'others';
        if (category) {
          categoryCounts[category] = (categoryCounts[category] || 0) + 1;
        }
      });
      const categoryArray = Object?.keys(categoryCounts)
        ?.map((category) => ({
          iconwhite: faCoins,
          title: category,
          opening: categoryCounts[category],
        }))
        .sort((a, b) => b.opening - a.opening)
        .slice(0, 9);
      setData(categoryArray);
      setIsloading(false);
    } catch (error) {
      setIsloading(false);
      console.error('ERROR :Geting All Jobs', error);
    }
  };

  useEffect(() => {
    getAllJobs();
    getAllblogPosts();
    // filterJobs();
  }, []);

  useEffect(() => {
    if (jobs.length === 0) {
      setFilteredJobs([]);
    } else {
      setFilteredJobs(jobs);
    }
  }, [jobs]);

  useEffect(() => {
    window.scrollTo(0, 0); // Scroll to the top when the component mounts
  }, []);

  return (
    <div
      style={{
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: 'var(--light-shade-blue-gray)',
      }}
    >
      <Header />
      <NotifyModal />
      <Featured isloading={isloading} data={jobs} />
      <PopularJobCategory data={data} />
      <Fade bottom>
        <GettingStart />
      </Fade>
      <Fade bottom>
        <NewsLetter />
      </Fade>
      <Fade bottom>
        <div
          style={{
            width: '75%',
            margin: '0 auto',
          }}
        >
          <div
            style={{
              textAlign: 'center',
              marginTop: '1rem',
              marginBottom: '1rem',
            }}
          >
            <h2>Recent New Blogs</h2>
            <div>
              Stay informed with the latest happenings. Explore insightful blogs
              and updates that cover a diverse range of topics to keep you
              engaged and well-informed.
            </div>
          </div>
          <BlogCard isloading={isblogload} Data={blogs?.slice(0, 4)} />
        </div>
      </Fade>
    </div>
  );
}

export default UserHome;
