import express from 'express';
import Income from '../models/Income.js';
import Expense from '../models/Expense.js';
import MonthlySummary from '../models/MonthlySummary.js';
import protect from '../middleware/auth.js';

const router = express.Router();

const updateMonthlySummary = async (month, user) => {
  const year = new Date().getFullYear();
  const monthIndex = new Date(`${month} 1, ${year}`).getMonth();

  const startDate = new Date(year, monthIndex, 1);
  const endDate = new Date(year, monthIndex + 1, 1);

  const totalIncome = await Income.aggregate([
    { $match: { date: { $gte: startDate, $lt: endDate } } },
    { $group: { _id: null, totalIncome: { $sum: '$amount' } } }
  ]).then(result => result[0]?.totalIncome || 0);

  const totalExpenses = await Expense.aggregate([
    { $match: { date: { $gte: startDate, $lt: endDate } } },
    { $group: { _id: null, totalExpenses: { $sum: '$amount' } } }
  ]).then(result => result[0]?.totalExpenses || 0);

  const totalNet = totalIncome - totalExpenses;
  await MonthlySummary.findOneAndUpdate(
    { user, month },
    { totalIncome, totalExpenses, totalNet },
    { upsert: true, new: true }
  );
};

// Get all income or filter by month
router.get('/', protect, async (req, res) => {
  const month = req.query.month; // Extract month from query parameters

  try {
    const year = new Date().getFullYear();
    const userId = req.user; // Get the user ID from the request object

    if (month) {
      const monthIndex = new Date(`${month} 1, ${year}`).getMonth();
      const startDate = new Date(year, monthIndex, 1);
      const endDate = new Date(year, monthIndex + 1, 1);

      // Find incomes where the 'date' is within the month range
      const incomes = await Income.find({
        date: { $gte: startDate, $lt: endDate },
        user: userId // Filter by user ID
      });
      res.json(incomes);
    } else {
      const incomes = await Income.find({ user: userId }); // Filter by user ID
      res.json(incomes);
    }
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});


// Add a new income
router.post('/', protect, async (req, res) => {
  const income = new Income({
    user: req.user, // Set the user ID
    month: req.body.month,
    source: req.body.source,
    amount: req.body.amount,
    tag: req.body.tag,
    date: req.body.date,
  });

  try {
    const newIncome = await income.save();

    const month = new Date(req.body.date).toLocaleString('default', { month: 'long' });
    await updateMonthlySummary(month, req.user);
    res.status(201).json(newIncome);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});


// Update an existing income
router.put('/:id', protect, async (req, res) => {
  try {
    const userId = req.user; // Get the user ID from the request object
    const incomeId = req.params.id;

    // Find the income by ID and ensure it belongs to the user
    const income = await Income.findById(incomeId);

    if (!income) {
      return res.status(404).json({ message: 'Income not found' });
    }

    if (income.user.toString() !== userId) {
      return res.status(403).json({ message: 'User not authorized to update this income' });
    }

    // Proceed to update the income if the user is authorized
    const updatedIncome = await Income.findByIdAndUpdate(
      incomeId,
      {
        source: req.body.source,
        amount: req.body.amount,
        tag: req.body.tag,
        date: req.body.date
      },
      { new: true }
    );

    const month = new Date(req.body.date).toLocaleString('default', { month: 'long' });
    await updateMonthlySummary(month, userId);

    res.json(updatedIncome);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

export default router;
