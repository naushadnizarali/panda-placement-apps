import { faCoins } from '@fortawesome/free-solid-svg-icons'; //Not Change
import React, { useEffect, useState } from 'react';
import { useDispatch } from 'react-redux';
import { Fade } from 'react-reveal';
import UserApi from '../../Apis/UserApi';
import BlogCard from '../../component/Blogcard/BlogCard';
import Featured from '../../component/Featured/Featured';
import RowAndColumnSpacing from '../../component/Get Started/GettingStart';
import Header from '../../component/Header/Header';
import NotifyModal from '../../component/notifyModal/NotifyModal';
import PopularJobCategory from '../../component/PopularJobCategories/PopularJobCategories';
import ChangeDate from '../../Helpers/DateConvertion';
import { setAllBlogData } from '../../../redux/slice/allBlogDataSlice';
import { fetchDataSuccess } from '../../../redux/slice/getAuthUserJobsSlice';

function Home() {
  const dispatch = useDispatch();
  const [data, setData] = useState();
  const userapi = UserApi();
  const [jobs, setjobs] = useState([]);
  const [isloading, setIsloading] = useState(false);
  const [blogs, setBlogs] = useState(null);
  // dispatch(fetchDataSuccess(jobsWithConvertedSalaries));
  const getAllJobs = async () => {
    setIsloading(true);
    try {
      const response = await userapi.GetAllJobs();
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
      dispatch(fetchDataSuccess(jobsWithTimeAgo));
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

  const getAllblogPosts = async () => {
    setIsloading(true);
    try {
      const response = await userapi.blogs();
      setBlogs(response);
      dispatch(setAllBlogData(response));
      setIsloading(false);
    } catch (error) {
      setIsloading(false);
      console.error(error);
    }
  };

  const getCat = async () => {
    try {
      const response = await userapi?.getCategoty();
    } catch (error) {
      console.error('This is all get category', error);
    }
  };

  useEffect(() => {
    getAllJobs();
    getCat();
    getAllblogPosts();
    // filterJobs();
  }, []);

  useEffect(() => {
    window.scrollTo(0, 0); // Scroll to the top when the component mounts
  }, []);

  return (
    <>
      <div
        style={{
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'center',
          alignContent: 'center',
          backgroundColor: 'var(--light-shade-blue-gray)',
        }}
      >
        {/* <Navbar userid={id} /> */}
        <Header />
        <NotifyModal />
        <Featured isloading={isloading} data={jobs} />
        <PopularJobCategory data={data} />
        <Fade bottom>
          <RowAndColumnSpacing />
        </Fade>
        <Fade bottom>
          <div
            style={{
              width: '75%',
              margin: '0 auto',
            }}
          >
            <div>
              <div
                style={{
                  textAlign: 'center',
                  marginTop: '1rem',
                  marginBottom: '1rem',
                }}
              >
                <h2>Recent New Blogs</h2>
                <div>
                  Stay informed with the latest happenings. Explore insightful
                  blogs and updates that cover a diverse range of topics to keep
                  you engaged and well-informed.
                </div>
              </div>
            </div>
            <BlogCard isloading={false} Data={blogs?.slice(0, 4)} />
          </div>
        </Fade>
      </div>
    </>
  );
}

export default Home;
