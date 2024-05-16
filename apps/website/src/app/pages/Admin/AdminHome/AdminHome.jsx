import React, { useEffect, useState } from 'react';
import Employee from '../../../component/EmployerCard/Employee';
import styles from './Admin.module.css';
import AdminApi from '../../../Apis/AdminApi';
import TodoSimple from '../../../component/Todo/SingleTodoCom';
import Toast from '../../../component/Toast/Toast';
import AdminTable from '../../../component/Table/AdminTable';
import { useNavigate } from 'react-router-dom';

import { FaFileAlt } from 'react-icons/fa';
import { FaUserTie } from 'react-icons/fa';
import { FaUsers } from 'react-icons/fa';
import { FaCoins } from 'react-icons/fa';

function AdminHome() {
  const navigate = useNavigate();
  const adminapi = AdminApi();
  const [inputText, setInputText] = useState('');
  const [status, setstatus] = useState(false);
  const [statistics, setStatistics] = useState([]);
  const [Notes, setNotes] = useState([]);
  const [pendingJobs, setpendingJobs] = useState([]);
  const [staticloading, setstaticloading] = useState(false);
  const [isloading, setIsloading] = useState(false);
  const tableColoum = ['S.NO', 'Job Title', 'Employer', 'City', 'Status'];
  const actionsoptins = [
    { label: 'Approved', value: 'Approved' },
    { label: 'Reject', value: 'Reject' },
    { label: 'Pending', value: 'Pending' },
    { label: 'Expire', value: 'Expire' },
  ];

  const adminDasboardDetails = async () => {
    setstaticloading(true);
    try {
      const response = await adminapi.adminStatistics();
      setStatistics(response);
      setstaticloading(false);
    } catch (error) {
      setstaticloading(false);
      console.error('ERROR: adminStatistics', error);
    }
  };
  const handleInputChange = (e) => {
    setInputText(e.target.value);
  };
  const getAllNotes = async () => {
    try {
      const response = await adminapi.adminGetNotes();
      setNotes(response);
    } catch (error) {
      Toast.error('Please Try Later!');
    }
  };
  const handleAddTodo = async () => {
    if (inputText.trim() !== '') {
      try {
        const newNote = { notes: inputText, is_completed: status };
        const updatedNotes = [...Notes, newNote];
        setNotes(updatedNotes);
        const response = await adminapi.adminAddNotes(newNote);
        setInputText('');
        getAllNotes();
        Toast.success('Notes Added!');
      } catch (error) {
        Toast.error('Notes Not Added. Please Try Later!');
      }
    } else {
      Toast.error('Please Add Notes!');
    }
  };
  const handleDeleteTodo = async (index) => {
    try {
      const response = await adminapi.adminDeleteNotes(index);
      Toast.success('Notes Deleted!');
      getAllNotes();
    } catch (error) {
      Toast.error('Notes Not Deleted! \n Please try Again!');
      console.error('ERROR:in Notes Deletion', error);
    }
  };
  const handleToggleComplete = async (todo, index) => {
    const updatedNotes = [...Notes];
    updatedNotes[index].is_complete = !updatedNotes[index].is_complete;
    setNotes(updatedNotes);
    try {
      const response = await adminapi.adminUpdateNotes(todo, todo?.id);
      Toast.success('Status Updated!');
      getAllNotes();
    } catch (error) {
      Toast.error('Status Not Updated!');
      console.error('ERROR:is Not Updating Notes Status');
    }
  };
  const handleDeleteAllTodos = async () => {
    try {
      const response = await adminapi.adminDeleteAllNotes();
      Toast.success('Deleted All Notes');
      getAllNotes();
    } catch (error) {
      Toast.error('Plese Try Again!');
      console.error('ERROR: in Deleting All Notes', error);
    }
  };

  const getAdminPendingJobs = async () => {
    setIsloading(true);
    try {
      const response = await adminapi.getPendingJobs();
      setpendingJobs(response);
      setIsloading(false);
    } catch (error) {
      setIsloading(false);
      console.error('ERROR: Getting Jobs', error);
    }
  };

  const updatePendingJobStatus = async (newStatus, item) => {
    setIsloading(true);
    try {
      if (item) {
        const response = await adminapi.PendingJobsStatus(item, newStatus);
        Toast.success(`Job ${newStatus}`);
        getAdminPendingJobs();
        setIsloading(false);
      } else {
        Toast.error('Try Again Please');
      }
    } catch (error) {
      setIsloading(false);
      Toast.error('Job Status Not Update Please Try Later!');
      console.error('ERROR: in Updating Job', error);
    }
  };

  //Tabel Actions
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
      getAdminPendingJobs();
    } catch (error) {
      Toast.error('Job Not delete \n Please Try Later');
      console.error('ERROR:Job Not Delete', error);
      setIsloading(false);
    }
  };

  useEffect(() => {
    getAdminPendingJobs();
    adminDasboardDetails();
    getAllNotes();
  }, []);

  const statisticsData = [
    {
      icon: <FaCoins />,
      color: styles.blue_icon,
      label: 'Total Jobs',
      property: statistics?.jobs,
      style: styles.ui_blue,
    },
    {
      icon: <FaUsers />,
      color: styles.red_icon,
      label: 'Employers',
      property: statistics?.employers,
      style: styles.ui_red,
    },
    {
      icon: <FaUserTie />,
      color: styles.yellow_icon,
      label: 'Candidates',
      property: statistics?.seekers,
      style: styles.ui_yellow,
    },
    {
      icon: <FaFileAlt />,
      color: styles.green_icon,
      label: 'Total Applications',
      property: statistics?.applications,
      style: styles.ui_green,
    },
  ];

  return (
    <div style={{ paddingBottom: '20px' }}>
      <div>
        <Employee loading={staticloading} employerstats={statisticsData} />
      </div>
      <p
        style={{ lineHeight: '0%', marginLeft: '1.5rem' }}
      >{`${pendingJobs.length} Pending Jobs Available`}</p>
      <div className={styles.dashboard}>
        {pendingJobs ? (
          <AdminTable
            loading={isloading}
            isPendingJob
            data={pendingJobs}
            columns={tableColoum}
            // onRowClick={(item) => handleCandidateClick(item)}
            onStatusChange={(newStatus, item) =>
              updatePendingJobStatus(newStatus, item?.id)
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
        <TodoSimple
          isnotes={true}
          label="Notes List"
          todos={Notes}
          inputText={inputText}
          onInputChange={handleInputChange}
          onAddTodo={handleAddTodo}
          onDeleteTodo={handleDeleteTodo}
          onToggleComplete={handleToggleComplete}
          onDeleteAllTodos={handleDeleteAllTodos}
        />
      </div>
    </div>
  );
}

export default AdminHome;
