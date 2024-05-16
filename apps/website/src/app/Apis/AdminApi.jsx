import axios from 'axios';
import { LOCAL_URL_MANAGER } from '../pages/Jsondata/URL';

const BASE_URL = LOCAL_URL_MANAGER;

const AdminApi = () => {
  const getTokenFromLocalStorage = () => {
    return localStorage.getItem('admin_token');
  };

  const adminLogin = async (adminData) => {
    try {
      const response = await axios.post(`${BASE_URL}/signin`, adminData);
      return response.data;
    } catch (error) {
      return error;
    }
  };
  const adminStatistics = async () => {
    try {
      const token = getTokenFromLocalStorage();
      if (!token) {
        console.error('Token Not Found');
        return;
      }
      const response = await axios.get(`${BASE_URL}/statistics/`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      return response.data;
    } catch (error) {
      return error;
    }
  };
  const adminAddNotes = async (data) => {
    try {
      const token = getTokenFromLocalStorage();
      if (!token) {
        console.error('Token Not Found');
        return;
      }
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
  const adminGetNotes = async (data) => {
    try {
      const token = getTokenFromLocalStorage();
      if (!token) {
        console.error('Token Not Found');
        return;
      }
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
  const adminDeleteNotes = async (id) => {
    try {
      const token = getTokenFromLocalStorage();
      if (!token) {
        console.error('Token Not Found');
        return;
      }
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
  const adminUpdateNotes = async (data, id) => {
    try {
      const token = getTokenFromLocalStorage();
      if (!token) {
        console.error('Token Not Found');
        return;
      }
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
  const adminDeleteAllNotes = async () => {
    try {
      const token = getTokenFromLocalStorage();
      if (!token) {
        console.error('Token is Not in LocalStorage');
        return;
      }
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

  //Get Pending Jobs:
  const getPendingJobs = async () => {
    try {
      const token = getTokenFromLocalStorage();
      if (!token) {
        console.error('Token is Not in LocalStorage');
        return;
      }
      const response = await axios.get(`${BASE_URL}/pending_jobs/`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      return response.data;
    } catch (error) {
      return error;
    }
  };

  const PendingJobsStatus = async (id, newStatus) => {
    try {
      const token = getTokenFromLocalStorage();
      if (!token) {
        console.error('Token is Not in LocalStorage');
        return;
      }
      const response = await axios.put(
        `${BASE_URL}/pending_jobs/${id}/`,
        {
          status: newStatus,
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

  const getAllJobs = async () => {
    try {
      const token = getTokenFromLocalStorage();
      if (!token) {
        console.error('Token is Not in LocalStorage');
        return;
      }
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

  //Post Job From Manager With Urgent And Job Status
  const PostJob = async (data) => {
    try {
      const token = getTokenFromLocalStorage();
      if (!token) {
        console.error('Token not found in localStorage');
        return;
      }
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

  //Get One Job From ID FOR Edit
  const getOneJob = async (id) => {
    try {
      const token = getTokenFromLocalStorage();
      if (!token) {
        console.error('Token is Not in LocalStorage');
        return;
      }
      const response = await axios.get(`${BASE_URL}/jobs/${id}/`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      return response.data;
    } catch (error) {
      return error;
    }
  };

  const deleteOneJob = async (id) => {
    try {
      const token = getTokenFromLocalStorage();
      if (!token) {
        console.error('Token is Not in LocalStorage');
        return;
      }
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

  const editjobDetails = async (data, jobid) => {
    try {
      const token = getTokenFromLocalStorage();
      if (!token) {
        console.error('Token not Found IN localStorage');
        return;
      }
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

  const getAllSeekers = async () => {
    try {
      const token = getTokenFromLocalStorage();
      if (!token) {
        console.error('Token not Found IN localStorage');
        return;
      }
      const response = await axios.get(`${BASE_URL}/seekers/`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      return response.data;
    } catch (error) {
      return error;
    }
  };

  return {
    adminLogin,
    adminStatistics,
    adminAddNotes,
    adminGetNotes,
    adminDeleteNotes,
    adminUpdateNotes,
    adminDeleteAllNotes,
    getPendingJobs,
    PendingJobsStatus,
    getAllJobs,
    PostJob,
    getOneJob,
    deleteOneJob,
    editjobDetails,
    getAllSeekers,
  };
};

export default AdminApi;
