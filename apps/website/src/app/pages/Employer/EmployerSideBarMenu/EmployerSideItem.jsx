import { MdDashboard } from 'react-icons/md';
import { FaPlus } from 'react-icons/fa';
import { FaBriefcase } from 'react-icons/fa6';
import { FaUserCheck } from 'react-icons/fa';
import { FaUserTie } from 'react-icons/fa';
import { IoSearch } from 'react-icons/io5';
import { FaList } from 'react-icons/fa';
import { BiSupport } from 'react-icons/bi';
import { FaPhoneVolume } from 'react-icons/fa6';
import { IoLogOut } from 'react-icons/io5';
import { IoMdSettings } from 'react-icons/io';
import { FaUserPlus } from 'react-icons/fa';

const EmployerMenuItems = [
  {
    id: 1,
    icon: <MdDashboard fontSize={20} />,
    label: 'Dashboard',
    path: '/employer/home',
  },
  {
    id: 2,
    icon: <FaPlus fontSize={20} />,
    label: 'Post A New Job',
    path: '/employer/post-job',
  },
  {
    id: 3,
    icon: <FaBriefcase fontSize={20} />,
    label: 'Jobs',
    path: '/employer/jobs',
  },
  {
    id: 4,
    icon: <FaUserCheck fontSize={23} />,
    label: 'Hire An Expert',
    path: '/employer/hire-expert',
  },
  {
    id: 5,
    icon: <FaUserTie fontSize={20} />,
    label: 'Candidates',
    path: '/employer/candidates',
  },
  {
    id: 6,
    icon: <IoSearch fontSize={20} />,
    label: 'Search Resumes',
    path: '',
    // path: "/employer/search-resumes",
  },
  {
    id: 7,
    icon: <FaList size={20} />,
    label: 'Review',
    path: '/employer/review',
  },
  {
    id: 8,
    icon: <BiSupport fontSize={20} />,
    label: 'Help',
    path: '/employer/help',
  },
  {
    id: 9,
    icon: <FaPhoneVolume fontSize={20} />,
    label: 'Contact Us',
    path: '/employer/contact-us',
  },
  {
    id: 11,
    icon: <IoLogOut fontSize={25} style={{ color: 'var(--charcoal)' }} />,
    label: 'Logout',
  },
  // {
  //   id: 10,
  //   icon: <FontAwesomeIcon fontSize={20} icon={faCog} />,
  //   label: "Settings",
  // },
  // {
  //   id: 10,
  //   icon: <IoMdSettings fontSize={20}

  //   />,
  //   label: "Settings",
  // },
];

export default EmployerMenuItems;
