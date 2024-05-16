import Logout from '@mui/icons-material/Logout';
import NotificationsNoneIcon from '@mui/icons-material/NotificationsNone';
import PersonAdd from '@mui/icons-material/PersonAdd';
import Avatar from '@mui/material/Avatar';
import Badge from '@mui/material/Badge';
import Box from '@mui/material/Box';
import Divider from '@mui/material/Divider';
import IconButton from '@mui/material/IconButton';
import ListItemIcon from '@mui/material/ListItemIcon';
import Menu from '@mui/material/Menu';
import MenuItem from '@mui/material/MenuItem';
import Tooltip from '@mui/material/Tooltip';
import Typography from '@mui/material/Typography';
import * as React from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { Link, useNavigate } from 'react-router-dom';
import OffCanvasExample from '../FilterSidebar/FilterSidebar';
import NotificationMessage from '../NotificationMessage/NotificationMessage';
import DefaultImage from '../../../assets/defaultImage.webp';
import { logoutEmployer } from '../../../redux/slice/EmployerLoginSlice';
import { useEffect } from 'react';
import { useState } from 'react';
// import { driver } from "driver.js";
// import "driver.js/dist/driver.css";
export default function AccountMenu() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [unseenNotification, setUnseenNotification] = useState(null);
  const data = useSelector((state) => state?.employerProfile?.data);
  const allNotification = useSelector((state) => state?.Allnotification?.data);
  const [anchorEl, setAnchorEl] = React.useState(null);
  const open = Boolean(anchorEl);

  const handleClick = (event) => {
    if (anchorEl) {
      setAnchorEl(null);
    } else {
      setAnchorEl(event.currentTarget);
    }
  };
  // const driverObj = driver();
  // driverObj.highlight({
  //   element: "#some-element",
  //   popover: {
  //     title: "Notifications",
  //     description: "Click TO see the Notification",
  //   },
  // });
  const handleClose = () => {
    setAnchorEl(null);
  };

  const handleLogout = async () => {
    dispatch(logoutEmployer());
    await localStorage.removeItem('emptoken');
    await localStorage.removeItem('activeMenuItem');
    navigate('/employer/login');
  };

  useEffect(() => {
    const unseenNotification = allNotification?.filter(
      (item) => item?.is_seen === false
    );
    setUnseenNotification(unseenNotification);
  }, [allNotification]);

  return (
    <React.Fragment>
      <Tooltip
        title="Account settings"
        style={{
          display: 'flex',
          alignItems: 'center',
        }}
      >
        <OffCanvasExample
          name="Your Notifications"
          icons={
            <Badge
              sx={{ mr: 6, cursor: 'pointer' }}
              color="primary"
              badgeContent={
                unseenNotification?.length === 0
                  ? '0'
                  : unseenNotification?.length
              }
            >
              <NotificationsNoneIcon />
            </Badge>
          }
          className="float-endnpm sa"
        >
          {/* NOTE:ALL Notifications Display  */}
          <Box>
            <NotificationMessage data={allNotification} />
          </Box>
        </OffCanvasExample>
        <Typography
          style={{ marginRight: -10, color: 'var(--black)' }}
          className="hidden sm:block"
        >
          Welcome {data?.email ?? 'Employer Email'}
        </Typography>
        <IconButton
          onClick={handleClick}
          size="small"
          sx={{ ml: 2 }}
          aria-controls={open ? 'account-menu' : undefined}
          aria-haspopup="true"
          aria-expanded={open ? 'true' : undefined}
        >
          <Avatar
            src={data?.image ? data?.image : DefaultImage}
            style={{
              backgroundColor: 'var',
            }}
            sx={{ width: 50, height: 50 }}
          />
        </IconButton>
      </Tooltip>
      <Menu
        anchorEl={anchorEl}
        id="account-menu"
        open={open}
        onClose={handleClose}
        onClick={handleClose}
        PaperProps={{
          elevation: 0,
          sx: {
            overflow: 'visible',
            filter: 'drop-shadow(0px 2px 8px rgba(0,0,0,0.32))',
            mt: 1,
            '& .MuiAvatar-root': {
              width: 32,
              height: 32,
              ml: -0.5,
            },
            '&::before': {
              content: '""',
              display: 'block',
              position: 'absolute',
              top: 0,
              right: 14,
              width: 10,
              height: 10,
              bgcolor: 'background.paper',
              transform: 'translateY(-50%) rotate(45deg)',
              zIndex: 0,
            },
          },
        }}
        transformOrigin={{ horizontal: 'right', vertical: 'top' }}
        anchorOrigin={{ horizontal: 'right', vertical: 'bottom' }}
      >
        <Link
          style={{ textDecoration: 'none', color: 'black' }}
          to="/employer/profile"
        >
          <MenuItem>
            <Avatar src={data?.image ? data?.image : DefaultImage} />{' '}
            {'Your Profile'}
          </MenuItem>
        </Link>
        <Divider />
        <MenuItem onClick={handleClose}>
          <Link
            to="/employer/change-password"
            style={{
              textDecoration: 'none',
              display: 'flex',
              alignItems: 'center',
              color: 'var(--black)',
            }}
          >
            <ListItemIcon>
              <PersonAdd fontSize="small" />
            </ListItemIcon>
            Change Password
          </Link>
        </MenuItem>
        <MenuItem onClick={handleLogout}>
          <ListItemIcon>
            <Logout fontSize="small" />
          </ListItemIcon>
          Logout
        </MenuItem>
      </Menu>
    </React.Fragment>
  );
}
