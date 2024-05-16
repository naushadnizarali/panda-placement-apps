import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { LOCAL_URL_USER } from '../pages/Jsondata/URL';
import { useSelector, useDispatch } from 'react-redux';
import { logoutUser } from '../../redux/slice/loginSlice';
// const BASE_URL = "https://hakimahmadi.pythonanywhere.com/api/";
const BASE_URL = LOCAL_URL_USER;

const UserApi = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const token = useSelector((state) => state.loginuser.token);

  const getTokenFromLocalStorage = () => {
    return localStorage.getItem('Usertoken');
  };

  // const cheakToken = () => {
  //   localStorage.removeItem("Usertoken");
  //   navigate("/");
  //   return;
  // };

  const cheakToken = async () => {
    try {
      const response = await axios.post(`${BASE_URL}token/verify/`, {
        token: token,
      });
    } catch (error) {
      console.error(error);
      // Toast.error("Session Expire.Login Again")
      setTimeout(() => {
        dispatch(logoutUser());
        navigate('/');
      }, 2000);
    }
    // localStorage.removeItem("Usertoken");
    // navigate("/");
    return;
  };

  const userRegistration = async (userData) => {
    try {
      const response = await axios.post(
        `${BASE_URL}user/create_seeker`,
        userData
      );
      return response.data;
    } catch (error) {
      return error;
    }
  };

  const userLogin = async (email) => {
    try {
      const response = await axios.post(`${BASE_URL}user/signin`, email);
      return response.data;
    } catch (error) {
      return error;
    }
  };

  const subscriberEmail = async (email) => {
    try {
      const response = await axios.post(`${BASE_URL}subscribe/`, {
        email: email,
      });
      return response.data;
    } catch (error) {
      return error;
    }
  };

  const reSendVerificationCode = async (email) => {
    try {
      const response = await axios.post(
        `${BASE_URL}resent_activation_code/`,
        email
      );
      return response.data;
    } catch (error) {
      return error;
    }
  };

  const postSaveJobs = async (id) => {
    try {
      await cheakToken();
      const response = await axios.post(
        `${BASE_URL}user/bookmarks/`,
        {
          job_key: id,
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

  const deleteSaveJobs = async (id) => {
    try {
      await cheakToken();
      const response = await axios.delete(`${BASE_URL}user/bookmarks/`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
        data: {
          job_key: id,
        },
      });

      return response.data;
    } catch (error) {
      return error;
    }
  };
  //TODO:Not Decided
  const getSaveJobs = async () => {
    try {
      const token = getTokenFromLocalStorage();
      if (!token) {
        console.log('Token not found in localStorage');
        return;
      }
      const response = await axios.get(`${BASE_URL}user/bookmarks/`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      return response.data;
    } catch (error) {
      return error;
    }
  };

  const userProfileProgress = async () => {
    try {
      const response = await axios.get(`${BASE_URL}user/get_userdata/`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      return response.data;
    } catch (error) {
      return error;
    }
  };

  const userProfileData = async () => {
    try {
      await cheakToken();
      const response = await axios.get(`${BASE_URL}user/get_profile`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      return response.data;
    } catch (error) {
      return error;
    }
  };

  const getUserCurrency = async () => {
    try {
      const token = getTokenFromLocalStorage();
      if (!token) {
        console.log('Token not found in localStorage');
        return;
      }
      const response = await axios.get(`${BASE_URL}settings/`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      return response.data;
    } catch (error) {
      return error;
    }
  };
  // const postUserCurrency = async () => {
  //   try {
  //     const token = getTokenFromLocalStorage();
  //     if (!token) {
  //       console.log("Token not found in localStorage");
  //       return;
  //     }
  //     const response = await axios.post(`${BASE_URL}settings/`, {
  //       headers: {
  //         Authorization: `Bearer ${token}`,
  //       },
  //     });
  //     return response.data;
  //   } catch (error) {
  //     return error;
  //   }
  // };

  const getCountries = async () => {
    try {
      const response = await axios.get(`${BASE_URL}get_countries/`);
      return response.data;
    } catch (error) {
      return error;
    }
  };

  const getStates = async (id) => {
    try {
      const response = await axios.get(`${BASE_URL}get_states/${id}`);
      return response.data;
    } catch (error) {
      return error;
    }
  };
  const getCities = async (country, state) => {
    try {
      const response = await axios.get(
        `${BASE_URL}get_cities/?country=${country}&state=${state}`
      );
      return response.data;
    } catch (error) {
      return error;
    }
  };
  //http://universities.hipolabs.com/search?country=Pakistan
  const getCountyUniversities = async (country) => {
    try {
      const response = await axios.get(
        `http://universities.hipolabs.com/search?country=${country}`
      );
      return response.data;
    } catch (error) {
      return error;
    }
  };

  const restSetPassword = async (userData) => {
    try {
      const response = await axios.post(
        `${BASE_URL}user/password_reset/`,
        userData
      );
      return response.data;
    } catch (error) {
      return error;
    }
  };

  const restSetPasswordConfrim = async (userData, path) => {
    try {
      const response = await axios.post(`${BASE_URL}${path}`, userData);
      return response.data;
    } catch (error) {
      return error;
    }
  };

  const UserProfileInformation = async () => {
    try {
      await cheakToken();
      const response = await axios.get(`${BASE_URL}user/profile/`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      return response.data;
    } catch (error) {
      return error;
    }
  };

  const UserProfileInformationPost = async (data) => {
    try {
      await cheakToken();
      const response = await axios.put(`${BASE_URL}user/profile/`, data, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      return response.data;
    } catch (error) {
      return error;
    }
  };

  const getUserInformation = async () => {
    try {
      await cheakToken();
      const response = await axios.get(`${BASE_URL}user/seeker_information/`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      return response.data;
    } catch (error) {
      return error;
    }
  };
  // ssl GET
  const sslinformation = async () => {
    try {
      await cheakToken();
      const response = await axios.get(`${BASE_URL}user/ssl_info/`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      return response.data;
    } catch (error) {
      return error;
    }
  };
  // ssl POST
  const sslPostInformation = async (updateddata) => {
    try {
      await cheakToken();
      const response = await axios.post(
        `${BASE_URL}user/ssl_info/`,
        updateddata,
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
  //User Post
  const UserExperince = async (newExperience) => {
    try {
      await cheakToken();
      const response = await axios.post(
        `${BASE_URL}user/experience/`,
        newExperience,
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
  //Get All Experince
  const UserExperinceGet = async () => {
    try {
      await cheakToken();
      const response = await axios.get(`${BASE_URL}user/experience/`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      return response.data;
    } catch (error) {
      if (error?.response?.status === 401) {
        cheakToken();
      }
      return error;
    }
  };
  //Delete Experince
  const UserExperinceDelete = async (id) => {
    try {
      await cheakToken();
      const response = await axios.delete(`${BASE_URL}user/experience/${id}/`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      return response.data;
    } catch (error) {
      return error;
    }
  };
  // Update User Experience
  const UserExperinceUpdate = async (id, UpdateExperience) => {
    try {
      await cheakToken();
      const response = await axios.put(
        `${BASE_URL}user/experience/${id}/`,
        UpdateExperience,
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
  //Post Project
  const userProjectPost = async (projectUser) => {
    try {
      await cheakToken();
      const response = await axios.post(
        `${BASE_URL}user/project/`,
        projectUser,
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
  //get Projects
  const userProjectGet = async () => {
    try {
      await cheakToken();
      const response = await axios.get(`${BASE_URL}user/project/`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      return response.data;
    } catch (error) {
      return error;
    }
  };
  // Edit Project
  const userProjectupdate = async (id, newProject) => {
    try {
      await cheakToken();
      const response = await axios.put(
        `${BASE_URL}user/project/${id}/`,
        newProject,
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

  // Delete Project
  const userProjectDelete = async (id) => {
    try {
      await cheakToken();
      const response = await axios.delete(`${BASE_URL}user/project/${id}/`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      return response.data;
    } catch (error) {
      return error;
    }
  };
  // Eductions APIS user/qualification/
  const UserEductionsPost = async (Eductions) => {
    try {
      await cheakToken();
      const response = await axios.post(
        `${BASE_URL}user/qualification/`,
        Eductions,
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
  //Qualification Get
  const UserEductionsGet = async () => {
    try {
      await cheakToken();
      const response = await axios.get(`${BASE_URL}user/qualification/`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      return response.data;
    } catch (error) {
      return error;
    }
  };
  //Qualification Delete
  const UserEductionsDelete = async (id) => {
    try {
      await cheakToken();
      const response = await axios.delete(
        `${BASE_URL}user/qualification/${id}/`,
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
  // Update User Education
  const UserEducationUpdate = async (id, updateData) => {
    try {
      await cheakToken();
      const response = await axios.put(
        `${BASE_URL}user/qualification/${id}/`,
        updateData,
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
  //Post
  const UserInformationPost = async (userinformation) => {
    try {
      await cheakToken();
      const response = await axios.post(
        `${BASE_URL}user/seeker_information/`,
        userinformation,
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
  //Get
  const UserInformationGet = async () => {
    try {
      await cheakToken();
      const response = await axios.get(`${BASE_URL}user/seeker_information/`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      return response.data;
    } catch (error) {
      return error;
    }
  };

  const UserInformationUpdate = async (id, updatedDateValues) => {
    try {
      await cheakToken();
      const response = await axios.put(
        `${BASE_URL}user/seeker_information/${id}/`,
        updatedDateValues,
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

  //POST
  const employmentStatusPost = async (data) => {
    try {
      await cheakToken();
      const response = await axios.post(
        `${BASE_URL}user/employment_status/`,
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
  //GET
  const employmentStatusGet = async () => {
    try {
      const token = getTokenFromLocalStorage();
      if (!token) {
        console.log('Token not found in localStorage');
        return;
      }
      const response = await axios.get(`${BASE_URL}user/employment_status/`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      return response.data;
    } catch (error) {
      if (error?.response?.status === 401) {
        cheakToken();
      }
      return error;
    }
  };

  // Contact US FOR ALL
  const ContactUs = async (data) => {
    try {
      const response = await axios.post(`${BASE_URL}contactus/`, data);
      return response.data;
    } catch (error) {
      return error;
    }
  };
  const GetAllJobs = async () => {
    try {
      // await cheakToken();
      const response = await axios.get(`${BASE_URL}guest_jobs/`);
      return response.data;
    } catch (error) {
      return error;
    }
  };
  const GetOneJob = async (jobtitle) => {
    try {
      // await cheakToken();
      const response = await axios.get(`${BASE_URL}guest_jobs/${jobtitle}/`);
      return response.data;
    } catch (error) {
      return error;
    }
  };

  const GetApplicationDetail = async (Appid) => {
    const token = getTokenFromLocalStorage();
    if (!token) {
      console.log('Token not found in localStorage');
      return;
    }
    try {
      // await cheakToken();
      const response = await axios.get(
        `${BASE_URL}user/applied_jobs/${Appid}/`,
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
  //Not Decided
  const GetuserJobs = async () => {
    try {
      const response = await axios.get(`${BASE_URL}user/user_jobs/`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      return response.data;
    } catch (error) {
      return error;
    }
  };

  const getCategoty = async () => {
    try {
      const response = await axios.get(`${BASE_URL}guest_jobs_category/`);
      return response.data;
    } catch (error) {
      return error;
    }
  };

  const getRelatedJobs = async (title) => {
    try {
      const response = await axios.get(`${BASE_URL}related_job/${title}`);
      return response.data;
    } catch (error) {
      return error;
    }
  };

  // UPload PDF
  const uploadPdf = async (file) => {
    try {
      const formData = new FormData();
      formData.append('file', file);
      const token = getTokenFromLocalStorage();
      await cheakToken();

      const response = await axios.post(
        `${BASE_URL}user/upload_resume/`,
        formData,
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

  // GET PDF
  const GetPdf = async () => {
    try {
      const response = await axios.get(`${BASE_URL}user/resume`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      return response.data;
    } catch (error) {
      return error;
    }
  };
  // Change Password
  const ChangePassword = async (data) => {
    try {
      await cheakToken();
      const response = await axios.post(
        `${BASE_URL}user/password_change/`,
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

  // Apply For JOb
  const userjobApply = async (data) => {
    try {
      await cheakToken();
      const response = await axios.post(`${BASE_URL}user/applied_jobs/`, data, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      return response.data;
    } catch (error) {
      return error;
    }
  };

  // My Apply Josb
  const userAppliedJobs = async (data) => {
    try {
      await cheakToken();
      const response = await axios.get(`${BASE_URL}user/applied_jobs/`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      return response.data;
    } catch (error) {
      return error;
    }
  };
  // Get Resume http://192.168.0.106:8000/media/cv_files/16.pdf

  const viewResume = async () => {
    try {
      const response = await axios.get(`${BASE_URL}user/resume`, {
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

  // const viewResumePartTwoAuth = async () => {
  //   try {
  //     const token = getTokenFromLocalStorage();
  //     if (!token) {
  //       console.log("Token Not Found in LocalStorage");
  //       return;
  //     }
  //     const response = await axios.get(`${BASE_URL}user/resume`, {
  //       headers: {
  //         Authorization: `Bearer ${token}`,
  //       },
  //     });
  //     return response.data;
  //   } catch (error) {
  //     return error;
  //   }
  // };

  const employmentStatusUpdate = async (id, data) => {
    try {
      await cheakToken();
      const response = await axios.put(
        `${BASE_URL}user/employment_status/${id}/`,
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
  const makeresume = async (templateId) => {
    try {
      await cheakToken();
      const response = await axios.get(
        `${BASE_URL}user/create_resume/template?temID=${templateId}`,
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

  const blogs = async () => {
    try {
      const response = await axios.get(`${BASE_URL}get_blogs/`);
      return response.data;
    } catch (error) {
      return error;
    }
  };

  // http://192.168.0.106:8000/api/user/create_resume

  const getCvTemplate = async () => {
    try {
      const response = await axios.get(`${BASE_URL}user/get_resumetemplates/`);
      return response?.data;
    } catch (error) {
      return error;
    }
  };

  // FOR JOB VIEW
  const userJobViewCount = async (data) => {
    try {
      const response = await axios.get(
        `${BASE_URL}user/markjobviewed/${data}/`,
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

  return {
    cheakToken,
    UserInformationGet,
    UserInformationUpdate,
    UserInformationPost,
    userRegistration,
    reSendVerificationCode,
    userProfileProgress,
    UserProfileInformation,
    UserProfileInformationPost,
    userLogin,
    subscriberEmail,
    restSetPassword,
    restSetPasswordConfrim,
    sslinformation,
    getUserInformation,
    UserExperince,
    sslPostInformation,
    UserExperinceGet,
    UserExperinceDelete,
    UserExperinceUpdate,
    userProjectPost,
    userProjectGet,
    userProjectupdate,
    userProjectDelete,
    UserEductionsPost,
    UserEductionsGet,
    UserEductionsDelete,
    UserEducationUpdate,
    employmentStatusGet,
    employmentStatusPost,
    ContactUs,
    GetAllJobs,
    GetOneJob,
    GetuserJobs,
    getCategoty,
    getRelatedJobs,
    userjobApply,
    userAppliedJobs,
    uploadPdf,
    GetPdf,
    viewResume,
    ChangePassword,
    employmentStatusUpdate,
    makeresume,
    userProfileData,
    getUserCurrency,
    getCountries,
    getCountyUniversities,
    getStates,
    getCities,
    postSaveJobs,
    getSaveJobs,
    deleteSaveJobs,
    blogs,
    getCvTemplate,
    userJobViewCount,
    GetApplicationDetail,
  };
};

export default UserApi;
