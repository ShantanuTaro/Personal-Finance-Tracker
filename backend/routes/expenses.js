import express from 'express';
import Expense from '../models/Expense.js';

const router = express.Router();

// Get all expenses
router.get('/', async (req, res) => {
    try {
        const expenses = await Expense.find();
        res.json(expenses);
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