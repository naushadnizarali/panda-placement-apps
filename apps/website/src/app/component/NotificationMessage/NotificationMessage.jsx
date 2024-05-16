import CircleIcon from '@mui/icons-material/Circle';
import Divider from '@mui/material/Divider';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemAvatar from '@mui/material/ListItemAvatar';
import ListItemText from '@mui/material/ListItemText';
import Typography from '@mui/material/Typography';
import * as React from 'react';
import style from './NotificationMessage.module.css';
import { Link, useNavigate } from 'react-router-dom';
import EmployerAPIS from '../../Apis/EmployerApi';
import Toast from '../Toast/Toast';

export default function NotificationMessage({ data }) {
  const navigate = useNavigate();
  const employerapi = EmployerAPIS();

  const handleRouteToApplicant = async (id, action) => {
    try {
      const newAction = action.replace('https://pandaplacement.com/', '');
      const response = await employerapi.singleViewEmployerNotification(id);
      navigate('../' + newAction);
    } catch (error) {
      console.error('error' + error);
    }
  };
  // const sortedDatabyseen = [...data].sort((a, b) => (a.is_seen === b.is_seen ? 0 : a.is_seen ? 1 : -1));
  const sortedData = newFunction(data);

  return (
    <List
      sx={{
        width: '100%',
        bgcolor: 'background.paper',
      }}
    >
      {sortedData?.length > 0 ? (
        sortedData.map((e, i) => (
          <React.Fragment key={i}>
            <Link
              // to={e.action}
              className={style.link}
            >
              <ListItem
                onClick={() => handleRouteToApplicant(e.id, e.action)}
                className={style.notification__item}
                sx={{
                  bgcolor: !e?.is_seen ? 'var(--light-shade-grayish-blue)' : '',
                  alignItems: 'center',
                  cursor: 'pointer',
                }}
              >
                <ListItemAvatar>
                  <CircleIcon
                    style={{
                      color: e.is_seen ? 'var(--gray)' : 'var(--bright-blue)',
                    }}
                    fontSize="small"
                  />
                </ListItemAvatar>
                <ListItemText
                  className={style.ListItemText}
                  primary={e?.title ?? '---'}
                  secondary={
                    <React.Fragment>{e?.message ?? '---'}</React.Fragment>
                  }
                />
              </ListItem>
            </Link>
            <Divider sx={{ my: 1 }} />
          </React.Fragment>
        ))
      ) : (
        <Typography
          sx={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            height: '50vh',
          }}
        >
          No Notifications Available
        </Typography>
      )}
    </List>
  );
}
function newFunction(data) {
  const truedata = [...data].filter((item) => item.is_seen === true);
  const falsedata = [...data].filter((item) => item.is_seen === false);

  const sortedTrueData = [...truedata].sort((a, b) => b.id - a.id);
  const sortedData = [...falsedata, ...sortedTrueData];
  return sortedData;
}
