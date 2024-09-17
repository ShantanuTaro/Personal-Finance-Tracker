import React, { useState } from 'react';
import IncomeTable from './components/IncomeTable';
import ExpensesTable from './components/ExpensesTable';
import AddEntryForm from './components/AddEntryForm';
import './App.css';

const App = () => {
  const [selectedMonth, setSelectedMonth] = useState('January'); // Default to January

  // List of months for dropdown or tab navigation
  const months = [
    'January', 'February', 'March', 'April', 'May', 'June',
    'July', 'August', 'September', 'October', 'November', 'December'
  ];

  // Handle month change
  const handleMonthChange = (e) => {
    setSelectedMonth(e.target.value); // Set the selected month based on user selection
  };

  return (
    <div>
      <h1>Personal Finance Tracker</h1>

      {/* Month Selector */}
      <label>Select Month: </label>
      <select value={selectedMonth} onChange={handleMonthChange}>
        {months.map((month) => (
          <option key={month} value={month}>
            {month}
          </option>
        ))}
      </select>

      {/* Render IncomeTable and ExpensesTable with the selectedMonth */}
      <div style={{ display: 'flex', justifyContent: 'space-between' }}>
        <div style={{ width: '48%' }}>
          <IncomeTable selectedMonth={selectedMonth} />
        </div>
        <div style={{ width: '48%' }}>
          <ExpensesTable selectedMonth={selectedMonth} />
        </div>
      </div>
    </div>
  );
};

export default App;
