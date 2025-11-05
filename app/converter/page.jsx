'use client';
import { fetchCurrency } from '@/utils/fetchCurrency';
import {
  Box,
  Button,
  FormControl,
  InputLabel,
  LinearProgress,
  MenuItem,
  Select,
  TextField,
  Typography,
} from '@mui/material';
import { useMutation } from '@tanstack/react-query';

import { Formik } from 'formik';
import { useEffect, useState } from 'react';

const Converter = () => {
  const [convertCurrency, setConvertCurrency] = useState(null);
  const [currencyCode, setCurrencyCode] = useState([]);

  // fetching currency code and setting currencyCode

  useEffect(() => {
    const fetchCurrencies = async () => {
      const data = await fetchCurrency();
      console.log(data);
      setCurrencyCode(data);
    };
    fetchCurrencies();
  }, []);

  const { isPending, error, mutate } = useMutation({
    mutationKey: ['convert-currencies'],
    mutationFn: async ({ from, to, amount }) => {
      try {
        const res = await fetch(
          `https://api.frankfurter.dev/v1/latest?base=${from}&symbols=${to}`
        );

        const data = await res.json();
        const rates = data.rates[to];
        const convertedAmount = amount * rates.toFixed(5);
        setConvertCurrency(convertedAmount);
        return { from, to, amount, convertedAmount };
      } catch (error) {
        console.log('Failed to fetch rates!');
      }
    },
    onSuccess: (conversionData) => {
      // const { from, to, amount, convertedAmount } = conversionData;
      // local storage code from here
      const existing =
        JSON.parse(localStorage.getItem('conversionHistory')) || [];

      const updated = [...existing, conversionData];
      localStorage.setItem('conversionHistory', JSON.stringify(updated));
    },
  });

  return (
    <Box>
      {isPending && <LinearProgress color='secondary' />}
      <Formik
        initialValues={{
          amount: 0,
          from: '',
          to: '',
        }}
        onSubmit={(values) => {
          mutate(values);
        }}
      >
        {(formik) => {
          return (
            <form
              onSubmit={formik.handleSubmit}
              className='flex flex-col justify-between items-center max-w-[400px] min-h-[400px] shadow-2xl p-8'
            >
              <p className='text-6xl pb-4'>CurVert:)</p>
              <FormControl fullWidth>
                <TextField
                  type='number'
                  label='Enter amount'
                  {...formik.getFieldProps('amount')}
                />
              </FormControl>

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
                    //! this is for the country code and its name , also individual just change the value field
                    Object.entries(currencyCode).map(([code, name]) => {
                      return (
                        <MenuItem key={code} value={code}>
                          {code}:{name}
                        </MenuItem>
                      );
                    })
                  }
                  {/* //!this is for the country code only, test fro setting country code only from api 
                  {currencyCode.map((item) => {
                    return (
                      <MenuItem key={item} value={item}>
                        {item}
                      </MenuItem>
                    );
                  })}*/}
                </Select>
              </FormControl>

              <FormControl fullWidth>
                <Typography>{convertCurrency}</Typography>
              </FormControl>

              <Button
                fullWidth
                type='submit'
                variant='contained'
                color='primary'
              >
                Convert
              </Button>
            </form>
          );
        }}
      </Formik>
    </Box>
  );
};

export default Converter;
