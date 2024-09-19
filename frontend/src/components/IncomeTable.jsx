import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useDispatch, useSelector } from 'react-redux';
import { setIncome } from '../redux/financeSlice';

const IncomeTable = ({ selectedMonth }) => {
  const dispatch = useDispatch();
  const income = useSelector((state) => state.finance.income);

  const predefinedTags = ['Salary', 'Freelance', 'Investment', 'Other'];

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR' }).format(amount);
  };

  // Get current date in YYYY-MM-DD format
  const getCurrentDate = () => {
    const today = new Date();
    return today.toISOString().split('T')[0]; // Extracts YYYY-MM-DD from the date
  };

  const [newIncome, setNewIncome] = useState({
    source: '',
    amount: '',
    tag: '',
    date: getCurrentDate(), // Set current date as default value
  });

  // Fetch income data based on the selected month
  useEffect(() => {
    const fetchIncomes = async () => {
      try {
        const response = await axios.get(`/api/income?month=${selectedMonth}`);
        dispatch(setIncome(response.data)); // Update Redux store with fetched income data
      } catch (error) {
        console.error('Error fetching income data:', error);
      }
    };

    fetchIncomes();
  }, [selectedMonth, dispatch]); // Re-fetch incomes when selectedMonth changes

  // Calculate total income (ensure amounts are numbers)
  const totalIncome = income.reduce((acc, item) => acc + Number(item.amount), 0);

  // Handle form input changes
  const handleChange = (e) => {
    const { name, value } = e.target;
    setNewIncome((prevIncome) => ({
      ...prevIncome,
      [name]: value
    }));
  };

  // Handle form submission to add new income
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post('/api/income', { ...newIncome, month: selectedMonth });
      dispatch(setIncome([...income, response.data])); // Update Redux store with new income
      setNewIncome({
        source: '',
        amount: '',
        tag: '',
        date: getCurrentDate(), // Reset date to the current date after submission
      });
    } catch (error) {
      console.error('Error adding new income:', error);
    }
  };

  return (
    <div>
      <h2>Income for {selectedMonth}</h2>
      <p>Total Income: {formatCurrency(totalIncome)}</p>

      {/* Income table */}
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
          {income.map((item, index) => (
            <tr key={index}>
              <td>{item.source}</td>
              <td>{formatCurrency(item.amount)}</td>
              <td>{item.tag}</td>
              <td>{new Date(item.date).toLocaleDateString()}</td>
            </tr>
          ))}
        </tbody>
      </table>

      {/* Form to add new income */}
      <h3>Add New Income for {selectedMonth}</h3>
      <form onSubmit={handleSubmit}>
        <input
          type="text"
          name="source"
          placeholder="Source"
          value={newIncome.source}
          onChange={handleChange}
          required
        />
        <input
          type="number"
          name="amount"
          placeholder="Amount"
          value={newIncome.amount}
          onChange={handleChange}
          required
        />
        <label htmlFor="tag">Tag</label>
        <select
          id="tag"
          name="tag"
          value={newIncome.tag}
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
          value={newIncome.date}
          onChange={handleChange}
          required
        />
        <button type="submit">Add Income</button>
      </form>
    </div>
  );
};

export default IncomeTable;
