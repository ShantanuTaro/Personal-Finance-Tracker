import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Line } from 'react-chartjs-2';
import { Chart as ChartJS, CategoryScale, LinearScale, PointElement, LineElement } from 'chart.js';

ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement);

const IncomeExpenseGraphs = () => {

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR' }).format(amount);
  };

  const [data, setData] = useState({
    months: [],
    incomeData: [],
    expenseData: []
  });

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get('/api/summary/all'); // Adjust the endpoint as needed
        const summaries = response.data;

        // Create an array of all 12 months
        const allMonths = [
          'January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'
        ];

        // Initialize income and expense data with zeros
        const initialData = {
          months: allMonths,
          incomeData: Array(12).fill(0),
          expenseData: Array(12).fill(0)
        };

        // Fill in the data from the API response
        summaries.forEach(summary => {
          const monthIndex = allMonths.indexOf(summary.month);
          if (monthIndex !== -1) {
            initialData.incomeData[monthIndex] = summary.totalIncome;
            initialData.expenseData[monthIndex] = summary.totalExpenses;
          }
        });

        setData(initialData);
      } catch (error) {
        console.error('Error fetching summary data:', error);
      }
    };

    fetchData();
  }, []);

  const incomeChartData = {
    labels: data.months,
    datasets: [
      {
        label: 'Income',
        data: data.incomeData,
        borderColor: 'rgba(75, 192, 192, 1)',
        backgroundColor: 'rgba(75, 192, 192, 0.2)',
        fill: true
      }
    ]
  };

  const expenseChartData = {
    labels: data.months,
    datasets: [
      {
        label: 'Expenses',
        data: data.expenseData,
        borderColor: 'rgba(255, 99, 132, 1)',
        backgroundColor: 'rgba(255, 99, 132, 0.2)',
        fill: true
      }
    ]
  };

  return (
    <div>
      <h2>Income and Expense Charts</h2>
      <div className="tables-container">
        <div className='table-wrapper'>
          <h3>Income Chart</h3>
          <Line data={incomeChartData} />
        </div>
        <div className='table-wrapper'>
          <h3>Expense Chart</h3>
          <Line data={expenseChartData} />
        </div>
      </div>
    </div>
  );
};

export default IncomeExpenseGraphs;
