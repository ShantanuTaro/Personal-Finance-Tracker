import React, { useState, useEffect } from 'react';
import axios from 'axios';

const ExpensesTable = ({ selectedMonth }) => {
  // Get current date in YYYY-MM-DD format
  const getCurrentDate = () => {
    const today = new Date();
    return today.toISOString().split('T')[0]; // Extracts YYYY-MM-DD from the date
  };

  const [expenses, setExpenses] = useState([]);
  const [newExpense, setNewExpense] = useState({
    month: selectedMonth,
    source: '',
    amount: '',
    tag: '',
    date: getCurrentDate(), // Set current date as default value
  });

  // Fetch expenses data based on the selected month
  useEffect(() => {
    const fetchExpenses = async () => {
      try {
        const response = await axios.get(`/api/expenses?month=${selectedMonth}`); // Adjust API endpoint with query param
        setExpenses(response.data);
      } catch (error) {
        console.error('Error fetching expenses data:', error);
      }
    };

    fetchExpenses();
  }, [selectedMonth]); // Re-fetch expenses when selectedMonth changes

  // Calculate total expenses (ensure amounts are numbers)
  const totalExpenses = expenses.reduce((acc, expense) => acc + Number(expense.amount), 0);

  // Handle form input changes
  const handleChange = (e) => {
    const { name, value } = e.target;
    setNewExpense((prevExpense) => ({
      ...prevExpense,
      [name]: value
    }));
  };

  // Handle form submission to add new expense
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post('/api/expenses', { ...newExpense, month: selectedMonth }); // Set source to selectedMonth
      setExpenses([...expenses, response.data]); // Add new expense to state

      // Reset form but retain selectedMonth and set the current date as default
      setNewExpense({
        source: '',
        amount: '',
        tag: '',
        date: getCurrentDate(), // Set current date after submission
      });
    } catch (error) {
      console.error('Error adding new expense:', error);
    }
  };

  return (
    <div>
      <h2>Expenses for {selectedMonth}</h2>
      <p>Total Expenses: {totalExpenses}</p>

      {/* Expenses table */}
      <table>
        <thead>
          <tr>
            <th>Source</th>
            <th>Amount</th>
            <th>Tag</th>
            <th>Date</th>
          </tr>
        </thead>
        <tbody>
          {expenses.map((expense, index) => (
            <tr key={index}>
              <td>{expense.source}</td>
              <td>{expense.amount}</td>
              <td>{expense.tag}</td>
              <td>{new Date(expense.date).toLocaleDateString()}</td>
            </tr>
          ))}
        </tbody>
      </table>

      {/* Form to add new expense */}
      <h3>Add New Expense for {selectedMonth}</h3>
      <form onSubmit={handleSubmit}>
        <input
          type="text"
          name="source"
          placeholder="Source"
          value={newExpense.source}
          onChange={handleChange}
          required
        />
        <input
          type="number"
          name="amount"
          placeholder="Amount"
          value={newExpense.amount}
          onChange={handleChange}
          required
        />
        <input
          type="text"
          name="tag"
          placeholder="Tag"
          value={newExpense.tag}
          onChange={handleChange}
          required
        />
        <input
          type="date"
          name="date"
          value={newExpense.date}
          onChange={handleChange}
          required
        />
        <button type="submit">Add Expense</button>
      </form>
    </div>
  );
};

export default ExpensesTable;
