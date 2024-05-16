import React from 'react';
import styles from './Featured.module.css';
import Jobcard from '../Jobcard/Jobcard';
import UserApi from '../../Apis/UserApi';
import Toast from '../Toast/Toast';
import { useDispatch, useSelector } from 'react-redux';
import { bookmarkJob, removebookmarkJob } from '../../../redux/slice/jobSlice';

function Featured({ data, isloading }) {
  const userapi = UserApi();
  const dispatch = useDispatch();
  const isAuthenticated = useSelector(
    (state) => state.loginuser.isAuthenticated
  );
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
      console.error('Error in My JOb', error);
      Toast.error('ERROR: Please Try Later');
    }
  };

  const pleaseLogin = () => {
    Toast.error('Login Required To Save Jobs ');
  };

  return (
    <div>
      <div className={styles.heading}>
        <h2>Featured Jobs</h2>
        <p className="px-3">
          Know your worth and find the job that qualify your life
        </p>
      </div>

      {data && data?.length === 0 ? (
        <h4 className={styles.NotFound}>Jobs Not Found!</h4>
      ) : (
        <Jobcard
          handleClick={(e) =>
            isAuthenticated ? deleteBookmark(e) : pleaseLogin(e)
          }
          handleAddBookmark={(e) =>
            isAuthenticated ? addBookmark(e) : pleaseLogin(e)
          }
          isloading={isloading}
          ishowpagination
          data={data}
        />
      )}
    </div>
  );
}

export default Featured;
