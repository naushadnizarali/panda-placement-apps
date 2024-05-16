import * as React from 'react';
import { styled } from '@mui/material/styles';
import Box from '@mui/material/Box';
import Paper from '@mui/material/Paper';
import Typography from '@mui/material/Typography';
import CardMedia from '@mui/material/CardMedia';
import image from './annaouncement.png';
import Button from '@mui/material/Button';

const Item = styled(Paper)(({ theme }) => ({
  backgroundColor:
    theme.palette.mode === 'dark'
      ? 'var(--dark-shade-black)'
      : 'var(--white-color)',
  ...theme.typography.body2,
  padding: theme.spacing(1),
  //   textAlign: 'center',
  color: theme.palette.text.secondary,
}));

export default function CSSGrid() {
  return (
    <Box sx={{ width: 1, padding: '15px' }}>
      <Box sx={{ padding: '50px 60px 10px' }}>
        <Box>
          <Item sx={{ marginBottom: '50px' }}>
            <Typography
              level="h1"
              sx={{
                textAlign: 'start',
                marginBottom: '2%',
                fontFamily: 'sans-serif',
                lineHeight: '1.2rem',
                fontWeight: '500',
                fontSize: '30px',
              }}
            >
              Rescruiting?
            </Typography>
            <Typography
              level="title-md"
              sx={{
                textAlign: 'start',
                marginBottom: '2%',
                marginTop: '15px',
                lineHeight: '26px',
                fontWeight: '400',
                display: 'block',
                fontFamily: 'sans-serif',
                fontSize: '15px',
              }}
            >
              {' '}
              Get your own personalized salary estimate. Read reviews on over
              600,000 companies worldwide.
            </Typography>
            <Button variant="contained">Start Rescruiting Now</Button>

            <CardMedia
              component="img"
              // height="50"
              image={image}
              alt="Paella dish"
              // sx={{textAlign:'center', width: '100%', padding:'0 2%', height: '70vh'}}
            />
          </Item>
        </Box>
      </Box>
    </Box>
  );
}
