import React, { useState, useEffect } from 'react';
import axios from 'axios';

const MonthlySummary = ({ selectedMonth }) => {

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
        console.log(response.data);
      } catch (error) {
        console.error('Error fetching summary data:', error);
      }
    };

    fetchSummary();
  }, [selectedMonth]);

  return (
    <div>
      <h2>Summary for {selectedMonth}</h2>

      {/* Total Income */}
      <h3>Total Income: {formatCurrency(summary.totalIncome)}</h3>

      {/* Total Expenses */}
      <h3>Total Expenses: {formatCurrency(summary.totalExpenses)}</h3>

      {/* Total Net (Income - Expenses) */}
      <h3>Total Net: {formatCurrency(summary.totalNet)}</h3>
    </div>
  );
};

export default MonthlySummary;
