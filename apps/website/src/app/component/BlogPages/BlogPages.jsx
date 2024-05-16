import ButtonBase from '@mui/material/ButtonBase';
import Grid from '@mui/material/Grid';
import Paper from '@mui/material/Paper';
import Typography from '@mui/material/Typography';
import { styled } from '@mui/material/styles';
import React, { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import JobDescriptionComponent from '../JobDescription/JobDescriptionComponent';
import styles from './BlogPages.module.css';
import { formatDate } from '../../Helpers/FormatDate';

const Img = styled('img')({
  margin: 'auto',
  display: 'block',
  maxWidth: '100%',
  maxHeight: '100%',
});

const BlogPages = () => {
  const navigate = useNavigate();
  const isAuthenticated = useSelector(
    (state) => state.loginuser.isAuthenticated,
  );
  const SingleData1 = useSelector((state) => state.blogpages.eventData);
  const AllData = useSelector((state) => state.allblogdata.allData);
  const [SingleData, setSingleData] = useState(SingleData1);

  const RemainingData = () => {
    const slicedData = AllData.filter((blog) => {
      return SingleData.id !== blog.id;
    });
    return slicedData;
  };
  const formattedDate = new Date(SingleData.created_time).toLocaleString();
  // console.log(SingleData)
  const stringtojson = (stringg) => {
    const response = JSON.parse(stringg);
    return response;
  };

  const RecentPost = (item) => {
    setSingleData(item);
    if (isAuthenticated) {
      navigate(`/blogs/${item.slug}`);
    } else {
      navigate(`/blogs/${item.slug}`);
    }
  };

  useEffect(() => {
    window.scrollTo(0, 0); // Scroll to the top when the component mounts
  }, []);

  return (
    <>
      <div className={styles.Header}>
        <div
          className={styles.HeaderBackgroundImage}
          style={{ backgroundImage: `url(${SingleData.image})` }}
        >
          <div className={styles.overlay}></div>
          <div className={styles.contentWraper}>
            <div className={styles.ButtonsStyling}>
              <button className={styles.MainButtons}>JavaScript</button>
              <p className={styles.paragraphs}>
                {formatDate(SingleData?.created_time)}
              </p>
            </div>
            <p className={styles.DownPara}>
              {/* Ask HN: Does Anybody Still Use JQuery? */}
              {SingleData.title}
            </p>
          </div>
        </div>
        <div className={styles.MainDiv}>
          <div className={styles.RightSide}>
            <h1>{SingleData.title}</h1>
            <div className={styles.RightDesc}>
              <JobDescriptionComponent
                isblog={true}
                description={stringtojson(SingleData?.description)?.desc}
              />
            </div>
          </div>

          <div className={styles.LeftSides}>
            <p>
              <h1 className={styles.ledtsideheading}>Most Read</h1>
              <div>
                {RemainingData() &&
                  RemainingData().map((item) => (
                    <Paper
                      sx={{
                        p: 2,
                        margin: 'auto',
                        maxWidth: 700,
                        flexGrow: 1,
                        backgroundColor: (theme) =>
                          theme.palette.mode === 'dark' ? '#1A2027' : '#fff',
                      }}
                      className={styles.papers}
                      elevation={0}
                    >
                      <Grid
                        container
                        spacing={2}
                        className={styles.MostReadBox}
                      >
                        <Grid item sx={{ width: 128, height: 100, padding: 0 }}>
                          <Img
                            alt="complex"
                            src={item.image}
                            className={styles.smallblogcardsimages}
                          />
                        </Grid>
                        <Grid
                          item
                          xs={12}
                          sm
                          container
                          className={styles.MainGrid}
                        >
                          <Grid
                            item
                            xs
                            container
                            direction="column"
                            spacing={2}
                            className={styles.MainContentGrid}
                          >
                            <Grid item xs className={styles.ContentGrid}>
                              <Typography
                                variant="body2"
                                gutterBottom
                                className={styles.ContentDetails}
                              >
                                <a onClick={() => RecentPost(item)}>
                                  {item.title}
                                </a>
                              </Typography>
                            </Grid>
                          </Grid>
                        </Grid>
                      </Grid>
                    </Paper>
                  ))}
              </div>
            </p>
          </div>
        </div>
      </div>
    </>
  );
};

export default BlogPages;
