import React, { useEffect, useState } from 'react';
import BlogCard from '../../../component/Blogcard/BlogCard';
import styles from './Blogpage.module.css';
import BlogHeaderCard from '../../../component/blogheadercard/BlogHeaderCard';
import UserApi from '../../../Apis/UserApi';
import { useDispatch, useSelector } from 'react-redux';
import { setAllBlogData } from '../../../../redux/slice/allBlogDataSlice';

const BlogPage = () => {
  const AllData = useSelector((state) => state.allblogdata.allData);
  const userapi = UserApi();
  const dispatch = useDispatch();
  const [isloading, setIsloading] = useState(false);

  const getAllblogPosts = async () => {
    setIsloading(true);
    try {
      const response = await userapi.blogs();
      // setApiData(response);
      setIsloading(false);
      dispatch(setAllBlogData(response));
    } catch (error) {
      setIsloading(false);
      console.error(error);
    }
  };

  useEffect(() => {
    getAllblogPosts();
  }, []);

  return (
    <div className={styles.BlogPageBody}>
      <h1 className={styles.heading}>Blogs</h1>
      <p className={styles.para}>Stay Up-To-Date With Our Latest Blog Posts</p>
      <div>
        <BlogHeaderCard isloading={isloading} Data={AllData} />
      </div>
      <div>
        <p className={styles.posts}>Recent Posts</p>
        <BlogCard isloading={isloading} Data={AllData} />
      </div>
    </div>
  );
};

export default BlogPage;
