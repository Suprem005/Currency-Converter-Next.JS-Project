'use client';
import {
  Box,
  Button,
  ButtonGroup,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Typography,
} from '@mui/material';
import ClearOutlinedIcon from '@mui/icons-material/ClearOutlined';
import { useRouter } from 'next/navigation';

import React, { useEffect, useState } from 'react';

const History = () => {
  const router = useRouter();
  // *setting history array state
  const [history, setHistory] = useState([]);

  //* reading the local storage and saving it
  useEffect(() => {
    const savedHistory =
      JSON.parse(localStorage.getItem('conversionHistory')) || [];
    setHistory(savedHistory);
  }, []);

  //* handles deleting individual history
  const handleDelete = (index) => {
    const updated = [...history];
    updated.splice(index, 1);
    setHistory(updated);
    localStorage.setItem('conversionHistory', JSON.stringify(updated));
  };

  // * handles clear history from local storage
  const handleClearHistory = () => {
    localStorage.removeItem('conversionHistory');
    setHistory([]);
  };

  return (
    <Box className='flex flex-col p-6 gap-8'>
      <div className='flex flex-row justify-between'>
        <Typography variant='h4'>Saved Conversions</Typography>
        <ButtonGroup className='flex justify-end'>
          <Button
            variant='text'
            onClick={() => {
              router.push('/');
            }}
          >
            Home
          </Button>
          <Button variant='text' onClick={handleClearHistory}>
            clear history
          </Button>
        </ButtonGroup>
      </div>

      {history.length === 0 ? (
        <Typography>No saved conversions yet</Typography>
      ) : (
        <TableContainer>
          <Table sx={{ minWidth: 650 }} aria-label='simple table'>
            <TableHead>
              <TableRow>
                <TableCell align='right'>Amount</TableCell>
                <TableCell align='right'>From</TableCell>
                <TableCell align='right'>To</TableCell>
                <TableCell align='right'>Converted</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {history.map((item, index) => {
                if (!item || typeof item !== 'object') return null;
                return (
                  <TableRow
                    key={index}
                    sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
                  >
                    <TableCell align='right'>{item.amount}</TableCell>
                    <TableCell align='right'>{item.from}</TableCell>
                    <TableCell align='right'>{item.to}</TableCell>
                    <TableCell align='right'>{item.convertedAmount}</TableCell>

                    <TableCell align='right'>
                      <Button
                        variant='text'
                        color='error'
                        size='small'
                        endIcon={<ClearOutlinedIcon />}
                        onClick={() => handleDelete(index)}
                      ></Button>
                    </TableCell>
                  </TableRow>
                );
              })}
            </TableBody>
          </Table>
        </TableContainer>
      )}
    </Box>
  );
};

export default History;
