import * as React from 'react';
import { styled } from '@mui/material/styles';
import Grid from '@mui/material/Grid';
import Paper from '@mui/material/Paper';
import Typography from '@mui/material/Typography';
import ButtonBase from '@mui/material/ButtonBase';
import image from './annaouncement.png';
import Button from '@mui/material/Button';

import CardMedia from '@mui/material/CardMedia';
const Img = styled('img')({
  margin: 'auto',
  display: 'block',
  maxWidth: '100%',
  maxHeight: '100%',
});

export default function ComplexGrid() {
  return (
    <Paper
      sx={{
        p: 2,
        margin: '2%',

        flexGrow: 1,
        backgroundColor: (theme) =>
          theme.palette.mode === 'dark'
            ? 'var(--dark-shade-black)'
            : 'var(--white-color)',
      }}
    >
      <Grid
        container
        sx={{ display: 'flex', justifyContent: 'center', padding: '2%' }}
        spacing={4}
      >
        <Grid
          item
          sx={{ width: '100%', padding: '50px 50px 10px' }}
          sm
          container
        >
          <Grid item xs container direction="column" spacing={2}>
            <Grid item xs>
              <Typography gutterBottom variant="subtitle1" component="div">
                Recruiting?
              </Typography>
              <Typography
                sx={{
                  textAlign: 'start',
                  width: '40%',
                  marginBottom: '2%',
                  fontFamily: 'sans-serif',
                  fontSize: '15px',
                }}
                gutterBottom
              >
                Advertise your jobs to millions of monthly users and search 15.8
                million CVs in our database.
              </Typography>
              <Typography variant="body2" color="text.secondary"></Typography>

              <Button
                variant="contained"
                sx={{ marginTop: 'auto', background: 'var(--primary-color)' }}
              >
                Start Recruiting
              </Button>
            </Grid>
          </Grid>
        </Grid>
        <Grid item>
          <ButtonBase sx={{ width: 150, height: 150 }}>
            <CardMedia
              component="img"
              height="50"
              image={image}
              alt="Paella dish"
              sx={{ textAlign: 'center' }}
            />
          </ButtonBase>
        </Grid>
      </Grid>
    </Paper>
  );
}
