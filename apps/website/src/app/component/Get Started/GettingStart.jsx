import Box from '@mui/material/Box';
import CardMedia from '@mui/material/CardMedia';
import Divider from '@mui/material/Divider';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import Paper from '@mui/material/Paper';
import Typography from '@mui/material/Typography';
import Grid from '@mui/material/Unstable_Grid2';
import { styled } from '@mui/material/styles';
import * as React from 'react';
import { IoMdCheckmark } from 'react-icons/io';
import image from './image.png';

import { Container } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import CustomButton from '../Button/CustomButton';
import Toast from '../Toast/Toast';
import styles from './GetStart.module.css';

const Item = styled(Paper)(({ theme }) => ({
  padding: theme.spacing(1),
  textAlign: 'center',
  background: 'transparent',
  boxShadow: 'none',
  display: 'flex',
  justifyContent: 'center',
  flexDirection: 'column',
}));
const factsData = [
  {
    value: 4,
    unit: 'M',
    title: '4 million daily active users',
  },
  {
    value: 12,
    unit: 'k',
    title: 'Over 12k open job positions',
  },
  {
    value: 20,
    unit: 'M',
    title: 'Over 20 million stories shared',
  },
];
export default function RowAndColumnSpacing() {
  const navigate = useNavigate();
  const handleFindJobs = () => {
    navigate('/findJobs');
  };
  return (
    <>
      <Box className={styles.mainBox}>
        <Grid container rowSpacing={1} columnSpacing={{ xs: 1, sm: 2, md: 3 }}>
          <Grid item xs={12} sm={12} md={6}>
            <Item>
              <CardMedia
                component="img"
                image={image}
                alt="Paella dish"
                className={styles.getstartedImg}
              />
            </Item>
          </Grid>
          <Grid
            item
            xs={12}
            sm={12}
            md={6}
            sx={{ padding: '0 2%', display: 'flex' }}
          >
            <Item>
              <Typography
                level="5"
                sx={{
                  textAlign: 'start',
                  marginBottom: '2%',
                  fontSize: '24px',
                  color: 'var(--black)',
                }}
              >
                Millions of Jobs. Find the one that suits you.
              </Typography>
              <Typography
                level="title-md"
                sx={{
                  textAlign: 'start',
                  marginBottom: '2%',
                  fontSize: '18px',
                }}
              >
                Search all the open positions on the web. Get your own
                personalized salary estimate. Read reviews on over 600,000
                companies worldwide.
              </Typography>
              <Divider inset="none" />
              <List
                size="sm"
                sx={{
                  mx: 'calc(-1 * var(--ListItem-paddingX))',
                  marginBottom: '2%',
                }}
              >
                <ListItem className={styles.ListItem}>
                  <IoMdCheckmark
                    style={{ marginRight: '2%', fontSize: '1.4rem' }}
                  />
                  Contribute to mutual success and thriving
                </ListItem>
                <ListItem className={styles.ListItem}>
                  <IoMdCheckmark
                    style={{ marginRight: '2%', fontSize: '1.4rem' }}
                  />
                  Seize readily available opportunities for recognition
                </ListItem>
                <ListItem className={styles.ListItem}>
                  <IoMdCheckmark
                    style={{ marginRight: '2%', fontSize: '1.4rem' }}
                  />
                  Let me clarify the intricacies of this endeavor
                </ListItem>
              </List>
              <Box sx={{ display: 'flex', gap: 2, flexWrap: 'wrap' }}>
                <CustomButton onClick={handleFindJobs} label={'Get Started'} />
                {/* </CustomButton> */}
              </Box>
            </Item>
          </Grid>
          <Box className="fun-fact-section"></Box>
        </Grid>
        {/* <Container className={styles["row"]}>
          <Grid sx={{}} container spacing={2}>
            {factsData &&
              factsData.map((fact, index) => (
                <Grid
                  key={index}
                  item
                  xs={12}
                  sm={6}
                  md={4}
                  className="aos-init aos-animate my-4"
                  data-aos="fade-up"
                  data-aos-delay={index * 100}
                >
                  <Box className={styles["count-box"]}>
                    <div>
                      <span>{fact.value}</span>
                      {fact.unit}
                    </div>
                  </Box>
                  <h5 className={styles["counter-title"]}>{fact.title}</h5>
                </Grid>
              ))}
          </Grid>
        </Container> */}
      </Box>
      <hr className="mx-5" />
    </>
  );
}
