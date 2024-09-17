import React, { useState, useEffect } from 'react';
import axios from 'axios';

const IncomeTable = ({ selectedMonth }) => {

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR' }).format(amount);
  };

  // Get current date in YYYY-MM-DD format
  const getCurrentDate = () => {
    const today = new Date();
    return today.toISOString().split('T')[0]; // Extracts YYYY-MM-DD from the date
  };

  const [incomes, setIncomes] = useState([]);
  const [newIncome, setNewIncome] = useState({
    month: selectedMonth,
    source: '',
    amount: '',
    tag: '',
    date: getCurrentDate(), // Set current date as default value
  });

  // Fetch income data based on the selected month
  useEffect(() => {
    const fetchIncomes = async () => {
      try {
        const response = await axios.get(`/api/income?month=${selectedMonth}`); // Adjust API endpoint with query param
        setIncomes(response.data);
      } catch (error) {
        console.error('Error fetching income data:', error);
      }
    };

    fetchIncomes();
  }, [selectedMonth]); // Re-fetch incomes when selectedMonth changes

  // Calculate total income (ensure amounts are numbers)
  const totalIncome = incomes.reduce((acc, income) => acc + Number(income.amount), 0);

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
      const response = await axios.post('/api/income', { ...newIncome, month: selectedMonth }); // Set month to selectedMonth
      setIncomes([...incomes, response.data]); // Add new income to state

      // Reset form but retain selectedMonth and set the current date as default
      setNewIncome({
        source: '',
        amount: '',
        tag: '',
        date: newIncome.date, // Reset date to the current date after submission
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
          {incomes.map((income, index) => (
            <tr key={index}>
              <td>{income.source}</td>
              <td>{formatCurrency(income.amount)}</td>
              <td>{income.tag}</td>
              <td>{new Date(income.date).toLocaleDateString()}</td>
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
        <input
          type="text"
          name="tag"
          placeholder="Tag"
          value={newIncome.tag}
          onChange={handleChange}
          required
        />
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
