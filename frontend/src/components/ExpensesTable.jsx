import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useDispatch, useSelector } from 'react-redux';
import { setExpenses } from '../redux/financeSlice';

const ExpensesTable = ({ selectedMonth }) => {
  const dispatch = useDispatch();
  const expenses = useSelector((state) => state.finance.expenses);

  const predefinedTags = ['Dining Out', 'Rent/Mortgage', 'Utilities', 'Retail', 'Food', 'Housing', 'Health', 'Transportation', 'Other'];

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR' }).format(amount);
  };

  // Get current date in YYYY-MM-DD format
  const getCurrentDate = () => {
    const today = new Date();
    return today.toISOString().split('T')[0]; // Extracts YYYY-MM-DD from the date
  };

  const [newExpense, setNewExpense] = useState({
    source: '',
    amount: '',
    tag: '',
    date: getCurrentDate(), // Set current date as default value
  });

  // Fetch expenses data based on the selected month
  useEffect(() => {
    const fetchExpenses = async () => {
      try {
        const response = await axios.get(`/api/expenses?month=${selectedMonth}`);
        dispatch(setExpenses(response.data)); // Update Redux store with fetched expenses data
      } catch (error) {
        console.error('Error fetching expenses data:', error);
      }
    };

    fetchExpenses();
  }, [selectedMonth, dispatch]); // Re-fetch expenses when selectedMonth changes

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
      const response = await axios.post('/api/expenses', { ...newExpense, month: selectedMonth });
      dispatch(setExpenses([...expenses, response.data])); // Update Redux store with new expense
      setNewExpense({
        source: '',
        amount: '',
        tag: '',
        date: getCurrentDate(), // Reset date to the current date after submission
      });
    } catch (error) {
      console.error('Error adding new expense:', error);
    }
  };

  return (
    <div>
      <h2>Expenses for {selectedMonth}</h2>
      <p>Total Expenses: {formatCurrency(totalExpenses)}</p>

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
              <td>{formatCurrency(expense.amount)}</td>
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
        <label htmlFor="tag">Tag</label>
        <select
          id="tag"
          name="tag"
          value={newExpense.tag}
          onChange={handleChange}
          required
        >
          <option value="" disabled>Select a tag</option>
          {predefinedTags.map((tag) => (
            <option key={tag} value={tag}>
              {tag}
            </option>
          ))}
        </select>
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
