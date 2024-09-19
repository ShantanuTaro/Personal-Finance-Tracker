import React, { useState } from 'react';

const AddEntryForm = ({ onAddEntry, type }) => {
  const [entry, setEntry] = useState({ source: '', amount: '', tag: '', date: '' });

  const handleChange = (e) => {
    setEntry({
      ...entry,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onAddEntry(entry);
    setEntry({ source: '', amount: '', tag: '', date: '' }); // Reset the form
  };

  return (
    <form onSubmit={handleSubmit}>
      <h3>Add New {type}</h3>
      <input
        type="text"
        name="source"
        value={entry.source}
        onChange={handleChange}
        placeholder="Source"
        required
      />
      <input
        type="number"
        name="amount"
        value={entry.amount}
        onChange={handleChange}
        placeholder="Amount"
        required
      />
      <input
        type="text"
        name="tag"
        value={entry.tag}
        onChange={handleChange}
        placeholder="Tag"
        required
      />
      <input
        type="date"
        name="date"
        value={entry.date}
        onChange={handleChange}
        required
      />
      <button type="submit">Add {type}</button>
    </form>
  );
};

export default AddEntryForm;
