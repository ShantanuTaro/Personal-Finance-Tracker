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

  const [editingIncomeId, setEditingIncomeId] = useState(null); // Track the income being edited

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
  }, [selectedMonth, dispatch]);

  const totalIncome = income.reduce((acc, item) => acc + Number(item.amount), 0);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setNewIncome((prevIncome) => ({
      ...prevIncome,
      [name]: value
    }));
  };

  // Handle adding or updating income
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editingIncomeId) {
        // If editing, send a PUT request to update the existing income
        const response = await axios.put(`/api/income/${editingIncomeId}`, { ...newIncome });
        dispatch(setIncome(income.map((inc) => (inc._id === editingIncomeId ? response.data : inc))));
      } else {
        // If not editing, add a new income
        const response = await axios.post('/api/income', { ...newIncome, month: selectedMonth });
        dispatch(setIncome([...income, response.data])); // Update Redux store with new income
      }
      // Reset the form and editing state
      setNewIncome({
        source: '',
        amount: '',
        tag: '',
        date: getCurrentDate(),
      });
      setEditingIncomeId(null);
    } catch (error) {
      console.error('Error adding/updating income:', error);
    }
  };

  // Set up the form for editing when the "Edit" button is clicked
  const handleEdit = (incomeItem) => {
    setNewIncome({
      source: incomeItem.source,
      amount: incomeItem.amount,
      tag: incomeItem.tag,
      date: new Date(incomeItem.date).toISOString().split('T')[0], // Set date in YYYY-MM-DD format
    });
    setEditingIncomeId(incomeItem._id); // Set the ID of the income being edited
  };

  return (

    <div class="relative overflow-x-auto shadow-md sm:rounded-lg">
    <h1 class="text-xl font-bold leading-none tracking-tight text-gray-900 md:text-xl lg:text-xl dark:text-white">Income for <span class="underline underline-offset-3 decoration-2 decoration-blue-700 dark:decoration-blue-600">{selectedMonth}</span></h1>
    <p class="text-lg font-normal text-gray-500 lg:text-xl dark:text-gray-400">Total Income: {formatCurrency(totalIncome)}</p>

    <div class="bg-white border-b dark:bg-gray-800 dark:border-gray-700">
    <form onSubmit={handleSubmit} class="bg-white shadow-md rounded px-8 pt-6 pb-8 mb-4">
      <div class="bg-white  dark:bg-gray-800 space-x-1">
      <h3>{editingIncomeId ? 'Edit Income' : 'Add New Income'}</h3>
        <input
          type="text"
          name="source"
          placeholder="Source"
          value={newIncome.source}
          onChange={handleChange}
          required
          class="px-6 py-4 font-medium text-gray-900 whitespace-nowrap dark:text-white border"
        />
        <input
          type="number"
          name="amount"
          placeholder="Amount"
          value={newIncome.amount}
          onChange={handleChange}
          required
          class="px-6 py-4 border"
        />
        <select
          id="tag"
          name="tag"
          value={newIncome.tag}
          onChange={handleChange}
          required
          class="px-6 py-4 border"
        >
          <option value="" disabled>Select a Category</option>
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
          class="px-6 py-4 border"
        />
        <button type="submit" class="text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 me-2 mb-2 dark:bg-blue-600 dark:hover:bg-blue-700 focus:outline-none dark:focus:ring-blue-800">{editingIncomeId ? 'Update Income' : 'Add Income'}</button>
      </div>
    </form>
    </div>
      
    <table class="w-full text-sm text-left rtl:text-right text-gray-500 dark:text-gray-400">
        <thead class="text-xs text-gray-700 uppercase bg-gray-50 dark:bg-gray-700 dark:text-gray-400">
            <tr>
                <th scope="col" class="px-6 py-3">
                    Source
                </th>
                <th scope="col" class="px-6 py-3">
                    Amount
                </th>
                <th scope="col" class="px-6 py-3">
                    Category
                </th>
                <th scope="col" class="px-6 py-3">
                    Date
                </th>
                <th scope="col" class="px-6 py-3">
                    Action
                </th>
            </tr>
        </thead>

        <tbody>
          {income.map((item, index) => (
            <tr key={index} class="bg-white border-b dark:bg-gray-800 dark:border-gray-700">
              <th scope="row" class="px-6 py-4 font-medium text-gray-900 whitespace-nowrap dark:text-white">{item.source}</th>
              <td class="px-6 py-4">{formatCurrency(item.amount)}</td>
              <td class="px-6 py-4">{item.tag}</td>
              <td class="px-6 py-4">{new Date(item.date).toLocaleDateString()}</td>
              <td>
                <button onClick={() => handleEdit(item)} class=" px-6 py-4 font-medium text-blue-600 dark:text-blue-500 hover:underline">Edit</button>
              </td>
            </tr>
          ))}
        </tbody>
    </table>

    </div>
  
  );
};

export default IncomeTable;
