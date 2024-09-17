import express from 'express';
import Income from '../models/Income.js';

const router = express.Router();

// Get all income or filter by month
router.get('/', async (req, res) => {
    const month = req.query.month; // Extract month from query parameters

    try {
        // Check if month is provided
        if (month) {
            const incomes = await Income.find({
                date: {
                    $gte: new Date(`${month} 1, ${new Date().getFullYear()}`), // Start of the month
                    $lt: new Date(`${month} 1, ${new Date().getFullYear() + (month === 'December' ? 1 : 0)}`).setMonth(new Date().getMonth() + 1) // End of the month
                }
            });
            res.json(incomes);
        } else {
            // If no month is provided, return all incomes
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
