import express from 'express';
import Income from '../models/Income.js';
import Expense from '../models/Expense.js';
import MonthlySummary from '../models/MonthlySummary.js';

const router = express.Router();

const updateMonthlySummary = async (month) => {
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
    { month },
    { totalIncome, totalExpenses, totalNet },
    { upsert: true }
  );
};

// Get all income or filter by month
router.get('/', async (req, res) => {
  const month = req.query.month;

  try {
    if (month) {
      const year = new Date().getFullYear();
      const monthIndex = new Date(`${month} 1, ${year}`).getMonth();

      const startDate = new Date(year, monthIndex, 1);
      const endDate = new Date(year, monthIndex + 1, 1);

      const incomes = await Income.find({
        date: { $gte: startDate, $lt: endDate }
      });
      res.json(incomes);
    } else {
      const incomes = await Income.find();
      res.json(incomes);
    }
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Add a new income
router.post('/', async (req, res) => {
  const income = new Income({
    month: req.body.month,
    source: req.body.source,
    amount: req.body.amount,
    tag: req.body.tag,
    date: req.body.date
  });

  try {
    const newIncome = await income.save();

    const month = new Date(req.body.date).toLocaleString('default', { month: 'long' });
    await updateMonthlySummary(month);

    res.status(201).json(newIncome);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

// Update an existing income
router.put('/:id', async (req, res) => {
  try {
    const updatedIncome = await Income.findByIdAndUpdate(
      req.params.id,
      {
        source: req.body.source,
        amount: req.body.amount,
        tag: req.body.tag,
        date: req.body.date
      },
      { new: true }
    );

    const month = new Date(req.body.date).toLocaleString('default', { month: 'long' });
    await updateMonthlySummary(month);

    res.json(updatedIncome);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

export default router;
