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

// Get all expenses or filter by month
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
            const expenses = await Expense.find({
                date: { $gte: startDate, $lt: endDate },
                user: userId // Filter by user ID
            });
            res.json(expenses);
        } else {
            // If no month is provided, return all incomes
            const expenses = await Expense.find({ user: userId });
            res.json(expenses);
        }
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});


// Add a new expense
router.post('/', protect, async (req, res) => {
    const expense = new Expense({
      user: req.user, 
      month: req.body.month,
      source: req.body.source,
      amount: req.body.amount,
      tag: req.body.tag,
      date: req.body.date,
    });

    try {
        const newExpense = await expense.save();
        const month = new Date(req.body.date).toLocaleString('default', { month: 'long' });
        await updateMonthlySummary(month, req.user);
    
        res.status(201).json(newExpense);
      } catch (err) {
        res.status(400).json({ message: err.message });
      }
});

// Update an existing expense
router.put('/:id', protect, async (req, res) => {
  try {
    const userId = req.user;
    const expenseId = req.params.id;
    const expense = await Expense.findById(expenseId);

    if (!expense) {
      return res.status(404).json({ message: 'Expense not found'});
    }

    if (expense.user.toString() !== userId) {
      return res.status(403).json({ message: 'User not authorized to update this expense' });
    }

    
    const updatedExpense = await Expense.findByIdAndUpdate(
      expenseId,
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

    res.json(updatedExpense);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

export default router;
