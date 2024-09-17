import React, { useState, useEffect } from 'react';
import axios from 'axios';

const IncomeTable = ({ selectedMonth }) => {
  const [incomes, setIncomes] = useState([]);
  const [newIncome, setNewIncome] = useState({
    source: selectedMonth,
    amount: '',
    tag: '',
    date: ''
  });

  // Fetch income data based on the selected month
  useEffect(() => {
    const fetchIncomes = async () => {
      try {
        const response = await axios.get(`/api/income?source=${selectedMonth}`); // Adjust API endpoint with query param
        setIncomes(response.data);
      } catch (error) {
        console.error('Error fetching income data:', error);
      }
    };

    fetchIncomes();
  }, [selectedMonth]); // Re-fetch incomes when selectedMonth changes

  const totalIncome = incomes.reduce((acc, income) => acc + income.amount, 0);

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
      const response = await axios.post('/api/income', { ...newIncome, source: selectedMonth }); // Set source to selectedMonth
      setIncomes([...incomes, response.data]); // Add new income to state
      setNewIncome({ source: selectedMonth, amount: '', tag: '', date: '' }); // Reset form but retain selectedMonth
    } catch (error) {
      console.error('Error adding new income:', error);
    }
  };

  return (
    <div>
      <h2>Income for {selectedMonth}</h2>
      <p>Total Income: {totalIncome}</p>

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
              <td>{income.amount}</td>
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
          value={selectedMonth} // Set source to selectedMonth and make it read-only
          readOnly
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
