import * as React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { setBlogData } from '../../../redux/slice/blogpagesSlice';
import styles from './BlogCard.module.css';
import { formatDate } from '../../Helpers/FormatDate';
import CustomSpinner from '../Spinner/Spinner';

const BlogCard = ({ Data, isloading }) => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const isAuthenticated = useSelector(
    (state) => state.loginuser.isAuthenticated
  );

  const navigateToBlog = (item) => {
    if (isAuthenticated) {
      navigate(`/blogs/${item.slug}`);
      dispatch(setBlogData(item));
    } else {
      navigate(`/blogs/${item.slug}`);
      dispatch(setBlogData(item));
    }
  };

  // const stringtojson = (stringg) => {
  //   const response = JSON?.parse(stringg);
  //   return response;
  // };

  return (
    <>
      {isloading ? (
        <div className={styles.loader}>
          <CustomSpinner />
        </div>
      ) : Data?.length === 0 ? (
        <div className={styles.loader}>
          <h1>Blogs Not Found</h1>
        </div>
      ) : (
        <main className={styles.mainWrappers}>
          {Data &&
            Data?.map((item) => (
              <div
                className={styles.cardWrapper}
                key={item.id}
                style={{ position: 'relative' }}
              >
                <div className={styles.cardImage}>
                  <img className={styles.Image} src={item?.image} alt="" />
                  <div className={styles.overlay}></div>
                </div>
                <div className={styles.cardContent}>
                  <div className={styles.innerContent}>
                    <a
                      onClick={() => {
                        navigateToBlog(item);
                      }}
                      className={styles.cardTitle}
                    >
                      {item?.title}
                    </a>
                    <hr className={styles.hrline} />
                  </div>
                  <p className={styles.cardDate}>
                    {formatDate(item?.created_time)}
                  </p>
                  {/* <div className={styles.RightDesc}>
                <JobDescriptionComponent
                  isblog={true}
                  description={stringtojson(item?.description).desc.slice(
                    0,
                    50
                  )}
                />
              </div> */}
                </div>
              </div>
            ))}
        </main>
      )}
    </>
  );
};

export default BlogCard;
