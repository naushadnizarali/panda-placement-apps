import React from 'react';
import AdminTable from '../../../component/Table/AdminTable';
import AdminApi from '../../../Apis/AdminApi';
import { useState } from 'react';
import Toast from '../../../component/Toast/Toast';
import { useEffect } from 'react';
import { ResumeInput } from '../../../component/Input/TextInput';
import styles from './Alljobs.module.css';
import { useNavigate } from 'react-router-dom';

function Alljobs() {
  const adminapi = AdminApi();
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState('');
  const [searchCity, setSearchCity] = useState('');
  const [searchJobTitle, setSearchJobTitle] = useState('');

  const [alljobs, setalljobs] = useState([]);
  const [filterJobs, setfilterJobs] = useState([]);
  const [isloading, setIsloading] = useState(true);
  const tableColoum = ['S.NO', 'Job Title', 'Employer', 'City', 'Status'];
  const actionsoptins = [
    { label: 'Approved', value: 'Approved' },
    { label: 'Reject', value: 'Reject' },
    { label: 'Pending', value: 'Pending' },
    { label: 'Expire', value: 'Expire ' },
  ];

  const handleSearch = (e) => {
    setSearchQuery(e.target.value);
  };
  const handleCitySearch = (e) => {
    setSearchCity(e.target.value);
  };
  const handleJobTitleSearch = (e) => {
    setSearchJobTitle(e.target.value);
  };

  const getAdminalljobs = async () => {
    setIsloading(true);
    try {
      const response = await adminapi?.getAllJobs();
      setalljobs(response);
      setIsloading(false);
    } catch (error) {
      setIsloading(false);
      console.error('ERROR: Getting Jobs', error);
    }
  };

  const updatealljobstatus = async (newStatus, item) => {
    setIsloading(true);
    try {
      if (item) {
        const response = await adminapi?.PendingJobsStatus(item, newStatus);
        Toast.success(`Job ${newStatus}`);
        getAdminalljobs();
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
    const filterJobs = alljobs?.filter((job) => {
      const jobTitle = job?.title?.toLowerCase();
      const email = job?.employer?.email?.toLowerCase();
      const jobCity = job?.hiring_city?.toLowerCase();
      const jobStatus = job?.status?.toLowerCase();

      // Search by email only
      if (searchQuery && !searchCity && !searchJobTitle) {
        return email?.includes(searchQuery.toLowerCase());
      }

      // Search by city only
      if (!searchQuery && searchCity && !searchJobTitle) {
        return jobCity?.includes(searchCity.toLowerCase());
      }

      // Search by job title only
      if (!searchQuery && !searchCity && searchJobTitle) {
        return jobTitle?.includes(searchJobTitle.toLowerCase());
      }

      // Search by job title and city
      if (searchQuery && !searchCity && searchJobTitle) {
        return (
          jobTitle?.includes(searchJobTitle.toLowerCase()) &&
          email?.includes(searchQuery.toLowerCase())
        );
      }

      // Search by job title and city
      if (!searchQuery && searchCity && searchJobTitle) {
        return (
          jobTitle?.includes(searchJobTitle.toLowerCase()) &&
          jobCity?.includes(searchCity.toLowerCase())
        );
      }

      // Search by email, city, and job title
      const query = searchQuery.toLowerCase();
      const city = searchCity.toLowerCase();
      const jobTitleQuery = searchJobTitle.toLowerCase();

      return (
        jobTitle?.includes(jobTitleQuery) &&
        email?.includes(query) &&
        jobStatus?.includes(query) &&
        jobCity?.includes(city)
      );
    });
    setfilterJobs(filterJobs);
  }, [searchJobTitle, searchQuery, searchCity, alljobs]);

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
      getAdminalljobs();
    } catch (error) {
      Toast.error('Job Not delete \n Please Try Later');
      console.error('ERROR:Job Not Delete', error);
      setIsloading(false);
    }
  };
  useEffect(() => {
    getAdminalljobs();
  }, []);

  return (
    <div className={styles.contentWrapper}>
      <h3>Manage All Jobs</h3>
      <div className={styles.filterwrapper}>
        <ResumeInput
          borderradius={5}
          marginTop={5}
          marginRight={5}
          value={searchJobTitle}
          onChange={handleJobTitleSearch}
          type="text"
          placeholder="Search Job Title"
        />
        <ResumeInput
          borderradius={5}
          marginTop={5}
          marginRight={5}
          value={searchQuery}
          onChange={handleSearch}
          type="text"
          placeholder="Search Employer Email"
        />
        <ResumeInput
          borderradius={5}
          marginTop={5}
          marginRight={5}
          value={searchCity}
          onChange={handleCitySearch}
          type="text"
          placeholder="Search With City"
        />
        {/* <ResumeInput
          value={searchQuery}
          onChange={handleSearch}
          type="text"
          placeholder="Search Applicant, Status, Experience"
        /> */}
      </div>
      <div className={styles.tableWrapper}>
        <p
          style={{ lineHeight: '0%' }}
        >{`${filterJobs?.length} total result Found!`}</p>
        {filterJobs ? (
          <AdminTable
            loading={isloading}
            isjobs
            isPendingJob
            data={filterJobs}
            columns={tableColoum}
            // onRowClick={(item) => handleCandidateClick(item)}
            onStatusChange={(newStatus, item) =>
              updatealljobstatus(newStatus, item?.id)
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

export default Alljobs;
