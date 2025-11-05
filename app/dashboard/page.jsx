'use client';
import { Button, ButtonGroup, Typography } from '@mui/material';
import { Box } from '@mui/system';
import React from 'react';
import HistoryIcon from '@mui/icons-material/History';
import { useRouter } from 'next/navigation';
const Dashboard = () => {
  const router = useRouter();
  return (
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
  );
};

export default Dashboard;
