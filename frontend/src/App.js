import React, { useState } from 'react';
import IncomeTable from './components/IncomeTable';
import ExpensesTable from './components/ExpensesTable';
import AddEntryForm from './components/AddEntryForm';
import './App.css';
import MonthlySummary from './components/MonthlySummary';
import IncomeExpenseGraphs from './components/IncomeExpenseGraphs';

const App = () => {
  const [selectedMonth, setSelectedMonth] = useState('January'); // Default to January

  // List of months for dropdown or tab navigation
  const months = [
    'January', 'February', 'March', 'April', 'May', 'June',
    'July', 'August', 'September', 'October', 'November', 'December'
  ];



  return (
    <div className='app-container'>
      <h1>Personal Finance Tracker</h1>

      <div className='tables-container'>
        <div className="table-wrapper">
          <IncomeExpenseGraphs/>
        </div>
      </div>
      <div> 
        <h1></h1>
      </div>

      {/* Month Selector */}
      <div className="month-selector">
        {months.map((month) => (
          <button
            key={month}
            onClick={() => setSelectedMonth(month)}
            className={selectedMonth === month ? 'active' : ''}
          >
            {month}
          </button>
        ))}
      </div>
    

      <div className='tables-container'>
        <div className="table-wrapper">
          <MonthlySummary selectedMonth={selectedMonth} />
        </div>
      </div>
      <div> 
        <h1></h1>
      </div>

      {/* Render IncomeTable and ExpensesTable with the selectedMonth */}
      <div className='tables-container'>
        <div className='table-wrapper'>
          <IncomeTable selectedMonth={selectedMonth} />
        </div>
        <div className='table-wrapper'>
          <ExpensesTable selectedMonth={selectedMonth} />
        </div>
      </div>
    </div>
  );
};

export default App;
