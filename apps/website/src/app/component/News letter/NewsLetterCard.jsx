import * as React from 'react';
import Card from '@mui/material/Card';
import CardActions from '@mui/material/CardActions';
import Grid from '@mui/material/Grid';
import Paper from '@mui/material/Paper';
import Typography from '@mui/material/Typography';
import { styled } from '@mui/material/styles';
import CustomButton from '../Button/CustomButton';
import Toast from '../Toast/Toast';
import styles from './GettingStart.module.css';

const Item = styled(Paper)(({ theme }) => ({
  padding: theme.spacing(2),
  textAlign: 'center',
  background: 'transparent',
  boxShadow: 'none',
  display: 'flex',
  justifyContent: 'center',
  flexDirection: 'column',
  width: '90%',
}));

export default function NewsLetterCard() {
  const data = [
    {
      id: 1,
      img: (
        <img
          src="https://img.freepik.com/free-photo/hand-showing-growth-graph_1232-147.jpg?t=st=1709070086~exp=1709073686~hmac=cbc65e81e2b520565bc9ad56d625132d0499d0ffd0f548672e208b154c0a241a&w=826"
          loading="lazy"
          alt=""
          width="100%"
          className={styles.zoomimg}
        />
      ),
      date: ' August 31, 2021 • 12 Comment',
      title: ' Attract Sales And Profits',
      description:
        'A job ravenously while Far much that one rank beheld after outside....',
      readmore: 'Read More',
    },
    {
      id: 2,
      img: (
        <img
          src="https://img.freepik.com/free-vector/business-brainstorm-composition-with-indoor-office-scenery-human-characters-coworkers-discussing-ideas-holding-papers-vector-illustration_1284-72675.jpg?t=st=1709070615~exp=1709074215~hmac=24aa46d9e5dde23c06c375c021d34295860994bcd53ae4b7f4f665b3960fae39&w=826"
          loading="lazy"
          alt=""
          width="100%"
          className={styles.zoomimg}
        />
      ),
      date: ' August 3, 2023 • 8 Comment',
      title: ' Jobs and Skills',
      description:
        'A job ravenously while Far much that one rank beheld after outside....',
      readmore: 'Read More',
    },
    {
      id: 3,
      img: (
        <img
          src="https://img.freepik.com/free-photo/journalism-concept-live-news-3d-renderind-background_460848-10719.jpg?t=st=1709070769~exp=1709074369~hmac=361886984a584be9c7d550e234e0c8b1e1463da789bfd1eb5abf1decd2ad3a05&w=826"
          loading="lazy"
          alt=""
          width="100%"
          className={styles.zoomimg}
        />
      ),
      date: ' August 23, 2022 • 5 Comment',
      title: ' Daily News',
      description:
        'A job ravenously while Far much that one rank beheld after outside....',
      readmore: 'Read More',
    },
  ];

  return (
    <div className={styles.warapper}>
      <div>
        <div className={styles.sectitle}>
          <h2>Recent New Blogs</h2>
          <div className={styles.text}>
            Stay informed with the latest happenings. Explore insightful blogs
            and updates that cover a diverse range of topics to keep you engaged
            and well-informed.
          </div>
        </div>
      </div>
      <Grid
        container
        spacing={0}
        columns={{ xs: 4, sm: 8, md: 12 }}
        sx={{
          display: 'flex',
          justifyContent: 'center',
        }}
      >
        {data &&
          data?.map((item) => (
            <Grid sx={{ padding: '1%' }} xs={12} sm={6} md={4} key={item.id}>
              <Card sx={{ marginBottom: '4%' }}>
                <Item style={{ width: '100%', padding: 10 }}>
                  <CardActions className={styles.imgBox}>
                    {item.img}
                  </CardActions>
                  <CardActions className="text-center">
                    <Typography
                      sx={{
                        textAlign: 'start',
                        marginBottom: '2%',
                        fontSize: '13px',
                      }}
                      gutterBottom
                    >
                      {item.date}
                    </Typography>
                  </CardActions>
                  <CardActions>
                    <Typography
                      sx={{
                        fontSize: '19px',
                        fontWeight: '500',
                        color: 'var(--black)',
                      }}
                      gutterBottom
                    >
                      {item.title}
                    </Typography>
                  </CardActions>
                  <CardActions>
                    <Typography
                      variant="body2"
                      sx={{
                        textAlign: 'start',
                        marginBottom: '2%',
                        fontFamily: 'sans-serif',
                        fontSize: '12px',
                      }}
                    >
                      {item.description}
                    </Typography>
                  </CardActions>
                  <CardActions>
                    <CustomButton
                      onClick={() => {
                        Toast.success('Coming Soon..');
                      }}
                      label={item.readmore}
                    />
                  </CardActions>
                </Item>
              </Card>
            </Grid>
          ))}
      </Grid>
    </div>
  );
}
