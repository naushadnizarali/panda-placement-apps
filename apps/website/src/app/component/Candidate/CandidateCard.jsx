import React, { useEffect, useState } from 'react';
import { downloadExcel } from 'react-export-table-to-excel';
import { useNavigate } from 'react-router-dom';
import EmployerAPIS from '../../Apis/EmployerApi';
import Toast from '../../component/Toast/Toast';
import CustomButton from '../Button/CustomButton';
import { ResumeSelect } from '../Input/TextInput';
import CustomSpinner from '../Spinner/Spinner';
import Table from '../Table/Table';
import styles from './CandidateCard.module.css';
import { FaFileDownload } from 'react-icons/fa';
import { LOCAL_URL_EMPLOYER } from '../../pages/Jsondata/URL';
import FilterAltIcon from '@mui/icons-material/FilterAlt';
import OffCanvasExample from '../FilterSidebar/FilterSidebar';

const CandidateCard = () => {
  const navigate = useNavigate();
  const employerapi = EmployerAPIS();
  const [isFileLoading, setisFileLoading] = useState(false);
  const [isBulkLoading, setisBulkLoading] = useState(false);
  const [isFilter, setRemoveFilter] = useState(false);
  const [shortlistedApplications, setShortlistedApplications] = useState([]);
  const [pendingApplications, setPendingApplications] = useState([]);
  const [rejectedApplications, setRejectedApplications] = useState([]);
  const [filteredApplications, setFilteredApplications] = useState([]);
  const [selectedTab, setSelectedTab] = useState('total');
  const [selectedJob, setSelectedJob] = useState('');
  const [Applications, setApplications] = useState([]);
  const [initialShortlistedCount, setInitialShortlistedCount] = useState(0);
  const [userjobs, setUserjobs] = useState([]);
  const [isloading, setIsloading] = useState(false);
  // NOTE: Changing the Data Structure For Table Content
  const [AllSeekers, setAllSeekers] = useState([]);
  const [initialPendingCount, setInitialPendingCount] = useState(0);
  const [initialRejectedCount, setInitialRejectedCount] = useState(0);
  const [selectedData, setSelectedData] = useState(null);

  const actionsoptins = [
    { label: 'Shortlist', value: 'Shortlist' },
    { label: 'Reject', value: 'Reject' },
    { label: 'Pending', value: 'Pending' },
  ];
  const Applicantcolums = [
    'Profile',
    'Applicant',
    'Phone',
    'Email',
    'Experience',
    'Download Cv',
    'Status',
  ];

  const openDelete = async (application) => {
    try {
      const response = await employerapi.deleteApplicant(application?.id);
      Toast.success('Applicant Delete!');
      fetchData();
    } catch (error) {
      Toast.error('Application Not Deleted!\n Please Try Later');
      console.error('ERROR:Application Not Delete', error);
    }
  };

  const handleCandidateClick = (candidate) => {
    navigate(`/employer/candidateProfile/${candidate?.seeker_name}`, {
      state: { data: candidate },
    });
  };

  const RemoveFilter = () => {
    setFilteredApplications(AllSeekers);
    setShortlistedApplications([...Array(initialShortlistedCount)]);
    setRejectedApplications([...Array(initialRejectedCount)]);
    setPendingApplications([...Array(initialPendingCount)]);
    setSelectedJob('');
  };

  const updateApplication = async (newStatus, item) => {
    setIsloading(true);
    try {
      if (item) {
        const response = await employerapi.UpdateApplicantStatus(
          item,
          newStatus,
        );
        Toast.success('Applicant Status Updated!');
        setIsloading(false);
        fetchData();
      } else {
        setIsloading(false);
        Toast.error('Try again Please');
      }
    } catch (error) {
      Toast.error('Applicant Status Not Update Please Try Later!');
      setIsloading(false);
      console.error('Error in Get Applicant Candidate', error);
    }
  };

  const userProfileView = (e) => {
    const userdata = e?.seeker;
    navigate(`/employer/candidateProfile/${e?.seeker?.seeker_name}`, {
      state: { data: userdata },
    });
  };

  const handleSelectionChange = async (selectedIds) => {
    if (selectedIds) {
      setSelectedData(selectedIds);
    } else {
      setSelectedData();
    }
  };

  const handleProfileDelete = async (e) => {
    setIsloading(true);
    const { id } = e;
    try {
      const response = await employerapi.employerJobDelete(id);
      Toast.success('Application Delete Successfully!');
      fetchData();
      setIsloading(false);
    } catch (error) {
      setIsloading(false);
      Toast.error('Application Not Delete \n Please Try Later!');
      console.error('Error In Job Deleting', error);
    }
  };

  const fetchData = async () => {
    setIsloading(true);
    try {
      const applicationResponse = await employerapi?.Getapplication();
      setApplications(applicationResponse);
      const seekerData =
        applicationResponse &&
        applicationResponse.map((job, index) => ({
          ...job.seeker,
          id: job.id,
          prescreen: job.pre_screening,
          title: job.job_title,
          job_id: job.job_id,
          seeker_resume: job.seeker_cv,
        }));
      setAllSeekers(seekerData);
      setFilteredApplications(seekerData);
      // Set initial counts based on the fetched data
      const initialPending = applicationResponse.filter(
        (app) => app.status === 'Pending',
      ).length;
      const initialShortlisted = applicationResponse.filter(
        (app) => app.status === 'Shortlist',
      ).length;
      const initialRejected = applicationResponse.filter(
        (app) => app.status === 'Reject',
      ).length;
      setInitialPendingCount(initialPending);
      setInitialShortlistedCount(initialShortlisted);
      setInitialRejectedCount(initialRejected);

      const transformedApplications = [];
      const addedTitles = [];

      applicationResponse.forEach((item) => {
        const jobTitle = item?.job_title;
        if (!addedTitles?.includes(jobTitle)) {
          transformedApplications?.push({
            label: jobTitle,
            value: jobTitle,
          });
          addedTitles.push(jobTitle);
        }
      });
      //NOTE: Posted Jobs Title And Set in the Select:
      setUserjobs(transformedApplications);
      setPendingApplications(
        applicationResponse?.filter((app) => app?.status === 'Pending'),
      );
      setShortlistedApplications(
        applicationResponse?.filter((app) => app?.status === 'Shortlist'),
      );
      setRejectedApplications(
        applicationResponse?.filter((app) => app?.status === 'Reject'),
      );
      // setFilteredApplications(applicationResponse);
      setIsloading(false);
    } catch (error) {
      setIsloading(false);
      console.error('ERROR:Getting in Jobs', error);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  //Download Data in Excel
  function handleDownloadExcel() {
    setisFileLoading(true);
    downloadExcel({
      fileName: 'All Users',
      sheet: 'All Users Data',
      tablePayload: {
        header: Applicantcolums,
        // accept two different data structures
        body: Applications || Applications,
      },
    });
    setisFileLoading(false);
  }

  // Function to handle bulk download
  const handleDownloads = async () => {
    if (selectedData?.length > 1) {
      const link = document.createElement('a');
      link.href = `${LOCAL_URL_EMPLOYER}/downloadresumes?ids=${selectedData}`;
      link.click();
    } else {
      Toast.error('Select Multiple Candidates');
    }
  };
  //

  const globalfilter = (conditionfield, filtertext) => {
    if (conditionfield === 'title') {
      const Filtered = AllSeekers?.filter(
        (app) => app?.[conditionfield] === filtertext,
      );
      setFilteredApplications(Filtered);
      setPendingApplications(
        Filtered?.filter((app) => app?.status === 'Pending'),
      );
      setShortlistedApplications(
        Filtered?.filter((app) => app?.status === 'Shortlist'),
      );
      setRejectedApplications(
        Filtered?.filter((app) => app?.status === 'Reject'),
      );
    } else if (selectedJob) {
      var Filtered = null;
      if (selectedJob) {
        Filtered = AllSeekers?.filter((app) => app?.title === selectedJob);
        setFilteredApplications(Filtered);
      }
      const Filtered1 = Filtered?.filter(
        (app) => app?.[conditionfield] === filtertext,
      );
      setFilteredApplications(Filtered1);
    } else {
      const Filtered = AllSeekers?.filter(
        (app) => app?.[conditionfield] === filtertext,
      );
      setFilteredApplications(Filtered);
    }
  };

  return (
    <>
      <OffCanvasExample
        icons={
          <>
            <span style={{ marginLeft: '2rem' }}>Filter</span> <FilterAltIcon />{' '}
          </>
        }
        className="float-endnpm sa"
      >
        <div className={styles?.bar}>
          <div className={styles.leftside}>
            <p>Select Job Title</p>
            <ResumeSelect
              // isStatus
              title="Select Job"
              options={userjobs}
              value={selectedJob}
              name="setselectedJob"
              onChange={(event) => {
                globalfilter('title', event.target.value);
                setSelectedJob(event.target.value);
              }}
              required
            />
          </div>
          <div>
            <ul className={styles.bar_right}>
              <li
                style={{ color: 'var(--gray)' }}
                className={`${styles.total} ${
                  selectedTab === 'total' ? styles.totalCandidates : ''
                }`}
                onClick={() => {
                  setFilteredApplications(AllSeekers);
                  setSelectedTab('total');
                  setSelectedJob('');
                }}
              >
                Total Candidates:
                <span>{Applications?.length}</span>
              </li>
              <li
                style={{ color: 'var(--green)', fontSize: '18px' }}
                className={`${styles.approved} ${
                  selectedTab === 'Shortlist' ? styles.shortlist : ''
                }`}
                onClick={() => {
                  globalfilter('status', 'Shortlist');
                }}
              >
                Shortlist:
                <span>{shortlistedApplications?.length}</span>
              </li>
              <li
                style={{ color: 'orange', fontSize: '18px' }}
                className={`${styles.pending} ${
                  selectedTab === 'Pending' ? styles.pendings : ''
                }`}
                onClick={() => {
                  globalfilter('status', 'Pending');
                }}
              >
                Pending:
                <span>{pendingApplications?.length}</span>
              </li>
              <li
                style={{ color: 'var(--red-color)', fontSize: '18px' }}
                className={`${styles.reject} ${
                  selectedTab === 'Reject' ? styles.rejected : ''
                }`}
                onClick={() => {
                  globalfilter('status', 'Reject');
                }}
              >
                Rejected:
                <span>{rejectedApplications?.length}</span>
              </li>
            </ul>
          </div>
          <div
            className={styles.downloadButtons}
            style={{
              marginTop: '10px',
            }}
          >
            {isFilter ? (
              <CustomSpinner />
            ) : (
              <CustomButton
                onClick={RemoveFilter}
                label="Remove Filters"
                backgroundcolor="var(--green)"
              />
            )}

            {isBulkLoading ? (
              <CustomSpinner />
            ) : (
              <CustomButton
                onClick={handleDownloads}
                label="Bulk Download"
                backgroundcolor="var(--green)"
              />
            )}

            {isFileLoading ? (
              <CustomSpinner />
            ) : (
              <CustomButton
                onClick={handleDownloadExcel}
                // style={{marginTop:"10px"}}
                label="Export Data"
                backgroundcolor="var(--green)"
              />
            )}
          </div>
        </div>
      </OffCanvasExample>

      <div className={styles?.warappers}>
        <div style={{ padding: '0rem 1rem' }}>
          {isloading ? (
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                height: '50vh',
              }}
            >
              <CustomSpinner />
            </div>
          ) : filteredApplications.length > 0 ? (
            <>
              <Table
                isjobs
                data={filteredApplications}
                columns={Applicantcolums}
                onRowClick={(item) => handleCandidateClick(item)}
                onStatusChange={(newStatus, item) =>
                  updateApplication(newStatus, item?.id)
                }
                actionsoptins={actionsoptins}
                openDelete={(e) => {
                  handleProfileDelete(e);
                }}
                openView={(e) => {
                  handleCandidateClick(e);
                }}
                openEdit={() => {
                  Toast.error('You are Not Able To \n Edit the Application!');
                }}
                onSelectionChange={handleSelectionChange}
              />
            </>
          ) : (
            <h1 style={{ textAlign: 'center', height: '50vh' }}>
              Applications Not Found
            </h1>
          )}
        </div>
      </div>
    </>
  );
};

export default CandidateCard;
