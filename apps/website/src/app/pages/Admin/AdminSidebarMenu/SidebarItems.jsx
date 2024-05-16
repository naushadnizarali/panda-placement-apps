import { FaList } from 'react-icons/fa';
import { MdDashboard } from 'react-icons/md';
import { FaPlus } from 'react-icons/fa';
import { FaBriefcase } from 'react-icons/fa';
import { FaUserCheck } from 'react-icons/fa';
import { RiUserSearchFill } from 'react-icons/ri';
import { IoMdSettings } from 'react-icons/io';

const AdminMenuItems = [
  {
    id: 1,
    icon: (
      <MdDashboard
        //  icon={faChartArea}
        fontSize={20}
      />
    ),
    label: 'Dashboard',
    path: '/manager/manager-home',
  },
  {
    id: 2,
    icon: (
      <FaPlus
        fontSize={20}
        //  icon={faPlus}
      />
    ),
    label: 'Post A New Job',
    path: '/manager/post-job',
  },
  {
    id: 3,
    icon: (
      <FaBriefcase
        fontSize={20}
        // icon={faBriefcase}
      />
    ),
    label: 'Manage All Jobs',
    path: '/manager/all_jobs',
  },
  {
    id: 4,
    icon: (
      <FaUserCheck
        fontSize={23}
        //  icon={faUserPlus}
      />
    ),
    label: 'Hire for us',
    path: '/manager/hire-expert',
  },
  {
    id: 5,
    icon: (
      <RiUserSearchFill
        fontSize={23}
        // icon={faUserTie}
      />
    ),
    label: 'Seekers',
    path: '/manager/seekers',
  },
  // {
  //   id: 6,
  //   icon: <FontAwesomeIcon fontSize={20} icon={faMagnifyingGlass} />,
  //   label: "Search Resumes",
  //   path: "/manager/search-resumes",
  // },
  {
    id: 7,
    icon: <FaList size={20} />,
    label: 'Review',
    path: '/manager/review',
  },
  // {
  //   id: 8,
  //   icon: <FontAwesomeIcon fontSize={20} icon={faHeadset} />,
  //   label: "Help",
  //   path: "/manager/help",
  // },
  // {
  //   id: 9,
  //   icon: <FontAwesomeIcon fontSize={20} icon={faPhoneVolume} />,
  //   label: "Contact Us",
  //   path: "/manager/contact-us",
  // },
  {
    id: 10,
    icon: (
      <IoMdSettings
        fontSize={20}
        //  icon={faCog}
      />
    ),
    label: 'Settings',
  },
];

export default AdminMenuItems;
