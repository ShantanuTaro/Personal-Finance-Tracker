import React, { useState, useEffect } from 'react';
import { useSelector } from 'react-redux';
import IncomeTable from './IncomeTable';
import ExpensesTable from './ExpensesTable';
import useAxiosWithAuth from '../hooks/useAxiosWithAuth';

const MonthlyCards = () => {
  const axios = useAxiosWithAuth();
  const { income, expenses } = useSelector((state) => state.finance);

  const months = [
    'January', 'February', 'March', 'April', 'May', 'June',
    'July', 'August', 'September', 'October', 'November', 'December'
  ];

  const [summaries, setSummaries] = useState([]);
  const [selectedMonth, setSelectedMonth] = useState(null); // Track the selected month

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR' }).format(amount);
  };

  useEffect(() => {
    const fetchSummaries = async () => {
      try {
        const responses = await Promise.all(
          months.map(month => axios.get(`/api/summary?month=${month}`))
        );
        const fetchedSummaries = responses.map(response => response.data);

        // Ensure summaries are sorted by month
        const sortedSummaries = months.map(month => 
          fetchedSummaries.find(summary => summary.month === month) || {
            month,
            totalIncome: 0,
            totalExpenses: 0,
            totalNet: 0
          }
        );

        setSummaries(sortedSummaries);
      } catch (error) {
        console.error('Error fetching summary data:', error);
      }
    };

    fetchSummaries();
  }, [income, expenses]);

  const handleMonthClick = (month) => {
    setSelectedMonth(month); // Update the selected month when a div is clicked
  };

  return (
    <div>
      {/* Monthly Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-6 gap-4">
        {summaries.map((summary) => (
          <div
            key={summary.month}
            className="max-w-sm p-6 bg-white border border-gray-200 rounded-lg shadow hover:bg-gray-100 dark:bg-gray-800 dark:border-gray-700 dark:hover:bg-gray-700 cursor-pointer"
            onClick={() => handleMonthClick(summary.month)} // Handle click
          >
            <h3 className="flex items-center text-lg font-semibold">
              <svg xmlns="http://www.w3.org/2000/svg" width="30px" height="30px" viewBox="0 0 64 64" fill={summary.month === 'January' || summary.month === 'February' || summary.month === 'March' ? '#337ea9' : summary.month === 'April' || summary.month === 'May' || summary.month === 'June' ? '#ff9900' : summary.month === 'July' || summary.month === 'August' || summary.month === 'September' ? '#4caf50' : '#ff5722'}>
                <path d="m32,8c-13.25,0-24,10.75-24,24s10.75,24,24,24,24-10.75,24-24-10.75-24-24-24Zm0,34c-5.52,0-10-4.48-10-10s4.48-10,10-10,10,4.48,10,10-4.48,10-10,10Z" />
              </svg>
              <span className="ml-2">{summary.month}</span>
            </h3>
            <h4 className="mt-2 text-base">Total Income: {formatCurrency(summary.totalIncome)}</h4>
            <h4 className="mt-2 text-base">Total Expenses: {formatCurrency(summary.totalExpenses)}</h4>
            <h4 className="mt-2 text-base">Total Net: {formatCurrency(summary.totalNet)}</h4>
          </div>
        ))}
      </div>

      {/* Render IncomeTable and ExpensesTable with the selectedMonth */}
      {selectedMonth && (
        <div className='tables-container mt-6'>
          <div className='table-wrapper'>
            <IncomeTable selectedMonth={selectedMonth} />
          </div>
          <div className='table-wrapper'>
            <ExpensesTable selectedMonth={selectedMonth} />
          </div>
        </div>
      )}
    </div>
  );
};

export default MonthlyCards;
