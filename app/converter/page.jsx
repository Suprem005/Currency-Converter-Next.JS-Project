'use client';
import { fetchCurrency } from '@/utils/fetchCurrency';
import {
  Box,
  Button,
  ButtonGroup,
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
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';

const Converter = () => {
  const router = useRouter();
  const [base, setBase] = useState('');
  const [target, setTarget] = useState('');
  const [convertCurrency, setConvertCurrency] = useState(null);
  const [currencyCode, setCurrencyCode] = useState([]);

  // fetching currency code and setting currencyCode

  useEffect(() => {
    const fetchCurrencies = async () => {
      const data = await fetchCurrency();

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
        const convertedAmount = amount * rates;
        setConvertCurrency(convertedAmount.toFixed(2));
        setBase(from);
        setTarget(to);
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
                router.push('/');
              }}
            >
              Home
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
      <Box className='flex flex-col flex-wrap mt-8 max-h-[400px]'>
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
              <Box className='flex flex-wrap flex-col m-8'>
                <div>
                  <p className='flex flex-col  text-2xl pb-3'>
                    Currency conversion
                  </p>
                </div>
                <div>
                  <form
                    onSubmit={formik.handleSubmit}
                    className='flex flex-col justify-between  max-w-full h-[400px] max-h-full p-6 gap-2'
                  >
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
                      <Typography>
                        Converted Amount:{convertCurrency}
                      </Typography>
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
                </div>
              </Box>
            );
          }}
        </Formik>
      </Box>
    </div>
  );
};

export default Converter;
