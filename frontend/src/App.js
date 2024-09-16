import React, { useState, useEffect } from 'react';
import axios from 'axios';
import IncomeTable from './components/IncomeTable';
import ExpensesTable from './components/ExpensesTable';
import AddEntryForm from './components/AddEntryForm';

function App() {
  const [incomes, setIncomes] = useState([]);
  const [expenses, setExpenses] = useState([]);

  // Fetch incomes and expenses from the backend on component mount
  useEffect(() => {
    const fetchData = async () => {
      try {
        const incomeResponse = await axios.get('/api/incomes');
        const expenseResponse = await axios.get('/api/expenses');
        setIncomes(incomeResponse.data);
        setExpenses(expenseResponse.data);
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    };

    fetchData();
  }, []);

  // Handle adding new income and sending it to the backend
  const handleAddIncome = async (income) => {
    try {
      const response = await axios.post('/api/incomes', income);
      setIncomes([...incomes, response.data]);
    } catch (error) {
      console.error('Error adding income:', error);
    }
  };

  // Handle adding new expense and sending it to the backend
  const handleAddExpense = async (expense) => {
    try {
      const response = await axios.post('/api/expenses', expense);
      setExpenses([...expenses, response.data]);
    } catch (error) {
      console.error('Error adding expense:', error);
    }
  };

  return (
    <div>
      <h1>Personal Finance Tracker</h1>
      <div>
        {/* Income Table and Form */}
        <IncomeTable incomes={incomes} />
        <AddEntryForm onAddEntry={handleAddIncome} type="Income" />
      </div>
      <div>
        {/* Expense Table and Form */}
        <ExpensesTable expenses={expenses} />
        <AddEntryForm onAddEntry={handleAddExpense} type="Expense" />
      </div>
    </div>
  );
}

export default App;
