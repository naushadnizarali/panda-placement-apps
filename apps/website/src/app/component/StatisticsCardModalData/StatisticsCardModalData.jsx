import React, { useEffect, useState } from 'react';
import { downloadExcel } from 'react-export-table-to-excel';
import { useNavigate } from 'react-router-dom';
import EmployerAPIS from '../../Apis/EmployerApi';
import { DynamicTitle } from '../../Helpers/DynamicTitle';
import CustomButton from '../Button/CustomButton';
import { ResumeInput, ResumeSelect } from '../Input/TextInput';
import CustomSpinner from '../Spinner/Spinner';
import Table from '../Table/Table';
import Toast from '../Toast/Toast';
import styles from './StatisticsCardModalData.module.css';

function StatisticsCardModalData({ title2, Status }) {
  const navigate = useNavigate();
  const [isloading, setisloading] = useState(false);
  const [fileLoading, setFileLoading] = useState(false);
  const [specificlist, setspecificlist] = useState(false);
  const [singledata, setsingledata] = useState([]);
  const employerapi = EmployerAPIS();
  const [jobsdata, setjobsdata] = useState([]);
  const [selectedJobbs, setSelectedJobbs] = useState([]);
  const [Applications, setApplications] = useState([]);
  const [jobIds, setJobIds] = useState([]);
  const [title, setTitle] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [searchapplication, setsearchapplication] = useState('');
  const [filteredJobs, setFilteredJobs] = useState(null);
  const [filteredApplicants, setFilteredApplicants] = useState(null);
  const [selectedOption, setSelectedOption] = useState(null);
  const [showDialog, setShowDialog] = useState(false);
  const [jobIdToDelete, setJobIdToDelete] = useState(null);
  const columns = ['Job Title', 'Status', 'Application', 'Create time'];
  const option = [
    { label: 'Open', value: 'Open' },
    { label: 'Close', value: 'Close' },
  ];
  const options = [
    { label: 'A-Z', value: 'A_Z' },
    { label: 'Z-A', value: 'Z_A' },
    { label: 'Application Numbers', value: 'AppNumbers' },
  ];
  // Jobs search
  const handleSearch = (e) => {
    setSearchQuery(e.target.value);
  };
  const fetchData = async () => {
    setisloading(true);
    try {
      const allJobsResponse = await employerapi.AllJObs();
      setjobsdata(allJobsResponse);
      const applicationResponse = await employerapi.Getapplication();
      setApplications(applicationResponse);
      const applicationCountsMap = new Map();
      for (let index = 0; index < allJobsResponse.length; index++) {
        const element = allJobsResponse[index];
        const matchData = applicationResponse.filter(
          (application) => application.job_id === element.id,
        );
        const applicationCount = matchData.length;
        applicationCountsMap.set(element.id, applicationCount);
      }
      const jobsWithApplicationCounts =
        allJobsResponse &&
        allJobsResponse.map((job) => ({
          ...job,
          applicationCount: applicationCountsMap.get(job.id) || 0,
        }));
      const sortedJobs = jobsWithApplicationCounts.sort(
        (a, b) => new Date(b.created_at) - new Date(a.created_at),
      );
      setjobsdata(sortedJobs);
      setisloading(false);
    } catch (error) {
      setisloading(false);
      console.error('Error in Jobs Fetching', error);
    }
  };

  const updateJobStatus = async (phase, id) => {
    try {
      const response = await employerapi.UpdateJobStatus(phase, id);
      Toast.success('Status Updated!');
      fetchData();
    } catch (error) {
      console.error('Error in Updating Job Status', error);
      Toast.error('Status Not Updated!');
    }
  };

  const getApplicants = (e) => {
    // setspecificlist(true);
    // const selectedApplication = e;
    // setsingledata(selectedApplication);
    // const selectedJob = Applications.filter(
    //   (job) => job?.job_id === selectedApplication?.id
    // );
    // const seekers = selectedJob.map((job) => job.seeker);
    // // setSelectedJobbs(seekers);
    // const ApplicationsWithId = seekers.map((job, index) => ({
    //   ...job,
    //   id: selectedJob[index].id,
    // }));
    // setSelectedJobbs(ApplicationsWithId);
    // fetchData();
    navigate(
      `/employer/job/all_candidates/${e?.id}/${e?.title}`,
      // state: { data: ApplicationsWithId },
    );
  };

  const handleJobView = async (e) => {
    navigate(`/employer/job/${e.slug}`, { state: { data: e } });
  };
  const handleJobEdit = async (e) => {
    navigate(`/employer/job/edit/${e.id}/${e?.slug}`, { state: { data: e } });
  };

  // const handleJobDelete = (e) => {
  //   setShowDialog(true);
  //   const { id } = e;
  //   setJobIdToDelete(id);
  // };

  const handleJobDeleteConfirm = async (e) => {
    const { id } = e;
    setJobIdToDelete(id);
    setisloading(true);
    try {
      const response = await employerapi.employerJobDelete(jobIdToDelete);
      Toast.success('Job Delete Successfully!');
      fetchData();
      setisloading(false);
    } catch (error) {
      setisloading(false);
      Toast.error('Please Try Later!');
      console.error('Error In Job Deleting', error);
    }
  };

  const handleSelectionChange = async (selectedIds) => {
    if (selectedIds) {
      setJobIds(selectedIds);
    } else {
      setJobIds();
    }
  };

  const deleteJobs = async () => {
    const confirmed = window.confirm(
      'Are you sure you want to export the excel?',
    );

    if (!confirmed) {
      return; // If user cancels, do nothing
    }
    setisloading(true);
    try {
      const resposne = await employerapi.deletePostedJobs(jobIds);
      Toast.success('Jobs Deleted');
      fetchData();
      setisloading(false);
      handleSelectionChange();
    } catch (error) {
      Toast.error('Jobs not Deleted');
      console.error('ERROR:', error);
      setisloading(false);
    }
  };

  const handleConfirm = () => {};

  const handleCancel = () => {
    setShowDialog(false);
    return;
  };
  //Download Data in Excel
  function handleDownloadExcel() {
    const confirmed = window.confirm(
      'Are you sure you want to export the excel?',
    );

    if (!confirmed) {
      return; // If user cancels, do nothing
    }
    // setFileLoading(true);
    downloadExcel({
      fileName: 'All jobs Data',
      sheet: 'All jobs Data',
      tablePayload: {
        header: columns,
        // accept two different data structures
        body: filteredJobs || filteredJobs,
      },
    });
    // setTimeout(() => {
    //   setFileLoading(false);
    // }, 1000);
    // setFileLoading(false);
  }

  useEffect(() => {
    fetchData();
    DynamicTitle('Jobs-PandaPlacement');
  }, []);

  useEffect(() => {
    const filteredApp = selectedJobbs.filter((job) => {
      const seekerName = job.seeker_name.toLowerCase();
      const status = job.status.toLowerCase();
      //TODO : const qualification = job?.seeker?.employement?.experience?.toLowerCase();
      // const position = job.possition.toLowerCase();
      const query = searchapplication.toLowerCase();

      return seekerName.includes(query) || status.includes(query);
      // qualification.includes(query);
      // position.includes(query)
    });
    setFilteredApplicants(filteredApp);
  }, [searchapplication, selectedJobbs]);

  useEffect(() => {
    const BaseSearch = selectedOption?.target.value;
    if (BaseSearch) {
      let sortedJobsDataCopy = [...jobsdata];
      if (BaseSearch === 'A_Z') {
        sortedJobsDataCopy?.sort((a, b) => a?.title?.localeCompare(b?.title)); // Sort A-Z
      } else if (BaseSearch === 'Z_A') {
        sortedJobsDataCopy?.sort((a, b) => b?.title?.localeCompare(a?.title)); // Sort Z-A
      } else if (BaseSearch === 'AppNumbers') {
        sortedJobsDataCopy = sortedJobsDataCopy?.sort((a, b) => {
          return b.applicationCount - a.applicationCount;
        });
      }
      setFilteredJobs(sortedJobsDataCopy);
    }
  }, [selectedOption, jobsdata]);

  useEffect(() => {
    const filteredJobs = jobsdata.filter((job) => {
      const jobTitle = job?.title?.toLowerCase();
      const query = searchQuery.toLowerCase();
      return jobTitle.includes(query);
    });
    setFilteredJobs(filteredJobs);
  }, [searchQuery, jobsdata]);

  useEffect(() => {
    const jobFilterWithStatus = jobsdata.filter((item) => {
      return item?.status === Status || item?.phase === Status;
    });
    setFilteredJobs(jobFilterWithStatus);
  }, [jobsdata, Status]);

  return (
    <>
      <div
        style={{
          marginLeft: 20,
          marginRight: '2rem',
        }}
      >
        {/* //JObs Table here */}
        <div className={styles.container}>
          {/* <div>
            <h3>Your {title2}</h3>
          </div> */}
          <div
            style={{
              display: 'flex',
              gap: '5%',
              alignItems: 'center',
              justifyContent: 'space-between',
              marginRight: 0,
              width: '100%',
              '@media (max-width: 768px)': {
                flexWrap: 'wrap',
              },
            }}
          >
            <ResumeInput
              value={searchQuery}
              onChange={handleSearch}
              borderradius={'6px'}
              padding={'15px'}
              placeholder="Search jobs Here...."
              style={{
                marginBottom: '10px',
              }}
            />
            <ResumeSelect
              isStatus
              onChange={(event) => setSelectedOption(event)}
              options={options}
              title="Sort by..."
            />
            {/* <CustomButton
              onClick={handleDownloadExcel}
              label="export in Excel"
              backgroundcolor="green"
            /> */}
            {fileLoading ? (
              <CustomSpinner />
            ) : (
              <CustomButton
                onClick={handleDownloadExcel}
                label="export in Excel"
                backgroundcolor="var(--green)"
              />
            )}
            {jobIds?.length > 1 && (
              <CustomButton
                onClick={deleteJobs}
                label="Delete Bluk"
                backgroundcolor="var(--red-color)"
              />
            )}
          </div>
          {jobIds?.length > 1 && <p>Selected Jobs {jobIds?.length}</p>}
          {isloading ? (
            <div style={{ textAlign: 'center', marginTop: '15rem' }}>
              <CustomSpinner />
            </div>
          ) : filteredJobs?.length > 0 ? (
            <div>
              <Table
                data={filteredJobs}
                columns={columns}
                onRowClick={(item) => getApplicants(item)}
                onStatusChange={(newStatus, item) =>
                  updateJobStatus(newStatus, item.id)
                }
                option={option}
                jobStatus={title}
                onDelete={(e) => {
                  handleJobDeleteConfirm(e);
                }}
                onSelectionChange={handleSelectionChange}
                onView={(e) => {
                  handleJobView(e);
                }}
                onEdit={(e) => {
                  handleJobEdit(e);
                }}
              />
            </div>
          ) : (
            <h1
              style={{ textAlign: 'center', marginTop: '2rem' }}
            >{`"${searchQuery}" Not Found!`}</h1>
          )}
        </div>
      </div>
    </>
  );
}

export default StatisticsCardModalData;
