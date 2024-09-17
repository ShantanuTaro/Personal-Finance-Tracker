import React, { useState, useEffect } from 'react';
import axios from 'axios';

const ExpensesTable = ({ selectedMonth }) => {
  const [expenses, setExpenses] = useState([]);
  const [newExpense, setNewExpense] = useState({
    source: selectedMonth,
    amount: '',
    tag: '',
    date: ''
  });

  // Fetch expenses data based on the selected month
  useEffect(() => {
    const fetchExpenses = async () => {
      try {
        const response = await axios.get(`/api/expenses?source=${selectedMonth}`); // Adjust API endpoint with query param
        setExpenses(response.data);
      } catch (error) {
        console.error('Error fetching expenses data:', error);
      }
    };

    fetchExpenses();
  }, [selectedMonth]); // Re-fetch expenses when selectedMonth changes

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
      const response = await axios.post('/api/expenses', { ...newExpense, source: selectedMonth }); // Set source to selectedMonth
      setExpenses([...expenses, response.data]); // Add new expense to state
      setNewExpense({ source: selectedMonth, amount: '', tag: '', date: '' }); // Reset form but retain selectedMonth
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
          value={selectedMonth} // Set source to selectedMonth and make it read-only
          readOnly
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
