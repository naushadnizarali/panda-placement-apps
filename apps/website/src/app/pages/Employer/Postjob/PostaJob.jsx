import React, { useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { DynamicTitle } from '../../../Helpers/DynamicTitle';
import EmployerForm from '../../../component/EmpolyerJob/EmployerForm';
import EmployerNavbar from '../../../component/EmployerNavbar/EmployerNavbar';
import styles from './PostaJob.module.css';
function PostAjob() {
  const location = useLocation();
  const data = location?.state?.data;

  useEffect(() => {
    DynamicTitle('Post New Job-PandaPlacement');
  }, []);

  return (
    <>
      <div className={styles.PostAjobWrapper} style={{ margin: '0px 20px' }}>
        <EmployerForm jobeditdata={data} />
      </div>
    </>
  );
}

export default PostAjob;





