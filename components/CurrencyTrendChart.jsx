import $axios from '@/lib/axios.instance';
import { useEffect, useState } from 'react';
import {
  Area,
  AreaChart,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts';

const CurrencyTrendChart = ({
  base = 'USD',
  target = 'AUD',
  startDate,
  endDate,
}) => {
  //* setting state

  const [data, setData] = useState([]);

  //* fetching the data for chart

  useEffect(() => {
    const fetchRates = async () => {
      try {
        const start = startDate || '2023-01-01';
        // //* returns string of date and time and splits date and time and store it in array as a pair and [0] takes the first pair(i.e date) of split result
        const end = endDate || new Date().toISOString().split('T')[0];
        const { data } = await $axios.get(
          `/${start}..${end}?from=${base}&to=${target}`
        ); //!edited

        // * as chart data takes data: [{date:'2000-01-01', rate: 1.05},{..}]
        const formatData = Object.entries(data.rates).map(([date, rate]) => ({
          date: date,
          rate: rate[target],
        }));

        setData(formatData);
      } catch (error) {
        return console.log('Error fetching exchange rates:', error);
      }
    };
    fetchRates();
  }, [base, target, startDate, endDate]);

  //*     rendering chart

  return (
    <div className='m-9'>
      {data.length > 0 ? (
        <ResponsiveContainer width='100%' height={400}>
          <AreaChart
            data={data}
            style={{ maxWidth: '0.9', maxHeight: '70vh', aspectRatio: 1.618 }}
            margin={{ top: 20, right: 0, left: 0, bottom: 0 }}
          >
            <CartesianGrid strokeDasharray='3 3' />
            <XAxis dataKey='date' fontSize={10} />
            <YAxis width='auto' />
            <Tooltip />
            <Area
              type='monotone'
              dataKey='rate'
              stroke='#8884d8'
              fill='#8884d8'
            />
          </AreaChart>
        </ResponsiveContainer>
      ) : (
        <p>No data available for selected range.</p>
      )}
    </div>
  );
};

export default CurrencyTrendChart;
