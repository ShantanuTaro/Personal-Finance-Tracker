import React, { useState } from 'react';

const AddEntryForm = ({ onAddEntry, type }) => {
  const [source, setSource] = useState('');
  const [amount, setAmount] = useState('');
  const [tag, setTag] = useState('');
  const [date, setDate] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    onAddEntry({ source, amount: parseFloat(amount), tag, date });
    setSource('');
    setAmount('');
    setTag('');
    setDate('');
  };

  return (
    <form onSubmit={handleSubmit}>
      <h3>Add New {type}</h3>
      <div>
        <label>Source:</label>
        <input value={source} onChange={(e) => setSource(e.target.value)} required />
      </div>
      <div>
        <label>Amount:</label>
        <input type="number" value={amount} onChange={(e) => setAmount(e.target.value)} required />
      </div>
      <div>
        <label>Tag:</label>
        <input value={tag} onChange={(e) => setTag(e.target.value)} required />
      </div>
      <div>
        <label>Date:</label>
        <input type="date" value={date} onChange={(e) => setDate(e.target.value)} required />
      </div>
      <button type="submit">Add {type}</button>
    </form>
  );
};

export default AddEntryForm;
