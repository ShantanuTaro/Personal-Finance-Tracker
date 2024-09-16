import React, { useState, useEffect } from 'react';
import axios from 'axios';

const IncomeTable = () => {
  const [incomes, setIncomes] = useState([]);
  const [newIncome, setNewIncome] = useState({
    source: '',
    amount: '',
    tag: '',
    date: ''
  });

  // Fetch income data from the backend on component mount
  useEffect(() => {
    const fetchIncomes = async () => {
      try {
        const response = await axios.get('/api/income'); // Adjust the API endpoint accordingly
        setIncomes(response.data);
      } catch (error) {
        console.error('Error fetching income data:', error);
      }
    };

    fetchIncomes();
  }, []);

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
      const response = await axios.post('/api/income', newIncome); // Adjust API endpoint accordingly
      setIncomes([...incomes, response.data]); // Add new income to state
      setNewIncome({ source: '', amount: '', tag: '', date: '' }); // Reset form
    } catch (error) {
      console.error('Error adding new income:', error);
    }
  };

  return (
    <div>
      <h2>Income</h2>
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
              <td>{income.date}</td>
            </tr>
          ))}
        </tbody>
      </table>

      {/* Form to add new income */}
      <h3>Add New Income</h3>
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
