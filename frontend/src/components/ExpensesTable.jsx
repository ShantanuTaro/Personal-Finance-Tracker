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

  const [editingExpenseId, setEditingExpenseId] = useState(null); // Track the expense being edited

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
      if (editingExpenseId) {
        // If editing, send a PUT request to update the existing income
        const response = await axios.put(`/api/expenses/${editingExpenseId}`, { ...newExpense });
        dispatch(setExpenses(expenses.map((inc) => (inc._id === editingExpenseId ? response.data : inc))));        
      } else{
        const response = await axios.post('/api/expenses', { ...newExpense, month: selectedMonth });
        dispatch(setExpenses([...expenses, response.data])); // Update Redux store with new expense
      }
      setNewExpense({
        source: '',
        amount: '',
        tag: '',
        date: getCurrentDate(), // Reset date to the current date after submission
      });
      setEditingExpenseId(null);
    } catch (error) {
      console.error('Error adding new expense:', error);
    }
  };

  // Set up the form for editing when the "Edit" button is clicked
  const handleEdit = (expenseItem) => {
    setNewExpense({
      source: expenseItem.source,
      amount: expenseItem.amount,
      tag: expenseItem.tag,
      date: new Date(expenseItem.date).toISOString().split('T')[0], // Set date in YYYY-MM-DD format
    });
    setEditingExpenseId(expenseItem._id); // Set the ID of the income being edited
  };

  return (
    <div class="relative overflow-x-auto shadow-md sm:rounded-lg">
      <h1 class="text-xl font-bold leading-none tracking-tight text-gray-900 md:text-xl lg:text-xl dark:text-white">Expenses for <span class="underline underline-offset-3 decoration-2 decoration-blue-700 dark:decoration-blue-600">{selectedMonth}</span></h1>
      <p class="text-lg font-normal text-gray-500 lg:text-xl dark:text-gray-400">Total Expenses: {formatCurrency(totalExpenses)}</p>

      <div class="bg-white border-b dark:bg-gray-800 dark:border-gray-700">
       <form onSubmit={handleSubmit} class="bg-white shadow-md rounded px-8 pt-6 pb-8 mb-4">
        <div class="bg-white  dark:bg-gray-800 space-x-1">
        <h3>{editingExpenseId ? 'Edit Expense' : 'Add New Expense'}</h3>
          <input
            type="text"
            name="source"
            placeholder="Source"
            value={newExpense.source}
            onChange={handleChange}
            required
            class="px-6 py-4 font-medium text-gray-900 whitespace-nowrap dark:text-white border"
          />
          <input
            type="number"
            name="amount"
            placeholder="Amount"
            value={newExpense.amount}
            onChange={handleChange}
            required
            class="px-6 py-4 border"
          />
          <select
            id="tag"
            name="tag"
            value={newExpense.tag}
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
            value={newExpense.date}
            onChange={handleChange}
            required
            class="px-6 py-4 border"
          />
          <button type="submit" class="text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 me-2 mb-2 dark:bg-blue-600 dark:hover:bg-blue-700 focus:outline-none dark:focus:ring-blue-800">{editingExpenseId ? 'Update Expense' : 'Add Expense'}</button>
        </div>
      </form>
    </div>

      {/* Expenses table */}
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
          {expenses.map((expense, index) => (
            <tr key={index} class="bg-white border-b dark:bg-gray-800 dark:border-gray-700">
              <th scope="row" class="px-6 py-4 font-medium text-gray-900 whitespace-nowrap dark:text-white">{expense.source}</th>
              <td class="px-6 py-4">{formatCurrency(expense.amount)}</td>
              <td class="px-6 py-4">{expense.tag}</td>
              <td class="px-6 py-4">{new Date(expense.date).toLocaleDateString()}</td>
              <td>
                <button onClick={() => handleEdit(expense)} class=" px-6 py-4 font-medium text-blue-600 dark:text-blue-500 hover:underline">Edit</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default ExpensesTable;
