import { Box, Button, ButtonGroup, Typography } from '@mui/material';
import { useRouter } from 'next/navigation';
import React from 'react';
import Dashboard from '../dashboard/page';

const Home = () => {
  const router = useRouter();
  return (
    <div>
      <Box className='flex flex-wrap flex-col p-6 gap-8'>
        <div className='flex flex-row justify-between'>
          <Typography fontFamily={'monospace'} variant='h1'>
            CurVert:)
          </Typography>
          <ButtonGroup className='flex justify-end'>
            <Button
              variant='text'
              onClick={() => {
                router.push('/converter');
              }}
            >
              Convert
            </Button>
            <Button
              variant='text'
              onClick={() => {
                router.push('/history');
              }}
            >
              History
            </Button>
          </ButtonGroup>
        </div>
      </Box>
      <Box>
        <Dashboard />
      </Box>
    </div>
  );
};

export default Home;
