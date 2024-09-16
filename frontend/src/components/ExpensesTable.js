import React, { useState, useEffect } from 'react';
import axios from 'axios';

const ExpensesTable = () => {
  const [expenses, setExpenses] = useState([]);
  const [newExpense, setNewExpense] = useState({
    source: '',
    amount: '',
    tag: '',
    date: ''
  });

  // Fetch expense data from the backend on component mount
  useEffect(() => {
    const fetchExpenses = async () => {
      try {
        const response = await axios.get('/api/expenses'); // Adjust the API endpoint accordingly
        setExpenses(response.data);
      } catch (error) {
        console.error('Error fetching expense data:', error);
      }
    };

    fetchExpenses();
  }, []);

  const totalExpenses = expenses.reduce((acc, expense) => acc + expense.amount, 0);

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
      const response = await axios.post('/api/expenses', newExpense); // Adjust API endpoint accordingly
      setExpenses([...expenses, response.data]); // Add new expense to state
      setNewExpense({ source: '', amount: '', tag: '', date: '' }); // Reset form
    } catch (error) {
      console.error('Error adding new expense:', error);
    }
  };

  return (
    <div>
      <h2>Expenses</h2>
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
              <td>{expense.date}</td>
            </tr>
          ))}
        </tbody>
      </table>

      {/* Form to add new expense */}
      <h3>Add New Expense</h3>
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
