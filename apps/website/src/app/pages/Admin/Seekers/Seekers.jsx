import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useEffect } from 'react';
import { useState } from 'react';
import AdminTable from '../../../component/Table/AdminTable';
import AdminApi from '../../../Apis/AdminApi';
import Toast from '../../../component/Toast/Toast';
import { ResumeInput } from '../../../component/Input/TextInput';
import styles from './Seekers.module.css';

function Seekers() {
  const adminapi = AdminApi();
  const navigate = useNavigate();
  const [searchPhone, setsearchPhone] = useState('');
  const [searchEmail, setsearchEmail] = useState('');
  const [allSeekers, setallSeekers] = useState([]);
  const [filterSeekers, setfilterSeekers] = useState([]);
  const [isloading, setIsloading] = useState(true);

  const tableColoum = [
    'S.NO',
    'FirstName',
    'LastName',
    'Email',
    'Phone',
    'Status',
  ];

  const actionsoptins = [
    { label: 'Approved', value: 'Approved' },
    { label: 'Reject', value: 'Reject' },
    { label: 'Pending', value: 'Pending' },
    { label: 'Expire', value: 'Expire ' },
  ];

  const handlePhoneSearch = (e) => {
    setsearchPhone(e.target.value);
  };

  const handleEmailSearch = (e) => {
    setsearchEmail(e.target.value);
  };

  const getAllSeekersData = async () => {
    setIsloading(true);
    try {
      const response = await adminapi?.getAllSeekers();
      setallSeekers(response);
      setIsloading(false);
    } catch (error) {
      setIsloading(false);
      console.error('ERROR: Getting Jobs', error);
    }
  };

  const updateallSeekerstatus = async (newStatus, item) => {
    setIsloading(true);
    try {
      if (item) {
        const response = await adminapi?.PendingJobsStatus(item, newStatus);
        Toast.success(`Job ${newStatus}`);
        getAllSeekersData();
        setIsloading(false);
      } else {
        setIsloading(false);
        Toast.error('Try Again Please');
      }
    } catch (error) {
      setIsloading(false);
      Toast.error('Job Status Not Update Please Try Later!');
      console.error('ERROR:Job Status Not Update', error);
    }
  };

  useEffect(() => {
    const filterJobs = allSeekers?.filter((job) => {
      const email = job?.email?.toLowerCase();
      const phone = job?.phone?.toLowerCase();

      // Search by email only
      if (searchEmail && !searchPhone) {
        return email?.includes(searchEmail.toLowerCase());
      }

      // Search by phone only
      if (searchPhone && !searchEmail) {
        return phone?.includes(searchPhone.toLowerCase());
      }

      // Search by email, phone, and job title
      const phoneQuery = searchPhone.toLowerCase();
      const emailQuery = searchEmail.toLowerCase();

      return email?.includes(emailQuery) && phone?.includes(phoneQuery);
    });

    setfilterSeekers(filterJobs);
  }, [searchEmail, searchPhone, allSeekers]);

  const handleCandidateClick = (e) => {
    navigate(`/manager/${e.id}/${e.title}/view`);
  };
  const handleJobEdit = (e) => {
    navigate(`/manager/${e.id}/${e.title}/edit`);
  };

  const handleJobDelete = async (e) => {
    setIsloading(true);
    try {
      const response = await adminapi.deleteOneJob(e?.id);
      Toast.success('Job Deleted!');
      setIsloading(false);
      getAllSeekersData();
    } catch (error) {
      Toast.error('Job Not delete \n Please Try Later');
      console.error('ERROR:Job Not Delete', error);
      setIsloading(false);
    }
  };
  useEffect(() => {
    getAllSeekersData();
  }, []);

  return (
    <div className={styles.contentWrapper}>
      <h3>Manage All Seekers</h3>
      <div className={styles.filterwrapper}>
        <ResumeInput
          borderradius={5}
          marginTop={5}
          marginRight={5}
          value={searchEmail}
          onChange={handleEmailSearch}
          type="text"
          placeholder="Search Seeker Email"
        />
        <ResumeInput
          borderradius={5}
          marginTop={5}
          marginRight={5}
          value={searchPhone}
          onChange={handlePhoneSearch}
          type="text"
          placeholder="Search Seeker Phone"
        />
      </div>
      <div className={styles.tableWrapper}>
        <p
          style={{ lineHeight: '0%' }}
        >{`${filterSeekers?.length} total result Found!`}</p>
        {filterSeekers && filterSeekers ? (
          <AdminTable
            loading={isloading}
            isseeker
            data={filterSeekers}
            columns={tableColoum}
            // onRowClick={(item) => handleCandidateClick(item)}
            onStatusChange={(newStatus, item) =>
              updateallSeekerstatus(newStatus, item?.id)
            }
            option={actionsoptins}
            onDelete={(e) => {
              handleJobDelete(e);
            }}
            onView={(e) => {
              handleCandidateClick(e);
            }}
            onEdit={(e) => {
              handleJobEdit(e);
            }}
          />
        ) : (
          ''
        )}
      </div>
    </div>
  );
}

export default Seekers;
