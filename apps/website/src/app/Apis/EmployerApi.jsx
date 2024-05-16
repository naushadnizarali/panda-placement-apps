import axios from 'axios';
import {
  LOCAL_PDF_EMPLOYER,
  LOCAL_URL_EMPLOYER,
  LOCAL_URL_USER,
} from '../pages/Jsondata/URL';
import { logoutEmployer } from '../../redux/slice/EmployerLoginSlice';
import { useSelector, useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';

const BASE_URL = LOCAL_URL_EMPLOYER;
const LOCALHOST = LOCAL_PDF_EMPLOYER;
const ACCOUNT_ACTIVATE = LOCAL_URL_USER;

const EmployerAPIS = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const token = useSelector((state) => state.employerLogin.token);

  const cheakToken = async () => {
    try {
      const response = await axios.post(`${ACCOUNT_ACTIVATE}token/verify/`, {
        token: token,
      });
    } catch (error) {
      dispatch(logoutEmployer());
      navigate('/employer/login');
    }
  };

  const getEmployerCurrency = async () => {
    try {
      const response = await axios.get(`${ACCOUNT_ACTIVATE}/settings/`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      return response.data;
    } catch (error) {
      return error;
    }
  };

  const GetEmployerProfile = async () => {
    try {
      await cheakToken();
      const response = await axios.get(`${BASE_URL}/profile/`, {
        headers: {
          'Cache-Control': 'no-cache, no-store, must-revalidate',
          Authorization: `Bearer ${token}`,
        },
      });
      return response.data;
    } catch (error) {
      return error;
    }
  };

  const GetEmployerUpdate = async (profileinformation) => {
    try {
      await cheakToken();
      const response = await axios.put(
        `${BASE_URL}/profile/`,
        profileinformation,
        {
          headers: {
            'Cache-Control': 'no-cache, no-store, must-revalidate',
            Authorization: `Bearer ${token}`,
          },
        }
      );
      return response.data;
    } catch (error) {
      return error;
    }
  };

  const EmployerRegistration = async (employerdata) => {
    try {
      const response = await axios.post(
        `${BASE_URL}/create_employer`,
        employerdata
      );
      return response.data;
    } catch (error) {
      return error;
    }
  };
  //Login APi
  const EmployerLogin = async (employerdata) => {
    try {
      const response = await axios.post(`${BASE_URL}/signin`, employerdata);
      return response.data;
    } catch (error) {
      return error;
    }
  };

  const sendRestLink = async (userData) => {
    try {
      const response = await axios.post(
        `${BASE_URL}/password_reset/`,
        userData
      );
      return response.data;
    } catch (error) {
      return error;
    }
  };

  const employerrestSetPasswordConfrim = async (userData, path) => {
    try {
      const response = await axios.post(`${BASE_URL}/${path}`, userData);
      return response.data;
    } catch (error) {
      return error;
    }
  };
  const employerEmailVerification = async (path) => {
    try {
      const response = await axios.get(`${ACCOUNT_ACTIVATE}${path}`);
      return response.data;
    } catch (error) {
      return error;
    }
  };

  const AllJObs = async () => {
    try {
      await cheakToken();
      const response = await axios.get(`${BASE_URL}/jobs/`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      return response.data;
    } catch (error) {
      return error;
    }
  };
  // POST A JOB
  const PostJob = async (data) => {
    try {
      await cheakToken();
      const response = await axios.post(`${BASE_URL}/jobs/`, data, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      return response.data;
    } catch (error) {
      return error;
    }
  };

  const editjobDetails = async (data, jobid) => {
    try {
      await cheakToken();
      const response = await axios.put(`${BASE_URL}/jobs/${jobid}/`, data, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      return response.data;
    } catch (error) {
      return error;
    }
  };

  //GET A JOBs
  const GetJobs = async () => {
    try {
      // await cheakToken();
      const response = await axios.get(`${BASE_URL}/jobs/`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      return response.data;
    } catch (error) {
      return error;
    }
  };

  //GET A JOBs
  const deletePostedJobs = async (jobsID) => {
    try {
      await cheakToken();
      const response = await axios.delete(`${BASE_URL}/jobs/clearSelected/`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
        data: {
          ids: jobsID,
        },
      });
      return response.data;
    } catch (error) {
      return error;
    }
  };

  // DownloadCVs With IDS []
  const DownloadCV = async (applicantIds) => {
    try {
      // await cheakToken();
      const response = await axios.get(
        `${BASE_URL}/downloadresumes?ids=[${applicantIds}]`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      return response.data;
    } catch (error) {
      return error;
    }
  };

  const getOneJob = async (jobid) => {
    try {
      // await cheakToken();
      const response = await axios.get(`${BASE_URL}/jobs/${jobid}/`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      return response.data;
    } catch (error) {
      return error;
    }
  };

  //Delete Job
  const employerJobDelete = async (id) => {
    try {
      await cheakToken();
      const response = await axios.delete(`${BASE_URL}/jobs/${id}/`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      return response.data;
    } catch (error) {
      return error;
    }
  };

  // update job Status
  const UpdateJobStatus = async (id, phase) => {
    try {
      // await cheakToken();

      const response = await axios.put(
        `${BASE_URL}/jobs/${phase}/`,
        {
          phase: id,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      return response.data;
    } catch (error) {
      return error;
    }
  };

  //GET A application http://192.168.0.106:8000/api/employer/application/
  const Getapplication = async () => {
    try {
      await cheakToken();
      const response = await axios.get(`${BASE_URL}/application/`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      return response.data;
    } catch (error) {
      return error;
    }
  };

  // Update Applican Status
  const UpdateApplicantStatus = async (id, status) => {
    try {
      await cheakToken();

      const response = await axios.put(
        `${BASE_URL}/application/${id}/`,
        {
          status: status,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      return response.data;
    } catch (error) {
      return error;
    }
  };

  const getJobBaseApplicant = async (slug) => {
    try {
      // await cheakToken();
      const response = await axios.get(`${BASE_URL}/job_applicants/${slug}/`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      return response.data;
    } catch (error) {
      return error;
    }
  };

  // deleteApplicant
  const deleteApplicant = async (id) => {
    try {
      await cheakToken();

      const response = await axios.delete(`${BASE_URL}/application/${id}/`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      return response.data;
    } catch (error) {
      return error;
    }
  };
  //https://hakimahmadi.pythonanywhere.com/api/employer/todo_list/
  // POST
  const ToDoPost = async (data) => {
    try {
      // await cheakToken();
      const response = await axios.post(`${BASE_URL}/todos/`, data, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      return response.data;
    } catch (error) {
      return error;
    }
  };
  // GET
  const ToDoGet = async () => {
    try {
      const response = await axios.get(`${BASE_URL}/todos/`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      return response.data;
    } catch (error) {
      return error;
    }
  };

  // Edit TODO Status
  const ToDoUpdate = async (id, data) => {
    try {
      const response = await axios.put(`${BASE_URL}/todos/${id}/`, data, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      return response.data;
    } catch (error) {
      return error;
    }
  };
  // Delete Single Todo
  const ToDoDelete = async (id) => {
    try {
      const response = await axios.delete(`${BASE_URL}/todos/${id}/`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      return response.data;
    } catch (error) {
      return error;
    }
  };
  //Delete All Todo
  const AllDelete = async (id) => {
    try {
      // await cheakToken();

      const response = await axios.delete(`${BASE_URL}/todos/clear/`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      return response.data;
    } catch (error) {
      return error;
    }
  };
  // NOTES API
  const notesPost = async (data) => {
    try {
      // await cheakToken();

      const response = await axios.post(`${BASE_URL}/notes/`, data, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      return response.data;
    } catch (error) {
      return error;
    }
  };
  // GET
  const notesGet = async () => {
    try {
      const response = await axios.get(`${BASE_URL}/notes/`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      return response.data;
    } catch (error) {
      return error;
    }
  };

  // Edit notes Status
  const notesUpdate = async (id, data) => {
    try {
      const response = await axios.put(`${BASE_URL}/notes/${id}/`, data, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      return response.data;
    } catch (error) {
      return error;
    }
  };
  // Delete Single notes
  const notesDelete = async (id) => {
    try {
      const response = await axios.delete(`${BASE_URL}/notes/${id}/`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      return response.data;
    } catch (error) {
      return error;
    }
  };
  //Delete All notes
  const AllnotesDelete = async (id) => {
    try {
      const response = await axios.delete(`${BASE_URL}/notes/clear/`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      return response.data;
    } catch (error) {
      return error;
    }
  };

  // Resume View
  const ViewResume = async (seeker_resmue) => {
    try {
      // const response = await axios.get(`${LOCALHOST}${seeker_resmue}`, {
      const response = await axios.get(`${LOCALHOST}${seeker_resmue}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
        responseType: 'arraybuffer',
      });
      return response.data;
    } catch (error) {
      return error;
    }
  };

  //COMPANY iNFO
  const companyInfoGet = async (id, data) => {
    try {
      await cheakToken();
      const response = await axios.get(`${BASE_URL}/company_info/`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      return response.data;
    } catch (error) {
      return error;
    }
  };

  const companyInfo = async (data) => {
    try {
      // await cheakToken();
      const response = await axios.post(`${BASE_URL}/company_info/`, data, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      return response.data;
    } catch (error) {
      return error;
    }
  };

  const companyInfoUpdate = async (id, data) => {
    try {
      // await cheakToken();

      const response = await axios.put(
        `${BASE_URL}/company_info/${id}/`,
        data,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      return response.data;
    } catch (error) {
      return error;
    }
  };

  const ChangePassword = async (data) => {
    try {
      await cheakToken();

      const response = await axios.post(`${BASE_URL}/password_change/`, data, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      return response.data;
    } catch (error) {
      return error;
    }
  };
  const getEmployerNotification = async (data) => {
    try {
      // await cheakToken();
      const response = await axios.get(`${BASE_URL}/notification/`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      return response.data;
    } catch (error) {
      return error;
    }
  };

  const singleViewEmployerNotification = async (id) => {
    try {
      await cheakToken();
      const response = await axios.post(
        `${BASE_URL}/notification/${id}/mark_as_seen/`,
        {},
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      return response.data;
    } catch (error) {
      return error;
    }
  };

  const candidateProfileView = async (id) => {
    try {
      await cheakToken();
      const response = await axios.put(
        `${BASE_URL}/applicationviewed/?id=${id}`,
        {},
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      return response.data;
    } catch (error) {
      return error;
    }
  };
  // const candidateProfileView = async (Id) => {
  //   try {
  //     await cheakToken();
  //     const response = await axios.put(
  //       `${BASE_URL}/applicationviewed/?id=${Id}`,
  //       {
  //         headers: {
  //           Authorization: `Bearer ${token}`,
  //         },
  //       }
  //     );
  //     return response.data;
  //   } catch (error) {
  //     return error
  //   }
  // };

  const employerViewCandidate = async (candidateId) => {
    try {
      const response = await axios.post(
        `${BASE_URL}/applicationviewed/?id=JobID`,
        candidateId,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      return response.data;
    } catch (error) {
      return error;
    }
  };

  return {
    EmployerRegistration,
    EmployerLogin,
    sendRestLink,
    employerrestSetPasswordConfrim,
    employerEmailVerification,
    AllJObs,
    PostJob,
    editjobDetails,
    GetJobs,
    deletePostedJobs,
    getOneJob,
    getJobBaseApplicant,
    employerJobDelete,
    Getapplication,
    deleteApplicant,
    UpdateApplicantStatus,
    ToDoPost,
    ToDoGet,
    ToDoUpdate,
    ToDoDelete,
    AllDelete,
    notesPost,
    notesGet,
    notesUpdate,
    notesDelete,
    AllnotesDelete,
    ViewResume,
    UpdateJobStatus,
    companyInfo,
    companyInfoUpdate,
    companyInfoGet,
    GetEmployerProfile,
    getEmployerCurrency,
    GetEmployerUpdate,
    ChangePassword,
    DownloadCV,
    getEmployerNotification,
    singleViewEmployerNotification,
    candidateProfileView,
  };
};
export default EmployerAPIS;
