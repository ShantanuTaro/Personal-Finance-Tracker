import express from 'express';
import Income from '../models/Income.js';

const router = express.Router();

// Get all income
router.get('/', async (req, res) => {
    try {
        const incomes = await Income.find();
        res.json(incomes);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

// Add a new income
router.post('/', async (req, res) => {
    const income = new Income({
        source: req.body.source,
        amount: req.body.amount,
        tag: req.body.tag,
        date: req.body.date
    });

    try {
        const newIncome = await income.save();
        res.status(201).json(newIncome);
    } catch (err) {
        res.status(400).json({ message: err.message });
    }
});

export default router;