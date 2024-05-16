import React, { useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import EmployerAPIS from '../../../Apis/EmployerApi';
import { DynamicTitle } from '../../../Helpers/DynamicTitle';
import CustomButton from '../../../component/Button/CustomButton';
import Employee from '../../../component/EmployerCard/Employee';
import Toast from '../../../component/Toast/Toast';
import TodoSimple from '../../../component/Todo/SingleTodoCom';
import styles from '../../../component/Todo/TodoList.module.css';
import { FaBriefcase, FaCoins, FaFileAlt } from 'react-icons/fa';
import { FcApproval } from 'react-icons/fc';
import { MdOutlinePendingActions } from 'react-icons/md';
import { RiPassExpiredFill } from 'react-icons/ri';
import { TbBriefcaseOff } from 'react-icons/tb';
import { useDispatch } from 'react-redux';
import { fetchEmployerData } from '../../../../redux/slice/employerProfileDataSlice';
import { fetchAllnotification } from '../../../../redux/slice/employerNotification';
import { useSelector } from 'react-redux';
import SearchInput from '../../../component/SearchInput/Search';
import employerjobs, { alljobs } from '../../../../redux/slice/employerjobs';
function EmployerHome() {
  const employerapi = EmployerAPIS();
  const { pathname } = useLocation();
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [isnotesloading, setisnotesloading] = useState(false);
  const [jobscount, setjobscount] = useState(0);
  const [applicationCount, setapplicationCount] = useState(0);
  const [approved, setapproved] = useState(0);
  const [unapproved, setunapproved] = useState(0);
  const [pending, setpending] = useState(0);
  const [complete, setcomplete] = useState(0);
  const [jobs, setjobs] = useState([]);
  const [open, setOpen] = useState(0);
  const [close, setClose] = useState(0);
  const [Notes, setNotes] = useState([]);
  const [inputText, setInputText] = useState('');
  const [inputTextnotes, setInputTextnotes] = useState('');
  const [status, setstatus] = useState(false);
  const [todos, setTodos] = useState([]);
  const [isTodoVisible, setTodoVisibility] = useState(false);

  useEffect(() => {
    const desiredRoute = '/employer/home';
    if (pathname !== desiredRoute) {
      navigate(desiredRoute);
    }
  }, [pathname]);

  const handleInputChange = (e) => {
    setInputText(e.target.value);
  };

  const handleInputChangenotes = (e) => {
    setInputTextnotes(e.target.value);
  };

  //Notes API here
  const getAllNotes = async () => {
    try {
      const response = await employerapi.notesGet();
      setNotes(response);
    } catch (error) {
      console.error(error);
    }
  };
  const handleAddNotes = async () => {
    if (inputTextnotes.trim() !== '') {
      try {
        setisnotesloading(true);
        const newNote = { notes: inputTextnotes, is_completed: status };
        // Create a new array containing the existing notes and the new note
        const updatedNotes = [...Notes, newNote];
        setNotes(updatedNotes);
        const response = await employerapi.notesPost(newNote);
        setInputTextnotes('');
        getAllNotes();
        Toast.success('Notes Added!');
        setisnotesloading(false);
      } catch (error) {
        Toast.error('Notes Not Added. Please Try Later!');
        setisnotesloading(false);
      }
    } else {
      Toast.error('Please Add Notes!');
      setisnotesloading(false);
    }
  };
  const handleDeleteNotes = async (note) => {
    try {
      const response = await employerapi.notesDelete(note);
      Toast.success('Notes Deletd!');
      getAllNotes();
    } catch (error) {
      Toast.error('Notes Not Deleted! \n Please try Again!');
      console.error('ERROR:in Notes Deletion', error);
    }
  };
  const handleToggleCompleteNotes = async (todo, index) => {
    const updatedNotes = [...Notes];
    updatedNotes[index].is_complete = !updatedNotes[index].is_complete;
    setNotes(updatedNotes);
    try {
      const response = await employerapi.notesUpdate(todo.id, todo);
      Toast.success('Status Updated!');
      getAllNotes();
    } catch (error) {
      Toast.error('Status Not Updated!');
      console.error('ERROR:is Not Updating Notes Status');
    }
  };
  const handleDeleteAllNotes = async () => {
    try {
      const response = await employerapi.AllnotesDelete();
      Toast.success('All Notes Deleted!');
      getAllNotes();
    } catch (error) {
      console.error(error);
    }
  };

  //TODOS API HERE:
  const getAllTodos = async () => {
    try {
      const response = await employerapi.ToDoGet();
      setTodos(response);
    } catch (error) {
      console.error("ERROR in Getting All To Do's", error);
    }
  };
  const handleAddTodo = async () => {
    if (inputText.trim() !== '') {
      try {
        setLoading(true);
        const newTodo = { todo: inputText, is_completed: status };
        setTodos(newTodo);
        setTodos([...todos, newTodo]);
        const response = await employerapi.ToDoPost(newTodo);
        setInputText('');
        getAllTodos();
        Toast.success('To_Do Added!');
        setLoading(false);
      } catch (error) {
        Toast.error('To Do Not Added. Please Try Later!');
        console.error('ERROR: Todo Not Added!', error);
        setLoading(false);
      }
    } else {
      Toast.error('Please Added Todo!');
      setLoading(false);
    }
  };
  const handleToggleCompleteTodo = async (todo, index) => {
    const updatedTodos = [...todos];
    updatedTodos[index].is_complete = !updatedTodos[index].is_complete;
    setTodos(updatedTodos);
    try {
      const response = await employerapi.ToDoUpdate(todo.id, todo);
      Toast.success('Status Updated!');
      getAllTodos();
    } catch (error) {
      // Handle API request error
      console.error('ERROR:Status Not Change', error);
    }
  };
  const handleDeleteTodo = async (todo) => {
    try {
      const response = await employerapi.ToDoDelete(todo);
      Toast.success('To Do Deletd!');
      getAllTodos();
    } catch (error) {
      Toast.error('Please Try Later!');
      console.error('ERROR:Employer Todo Not Delete ', error);
    }
  };

  const handleDeleteAllTodo = async () => {
    try {
      const response = await employerapi.AllDelete();
      Toast.success('All To Do Deletd!');
      getAllTodos();
    } catch (error) {
      Toast.error('Please Try Later!');
      console.error('ERROR:All Todos Not Deleted', error);
    }
  };

  const employerProfile = async () => {
    try {
      const response = await employerapi.GetEmployerProfile();
      dispatch(fetchEmployerData(response));
    } catch (error) {
      console.error('Please Try Later!', error);
    }
  };

  //getting Employer Notification
  const getNotification = async () => {
    try {
      const res = await employerapi.getEmployerNotification();
      dispatch(fetchAllnotification(res));
    } catch (error) {
      console.error(error);
    }
  };
  //Get All Jobs and Filter  Then With Different Status
  useEffect(() => {
    DynamicTitle('Dashboard-PandaPlacement');
    getNotification();
    getAllNotes();
    getAllTodos();
    employerProfile();
    const fetchData = async () => {
      try {
        const allJobsResponse = await employerapi?.AllJObs();
        setjobscount(allJobsResponse?.length);
        setjobs(allJobsResponse);
        dispatch(alljobs(allJobsResponse));
        const applicationResponse = await employerapi?.Getapplication();
        setapplicationCount(applicationResponse?.length);
        let approvedCount = 0;
        let unapprovedCount = 0;
        let pendingCount = 0;
        let completeCount = 0;
        let openCount = 0;
        let closeCount = 0;
        for (let i = 0; i < allJobsResponse?.length; i++) {
          const application = allJobsResponse[i];
          // Status Cheaking
          if (application?.status === 'Pending') {
            pendingCount++;
          } else if (application?.status === 'Approved') {
            approvedCount++;
          } else if (application?.status === 'Unapproved') {
            unapprovedCount++;
          } else if (application?.status === 'Expired') {
            completeCount++;
          }
          // Phase Cheaking
          if (application?.phase === 'Open') {
            openCount++;
          } else if (application?.phase === 'Close') {
            closeCount++;
          }
        }
        // Set the state variables with the counts
        setpending(pendingCount);
        setapproved(approvedCount);
        setunapproved(unapprovedCount);
        setcomplete(completeCount);
        setOpen(openCount);
        setClose(closeCount);
      } catch (error) {
        console.error('Error in Employer Dashboard', error);
      }
    };
    fetchData();
  }, []);

  const statisticsData = [
    {
      icon: <FaCoins />,
      color: styles.blue_icon,
      label: 'Posted Jobs',
      property: jobscount,
      style: styles.ui_blue,
    },
    {
      icon: <FaFileAlt />,
      color: styles.green_icon,
      label: 'Total Applications',
      property: applicationCount,
      style: styles.ui_green,
    },
    {
      icon: <FcApproval />,
      color: styles.yellow_icon,
      label: 'Approved Jobs',
      property: approved,
      style: styles.ui_yellow,
    },
    {
      icon: <FaFileAlt />,
      color: styles.red_icon,
      label: 'Rejected Jobs',
      property: unapproved,
      style: styles.ui_red,
    },
    {
      icon: <MdOutlinePendingActions />,
      color: styles.yellow_icon,
      label: 'Pending Jobs',
      property: pending,
      style: styles.ui_yellow,
    },
    {
      icon: <FaBriefcase />,
      color: styles.blue_icon,
      label: 'Open Jobs',
      property: open,
      style: styles.ui_blue,
    },
    {
      icon: <TbBriefcaseOff />,
      color: styles.blue_icon,
      label: 'Close Jobs',
      property: close,
      style: styles.ui_blue,
    },
    {
      icon: <RiPassExpiredFill />,
      color: styles.red_icon,
      label: 'Expire Jobs',
      property: complete,
      style: styles.ui_red,
    },
  ];

  const toggleTodoVisibility = () => {
    setTodoVisibility(!isTodoVisible);
  };

  return (
    <>
      <div style={{ paddingBottom: '20px' }}>
        <div>
          <Employee employerstats={statisticsData} />
        </div>

        {isTodoVisible ? (
          <CustomButton onClick={toggleTodoVisibility} label={'Close Todo'} />
        ) : (
          <CustomButton onClick={toggleTodoVisibility} label={'Open Todo'} />
        )}

        {isTodoVisible ? (
          <div className={styles.dashboard}>
            <TodoSimple
              isnotes={false}
              label="TO DO List"
              todos={todos}
              inputText={inputText}
              onInputChange={handleInputChange}
              onAddTodo={handleAddTodo}
              onDeleteTodo={handleDeleteTodo}
              onToggleComplete={handleToggleCompleteTodo}
              onDeleteAllTodos={handleDeleteAllTodo}
              loading={loading}
            />
            <TodoSimple
              isnotes={true}
              label="Notes List"
              todos={Notes}
              inputText={inputTextnotes}
              onInputChange={handleInputChangenotes}
              onAddTodo={handleAddNotes}
              onDeleteTodo={handleDeleteNotes}
              onToggleComplete={handleToggleCompleteNotes}
              onDeleteAllTodos={handleDeleteAllNotes}
              loading={isnotesloading}
            />
          </div>
        ) : (
          ''
        )}
      </div>
    </>
  );
}

export default EmployerHome;
