import React from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import Goback from '../../../component/GoBackicon/goback';
import { ResumeInput } from '../../../component/Input/TextInput';
import Table from '../../../component/Table/Table';
import Toast from '../../../component/Toast/Toast';
import { useState } from 'react';
import { useEffect } from 'react';
import EmployerAPIS from '../../../Apis/EmployerApi';
import CustomSpinner from '../../../component/Spinner/Spinner';
import { DynamicTitle } from '../../../Helpers/DynamicTitle';
function OneJobCandidates(jobDetail) {
  const navigate = useNavigate();
  const employerapi = EmployerAPIS();
  const { jobId, jobTitle } = useParams();
  const [searchapplication, setsearchapplication] = useState('');
  const [filteredApplicants, setFilteredApplicants] = useState([]);
  const [isloading, setIsloading] = useState(false);
  const Applicantcolums = [
    'Profile',
    'Applicant',
    'Phone',
    'Email',
    'Experience',
    'Download Cv',
    'Status',
  ];
  const actionsoptins = [
    { label: 'Shortlist', value: 'Shortlist' },
    { label: 'Reject', value: 'Reject' },
    { label: 'Pending', value: 'Pending' },
  ];
  const fetchData = async () => {
    setIsloading(true);
    try {
      const applicationResponse =
        await employerapi.getJobBaseApplicant(jobTitle);
      const ApplicationsWithId =
        applicationResponse &&
        applicationResponse?.map((job, index) => ({
          ...job.seeker,
          id: job.id,
          title: job.job_title,
          job_id: job.job_id,
        }));
      setFilteredApplicants(ApplicationsWithId);
      setIsloading(false);
    } catch (error) {
      setIsloading(false);
      console.error('Error in Jobs Fetching', error);
    }
  };
  const handleScreenChnage = () => {
    navigate('/employer/jobs');
  };

  const handleCandidateClick = (candidate) => {
    navigate(`/employer/candidateProfile/${candidate.seeker_name}`, {
      state: { data: candidate },
    });
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
        fetchData();
        setIsloading(false);
      } else {
        setIsloading(false);
        Toast.error('Try again Please');
      }
    } catch (error) {
      setIsloading(false);
      Toast.error('Applicant Status Not Update Please Try Later!');
      console.error('Error', error);
    }
  };

  const handleProfileDelete = async (e) => {
    setIsloading(true);
    const { id } = e;
    try {
      const response = await employerapi.deleteApplicant(id);
      Toast.success('Application Delete Successfully!');
      setIsloading(false);
      fetchData();
    } catch (error) {
      setIsloading(false);
      Toast.error('Application Not Delete\n Please Try Later!');
      console.error('Error In Job Deleting', error);
    }
  };

  const handleSearchApplications = (e) => {
    if (e.target.value) {
      setsearchapplication(e.target.value);
    } else {
      fetchData();
      setsearchapplication('');
    }
  };

  useEffect(() => {
    const filteredApp = filteredApplicants?.filter((seeker) => {
      const seekerName = seeker?.seeker_name?.toLowerCase();
      const status = seeker?.status?.toLowerCase();
      const query = searchapplication?.toLowerCase();
      return seekerName?.includes(query) || status?.includes(query);
    });
    setFilteredApplicants(filteredApp);
  }, [searchapplication, jobTitle]);

  useEffect(() => {
    fetchData();
  }, [jobId, jobTitle]);

  useEffect(() => {
    DynamicTitle('OneJobCandidates-PandaPlacement');
  }, []);

  return (
    <>
      <div
        style={{
          marginLeft: 20,
          backgroundColor: 'white',
          marginRight: '2rem',
          padding: '2rem 0rem 1.5rem 1.5rem',
          borderRadius: '10px',
          height: '100vh',
        }}
      >
        <div className="flex items-center mb-3">
          <Goback onClick={handleScreenChnage} />
          <h4 className="ms-2 mt-2">
            {jobTitle ? jobTitle : 'Job Title Not Found'}
          </h4>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', marginRight: 30 }}>
          <ResumeInput
            value={searchapplication}
            onChange={handleSearchApplications}
            type="text"
            placeholder="Search Applicant, Status, Experience"
          />
        </div>
        {isloading ? (
          <div
            style={{
              display: 'flex',
              justifyContent: 'center',
              marginTop: '5rem',
            }}
          >
            <CustomSpinner />
          </div>
        ) : filteredApplicants?.length > 0 ? (
          <div style={{ paddingRight: '2rem' }}>
            <Table
              isjobs
              data={filteredApplicants}
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
            />
          </div>
        ) : (
          <h1
            style={{ textAlign: 'center', marginTop: '2rem' }}
          >{`Application Not Found!`}</h1>
        )}
      </div>
    </>
  );
}

export default OneJobCandidates;
