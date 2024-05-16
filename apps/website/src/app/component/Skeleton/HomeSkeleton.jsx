import * as React from 'react';
import Stack from '@mui/material/Stack';
import CustomSpinner from '../Spinner/Spinner';
function HomeSkeleton() {
  return (
    <Stack
      spacing={5}
      height={'100vh'}
      style={{
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
      }}
      width={'100%'}
    >
      <CustomSpinner width={70} height={70} />
    </Stack>
  );
}
export default HomeSkeleton;
