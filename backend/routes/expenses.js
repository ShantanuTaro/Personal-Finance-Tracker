import express from 'express';
import Expense from '../models/Expense.js';

const router = express.Router();

// Get all expenses or filter by month
router.get('/', async (req, res) => {
    const month = req.query.month; // Extract month from query parameters

    try {
        // Check if month is provided
        if (month) {
            const expenses = await Expense.find({
                date: {
                    $gte: new Date(`${month} 1, ${new Date().getFullYear()}`), // Start of the month
                    $lt: new Date(`${month} 1, ${new Date().getFullYear() + (month === 'December' ? 1 : 0)}`).setMonth(new Date().getMonth() + 1) // End of the month
                }
            });
            res.json(expenses);
        } else {
            // If no month is provided, return all expenses
            const expenses = await Expense.find();
            res.json(expenses);
        }
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

// Add a new expense
router.post('/', async (req, res) => {
    const expense = new Expense({
        source: req.body.source,
        amount: req.body.amount,
        tag: req.body.tag,
        date: req.body.date
    });

    try {
        const newExpense = await expense.save();
        res.status(201).json(newExpense);
    } catch (err) {
        res.status(400).json({ message: err.message });
    }
});

export default router;
