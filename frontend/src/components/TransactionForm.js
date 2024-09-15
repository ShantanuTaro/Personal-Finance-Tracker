import { useState, useContext } from 'react';
import axios from 'axios';
import TransactionContext from '../context/TransactionContext';

const TransactionForm = () => {
  const [description, setDescription] = useState('');
  const [amount, setAmount] = useState('');
  const { dispatch } = useContext(TransactionContext);

  const submitHandler = async (e) => {
    e.preventDefault();
    const { data } = await axios.post('/api/transactions', { description, amount });
    dispatch({ type: 'ADD_TRANSACTION', payload: data });
  };

  return (
    <form onSubmit={submitHandler}>
      <input
        type="text"
        value={description}
        onChange={(e) => setDescription(e.target.value)}
        placeholder="Enter description"
        required
      />
      <input
        type="number"
        value={amount}
        onChange={(e) => setAmount(e.target.value)}
        placeholder="Enter amount"
        required
      />
      <button type="submit">Add Transaction</button>
    </form>
  );
};

export default TransactionForm;
