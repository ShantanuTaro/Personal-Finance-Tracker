import React, { useState, useEffect } from 'react';
import ApexCharts from 'react-apexcharts';
import { useSelector } from 'react-redux';
import useAxiosWithAuth from '../hooks/useAxiosWithAuth';

const IncomeExpenseGraphs = () => {
  const axios = useAxiosWithAuth();
  const { income, expenses, summaries } = useSelector((state) => state.finance);

  const [chartData, setChartData] = useState({
    series: [],
    categories: []
  });

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get('/api/summary/all');
        console.log(response)
        const summaries = response.data;

        const allMonths = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];
        
        // Initialize income and expense arrays with zeroes
        const incomeData = Array(12).fill(0);
        const expenseData = Array(12).fill(0);

        // Fill the income and expense arrays with the data fetched from API
        summaries.forEach(summary => {
          const monthIndex = allMonths.indexOf(summary.month);
          if (monthIndex !== -1) {
            incomeData[monthIndex] = summary.totalIncome;
            expenseData[monthIndex] = summary.totalExpenses;
          }
        });

        setChartData({
          series: [
            { name: 'Income', data: incomeData },
            { name: 'Expenses', data: expenseData }
          ],
          categories: allMonths
        });
      } catch (error) {
        console.error('Error fetching summary data:', error);
      }
    };

    fetchData();
  }, [income, expenses, summaries]);

  const chartOptions = {
    chart: {
      type: 'line',
      height: 240,
      toolbar: { show: false }
    },
    stroke: {
      curve: 'smooth',
      width: 2
    },
    xaxis: {
      categories: chartData.categories,
      labels: {
        style: {
          colors: '#616161',
          fontSize: '12px'
        }
      }
    },
    yaxis: {
      labels: {
        style: {
          colors: '#616161',
          fontSize: '12px'
        }
      }
    },
    grid: {
      borderColor: '#e2e8f0',
      strokeDashArray: 5
    },
    fill: {
      opacity: 0.8
    },
    tooltip: {
      theme: 'dark'
    }
  };

  return (
    <div className="relative flex flex-col rounded-xl bg-white text-gray-700 shadow-md p-6">
      <div className="relative mx-4 mt-4 flex flex-col gap-4">
        <div className="w-max rounded-lg bg-gray-900 p-5 text-white">
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" className="h-6 w-6">
            <path strokeLinecap="round" strokeLinejoin="round" d="M6.429 9.75L2.25 12l4.179 2.25m0-4.5l5.571 3 5.571-3m-11.142 0L2.25 7.5 12 2.25l9.75 5.25-4.179 2.25m0 0L21.75 12l-4.179 2.25m0 0l4.179 2.25L12 21.75 2.25 16.5l4.179-2.25m11.142 0l-5.571 3-5.571-3" />
          </svg>
        </div>
        <div>
          <h6 className="block font-sans text-base font-semibold leading-relaxed tracking-normal text-blue-gray-900">
            Income & Expense Chart
          </h6>
          <p className="block max-w-sm font-sans text-sm font-normal leading-normal text-gray-700">
            Visualize your income and expense data over the months.
          </p>
        </div>
      </div>
      <div className="pt-6 px-2 pb-0">
        <ApexCharts options={chartOptions} series={chartData.series} type="line" height={240} />
      </div>
    </div>
  );
};

export default IncomeExpenseGraphs;
