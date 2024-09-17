import express from 'express';
import Expense from '../models/Expense.js';
import Income from '../models/Income.js';
import MonthlySummary from '../models/MonthlySummary.js';

const router = express.Router();

// Function to update monthly summary
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


// Get all expenses or filter by month
router.get('/', async (req, res) => {
    const month = req.query.month; // Extract month from query parameters

    try {
        // Check if month is provided
        if (month) {
            const year = new Date().getFullYear(); // You can adjust this if the year is also passed in the query
            const monthIndex = new Date(`${month} 1, ${year}`).getMonth(); // Get the month index (0-11)

            const startDate = new Date(year, monthIndex, 1); // First day of the month
            const endDate = new Date(year, monthIndex + 1, 1); // First day of the next month

            // Find incomes where the 'date' is within the month range
            const incomes = await Expense.find({
                date: {
                    $gte: startDate, // Start of the month
                    $lt: endDate // End of the month
                }
            });
            res.json(incomes);
        } else {
            // If no month is provided, return all incomes
            const incomes = await Expense.find();
            res.json(incomes);
        }
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});


// Add a new expense
router.post('/', async (req, res) => {
    const expense = new Expense({
        month: req.body.month,
        source: req.body.source,
        amount: req.body.amount,
        tag: req.body.tag,
        date: req.body.date
    });

    try {
        const newExpense = await expense.save();
        
        const month = new Date(req.body.date).toLocaleString('default', { month: 'long' });
        await updateMonthlySummary(month);
    
        res.status(201).json(newExpense);
      } catch (err) {
        res.status(400).json({ message: err.message });
      }
});

export default router;
