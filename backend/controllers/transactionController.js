import Transaction from '../models/transactionModel.js';

// Get all transactions
export const getTransactions = async (req, res) => {
  const transactions = await Transaction.find({});
  res.json(transactions);
};

// Add a transaction
export const addTransaction = async (req, res) => {
  const { description, amount } = req.body;
  const transaction = new Transaction({ description, amount });
  await transaction.save();
  res.status(201).json(transaction);
};

// Delete a transaction
export const deleteTransaction = async (req, res) => {
  const transaction = await Transaction.findById(req.params.id);
  if (transaction) {
    await transaction.remove();
    res.json({ message: 'Transaction removed' });
  } else {
    res.status(404).json({ message: 'Transaction not found' });
  }
};
