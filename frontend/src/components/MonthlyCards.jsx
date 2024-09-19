import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useSelector } from 'react-redux';

const MonthlyCards = () => {

  const { income, expenses } = useSelector((state) => state.finance);

  const months = [
    'January', 'February', 'March', 'April', 'May', 'June',
    'July', 'August', 'September', 'October', 'November', 'December'
  ];

  const [summaries, setSummaries] = useState([]);

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

  return (
    
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-6 gap-4">
      {summaries.map((summary) => (
        <div key={summary.month} className="max-w-sm p-6 bg-white border border-gray-200 rounded-lg shadow hover:bg-gray-100 dark:bg-gray-800 dark:border-gray-700 dark:hover:bg-gray-700">
            <h3 className="text-lg font-semibold">Summary for {summary.month}</h3>
            <h4 className="mt-2 text-base">Total Income: {formatCurrency(summary.totalIncome)}</h4>
            <h4 className="mt-2 text-base">Total Expenses: {formatCurrency(summary.totalExpenses)}</h4>
            <h4 className="mt-2 text-base">Total Net: {formatCurrency(summary.totalNet)}</h4>
        </div>
      ))}
    </div>
  );
};

export default MonthlyCards;
