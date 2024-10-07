import express from 'express';
import MonthlySummary from '../models/MonthlySummary.js'; // Adjust the path as needed
import protect from '../middleware/auth.js';

const router = express.Router();

// Get the summary for a specific month
router.get('/', protect, async (req, res) => {
  const month = req.query.month;
  const userId = req.user;

  try {
    const summary = await MonthlySummary.findOne({ month, user:userId });

    if (summary) {
        res.json(summary);
    } else {
        const summary = {month: month, totalIncome: 0, totalExpenses: 0, totalNet: 0}
        res.json(summary);
    }

    
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});


router.get('/all', protect, async (req, res) => {

  const userId = req.user;

    try {
      const summaries = await MonthlySummary.find({user: userId});
      res.json(summaries);
    } catch (err) {
      res.status(500).json({ message: err.message });
    }
  });

export default router;
