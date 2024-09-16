import React, { useState, useEffect } from 'react';
import axios from 'axios';
import IncomeTable from './components/IncomeTable';
import ExpensesTable from './components/ExpensesTable';
//import AddEntryForm from './components/AddEntryForm';

function App() {
  const [incomes, setIncomes] = useState([]);
  const [expenses, setExpenses] = useState([]);

  // Fetch incomes and expenses from the backend on component mount
  useEffect(() => {
    const fetchData = async () => {
      try {
        const incomeResponse = await axios.get('/api/income');
        console.log(incomeResponse)
        const expenseResponse = await axios.get('/api/expenses');
        setIncomes(incomeResponse.data);
        setExpenses(expenseResponse.data);
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    };

    fetchData();
  }, []);



  return (
    <div>
      <h1>Personal Finance Tracker</h1>
      <div>
        {/* Income Table and Form */}
        <IncomeTable incomes={incomes} />

      </div>
      <div>
        {/* Expense Table and Form */}
        <ExpensesTable expenses={expenses} />
 
      </div>
    </div>
  );
}

export default App;
