import * as React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { setBlogData } from '../../../redux/slice/blogpagesSlice';
import styles from './BlogHeaderCard.module.css';
import { formatDate } from '../../Helpers/FormatDate';
import CustomSpinner from '../Spinner/Spinner';

const BlogHeaderCard = ({ Data, isloading }) => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const isAuthenticated = useSelector(
    (state) => state.loginuser.isAuthenticated
  );

  const navigateToBlog = (e) => {
    if (isAuthenticated) {
      navigate(`/blogs/${e.slug}`);
      dispatch(setBlogData(e));
    } else {
      navigate(`/blogs/${e.slug}`);
      dispatch(setBlogData(e));
    }
  };

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
        <div className={styles.BlogHeader}>
          {Data &&
            Data?.slice(0, 2)?.map((e) => (
              <div
                className={styles.Card}
                key={e.id}
                style={{ position: 'relative' }}
              >
                <img src={e.image} alt="" />
                <div className={styles.overlay}></div>
                <p className={styles.dates}>{formatDate(e?.created_time)}</p>
                <p
                  className={styles.Paragraph}
                  onClick={() => navigateToBlog(e)}
                >
                  {e.title}
                </p>
              </div>
            ))}
        </div>
      )}
    </>
  );
};
export default BlogHeaderCard;
