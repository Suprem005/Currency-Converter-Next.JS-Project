'use client';
import {
  Button,
  ButtonGroup,
  FormControl,
  InputLabel,
  MenuItem,
  Select,
  TextField,
  Typography,
} from '@mui/material';
import { Box, flex } from '@mui/system';
import React, { useEffect, useState } from 'react';
import HistoryIcon from '@mui/icons-material/History';
import { useRouter } from 'next/navigation';
import axios from 'axios';
import $axios from '@/lib/axios.instance';
import CurrencyTrendChart from '@/components/CurrencyTrendChart';
import { fetchCurrency } from '@/utils/fetchCurrency';
import { Formik } from 'formik';
import { DateField, LocalizationProvider } from '@mui/x-date-pickers';
import { DemoContainer } from '@mui/x-date-pickers/internals/demo';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import dayjs from 'dayjs';
import { useMutation } from '@tanstack/react-query';
import Hello from '../page';

const Dashboard = () => {
  //* Setting states: done
  const router = useRouter();
  const [base, setBase] = useState('');
  const [target, setTarget] = useState('');
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [currencyCode, setCurrencyCode] = useState([]);

  // * currency code fetched and state is set: done
  useEffect(() => {
    const fetchCurrencies = async () => {
      const data = await fetchCurrency();
      setCurrencyCode(data);
    };
    fetchCurrencies();
  }, []);

  const { isPending, error, mutate } = useMutation({
    mutationKey: ['chart-data'],
    mutationFn: async ({ from, to, baseDate, targetDate }) => {
      const formattedStartDate = baseDate?.format('YYYY-MM-DD');
      const formattedEndDate = targetDate?.format('YYYY-MM-DD');

      return {
        base: from,
        target: to,
        startingDate: formattedStartDate,
        endingDate: formattedEndDate,
      };
    },
    onSuccess: ({ base, target, startingDate, endingDate }) => {
      setBase(base);
      setTarget(target);
      setStartDate(startingDate);
      setEndDate(endingDate);
    },
  });

  return (
    <>
      <Box className='flex flex-col flex-wrap mt-8 max-h-[400px]'>
        {/* {isPending && <LinearProgress color='secondary' />} */}
        <Formik
          initialValues={{
            from: '',
            to: '',
            baseDate: dayjs('2022-01-01'),
            targetDate: dayjs('2023-01-01'),
          }}
          onSubmit={(values) => {
            mutate(values);
          }}
        >
          {(formik) => {
            return (
              <Box className='flex flex-wrap flex-col m-8'>
                <div>
                  <p className='flex flex-col  text-2xl pb-3'>
                    Currency Exchange Rate Analysis
                  </p>
                </div>
                <div>
                  <form
                    onSubmit={formik.handleSubmit}
                    className='flex flex-col justify-between  max-w-full h-[400px] max-h-full p-6 gap-2'
                  >
                    <FormControl fullWidth>
                      <InputLabel>From</InputLabel>
                      <Select label='From' {...formik.getFieldProps('from')}>
                        {Object.entries(currencyCode).map(([code, name]) => {
                          return (
                            <MenuItem key={code} value={code}>
                              {code}:{name}
                            </MenuItem>
                          );
                        })}
                      </Select>
                    </FormControl>

                    <FormControl fullWidth>
                      <InputLabel>To</InputLabel>
                      <Select label='To' {...formik.getFieldProps('to')}>
                        {
                          //* this is for the country code and its name , also individual just change the value field
                          Object.entries(currencyCode).map(([code, name]) => {
                            return (
                              <MenuItem key={code} value={code}>
                                {code}:{name}
                              </MenuItem>
                            );
                          })
                        }
                      </Select>
                    </FormControl>

                    <FormControl>
                      <LocalizationProvider dateAdapter={AdapterDayjs}>
                        <DemoContainer components={['DateField', 'DateField']}>
                          <DateField
                            label='Start Date'
                            value={formik.values.baseDate}
                            onChange={(newValue) =>
                              formik.setFieldValue('baseDate', newValue)
                            }
                          />
                          <DateField
                            label='End Date'
                            value={formik.values.targetDate}
                            onChange={(newValue) =>
                              formik.setFieldValue('targetDate', newValue)
                            }
                          />
                        </DemoContainer>
                      </LocalizationProvider>
                    </FormControl>
                    <Button
                      size='small'
                      type='submit'
                      variant='contained'
                      color='primary'
                    >
                      Analyze
                    </Button>
                    {base && target && startDate && endDate && (
                      <CurrencyTrendChart
                        base={base}
                        target={target}
                        startDate={startDate}
                        endDate={endDate}
                      />
                    )}
                  </form>
                </div>
              </Box>
            );
          }}
        </Formik>
      </Box>
    </>
  );
};

export default Dashboard;
