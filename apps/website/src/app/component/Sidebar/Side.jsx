import { FaAddressCard } from 'react-icons/fa';
import { MdChangeCircle } from 'react-icons/md';

import { makeStyles } from '@material-ui/core/styles';
import React, { useEffect, useState } from 'react';
import { Dropdown } from 'react-bootstrap';
import { FaBars, FaTimes } from 'react-icons/fa';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import './side.css';
import Toast from '../Toast/Toast';
import { Fade } from 'react-reveal';
import EmployerNavbar from '../EmployerNavbar/EmployerNavbar';

const useStyles = makeStyles((theme) => ({
  itemList: {
    color: 'var(--charcoal)!important',
    '&:hover': {
      color: 'var(--primary-color) !important',
    },
  },
}));

function Employernavbar({ menuItems, navigation, toggleSidebar, sidebarOpen }) {
  const classes = useStyles();

  const [settingsDropdownOpen, setSettingsDropdownOpen] = useState(false);
  const [activeItem, setActiveItem] = useState(null);
  const location = useLocation();
  const navigate = useNavigate();

  const toggleSettingsDropdown = () => {
    setSettingsDropdownOpen(!settingsDropdownOpen);
  };

  const handleItemClick = async (item) => {
    setActiveItem(item.id);
    localStorage.setItem('activeMenuItem', JSON.stringify(item.id));
    if (item?.id === 11) {
      await localStorage.removeItem('emptoken');
      await localStorage.removeItem('activeMenuItem');
      navigate('/employer/login');
    }
  };

  useEffect(() => {
    const storedActiveItem = localStorage.getItem('activeMenuItem');
    if (storedActiveItem) {
      setActiveItem(JSON.parse(storedActiveItem));
    }
  }, []);

  const Logout = async () => {
    await localStorage.removeItem('emptoken');
    await localStorage.removeItem('activeMenuItem');
    navigate('/employer/login');
  };

  return (
    <>
      <div>
        <div
          className={`${
            sidebarOpen ? 'sidebar-toggle-close' : 'sidebar-toggle'
          }`}
          onClick={toggleSidebar}
        >
          {sidebarOpen ? <FaBars /> : <FaTimes />}
        </div>
      </div>
      <Fade>
        {/* <div className={`${sidebarOpen ? "sidebar-close" : "container_admin"}`}>
          <div className="navbar_imageandicons">
          </div>
          <div>
            <ul className="navbar_options">
              {menuItems &&
                menuItems?.map((item) => (
                  <li
                    className={`navbar_list_item ${location.pathname === item.path ? "active" : "" }`}
                    key={item.id}
                    onClick={() => handleItemClick(item)}
                  >
                    {item.icon}
                    {item.label === "Settings" ? (
                      <Dropdown
                        show={settingsDropdownOpen}
                        onToggle={toggleSettingsDropdown}
                      >
                        <Dropdown.Toggle variant="" id="dropdown-basic">
                          {item.label}
                        </Dropdown.Toggle>
                        <Dropdown.Menu>
                          <Dropdown.Item
                            className={classes.itemList}
                            href="/employer/profile"
                          >
                            <FaAddressCard
                              fontSize={20}
                              style={{ display: "inline-flex", marginRight: "1rem", color: "var(--charcoal)" }}
                            />
                            Profile
                          </Dropdown.Item>
                          <Dropdown.Item
                            className={classes.itemList}
                            href="/employer/change-password"
                          >
                            <MdChangeCircle
                              fontSize={20}
                              style={{ display: "inline-flex", marginRight: "1rem", color: "var(--charcoal)" }}
                            />
                            Change Password
                          </Dropdown.Item>
                        </Dropdown.Menu>
                      </Dropdown>
                    ) : item.path ? (
                      <Link
                        style={{ fontSize: 16, marginLeft: 15 }}
                        to={item?.path}
                      >
                        {item?.label}
                      </Link>
                    ) : (
                      <Link
                        style={{
                          fontSize: 16,
                          marginLeft: 15,
                          cursor: "pointer",
                        }}s
                        onClick={() => {
                          Toast.success("Coming Soon...");
                        }}
                      >
                        {item.label}
                      </Link>
                    )}
                  </li>
                ))}
            </ul>
          </div>
        </div> */}

        <div
          className={`${sidebarOpen ? 'sidebar-close' : 'container_admin'}`}
          style={{ maxHeight: '100vh', overflowY: 'auto' }}
        >
          <div className="navbar_imageandicons"></div>
          <div>
            <ul className="navbar_options">
              {menuItems &&
                menuItems?.map((item) => (
                  <li
                    className={`navbar_list_item ${
                      location.pathname === item.path ? 'active' : ''
                    }`}
                    key={item.id}
                    onClick={() => handleItemClick(item)}
                  >
                    {item.icon}
                    {item.label === 'Settings' ? (
                      <Dropdown
                        show={settingsDropdownOpen}
                        onToggle={toggleSettingsDropdown}
                      >
                        <Dropdown.Toggle variant="" id="dropdown-basic">
                          {item.label}
                        </Dropdown.Toggle>
                        <Dropdown.Menu>
                          <Dropdown.Item
                            className={classes.itemList}
                            href="/employer/profile"
                          >
                            <FaAddressCard
                              fontSize={20}
                              style={{
                                display: 'inline-flex',
                                marginRight: '1rem',
                                color: 'var(--charcoal)',
                              }}
                            />
                            Profile
                          </Dropdown.Item>
                          <Dropdown.Item
                            className={classes.itemList}
                            href="/employer/change-password"
                          >
                            <MdChangeCircle
                              fontSize={20}
                              style={{
                                display: 'inline-flex',
                                marginRight: '1rem',
                                color: 'var(--charcoal)',
                              }}
                            />
                            Change Password
                          </Dropdown.Item>
                        </Dropdown.Menu>
                      </Dropdown>
                    ) : item.path ? (
                      <Link
                        style={{ fontSize: 16, marginLeft: 15 }}
                        to={item?.path}
                      >
                        {item?.label}
                      </Link>
                    ) : (
                      <Link
                        style={{
                          fontSize: 16,
                          marginLeft: 15,
                          cursor: 'pointer',
                        }}
                        s
                        onClick={() => {
                          Toast.success('Coming Soon...');
                        }}
                      >
                        {item.label}
                      </Link>
                    )}
                  </li>
                ))}
            </ul>
          </div>
        </div>
      </Fade>
    </>
  );
}

export default Employernavbar;
