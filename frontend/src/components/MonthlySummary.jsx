import React, { useState, useEffect } from 'react';
import { useSelector } from 'react-redux';
import useAxiosWithAuth from '../hooks/useAxiosWithAuth';

const MonthlySummary = ({ selectedMonth }) => {
  const axios = useAxiosWithAuth();
  const { income, expenses } = useSelector((state) => state.finance);

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR' }).format(amount);
  };

  const [summary, setSummary] = useState({
    totalIncome: 0,
    totalExpenses: 0,
    totalNet: 0
  });

  // Fetch summary data when selectedMonth changes
  useEffect(() => {
    const fetchSummary = async () => {
      try {
        const response = await axios.get(`/api/summary?month=${selectedMonth}`);
        setSummary(response.data);
      } catch (error) {
        console.error('Error fetching summary data:', error);
      }
    };

    fetchSummary();
  }, [selectedMonth, income, expenses]);

  return (
    <div>
      <h3>Summary for {selectedMonth}</h3>

      {/* Total Income */}
      <h4>Total Income: {formatCurrency(summary.totalIncome)}</h4>

      {/* Total Expenses */}
      <h4>Total Expenses: {formatCurrency(summary.totalExpenses)}</h4>

      {/* Total Net (Income - Expenses) */}
      <h4>Total Net: {formatCurrency(summary.totalNet)}</h4>
    </div>
  );
};

export default MonthlySummary;
