import React from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import JobDetail from '../../../component/JobDetails/JobDetail';
import UserApi from '../../../Apis/UserApi';
import Toast from '../../../component/Toast/Toast';
import { useDispatch } from 'react-redux';
import { bookmarkJob } from '../../../../redux/slice/jobSlice';

function ApplyJob() {
  const dispath = useDispatch();
  const navigate = useNavigate();
  const userapi = UserApi();
  const location = useLocation();
  const data = location?.state?.data;
  const handleApplyClick = async (job) => {
    // Add your logic to handle the application here
    const newdata = {
      job: data?.id,
      prescreen: data?.question,
    };
    try {
      const response = await userapi.userjobApply(newdata);
      Toast.success('Your Application Submitted!');
      dispath(bookmarkJob(newdata));
      navigate('/user/home');
    } catch (error) {
      console.error('Error in Apply Job', error.response.data.Error);
      Toast.error(`${error.response.data.Error}`);
    }
  };

  return (
    <div>
      <h1>Apply for a Job</h1>
      <JobDetail jobData={data} onApplyClick={handleApplyClick} />
    </div>
  );
}

export default ApplyJob;
