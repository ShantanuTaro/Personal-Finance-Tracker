import express from 'express';
import MonthlySummary from '../models/MonthlySummary.js'; // Adjust the path as needed

const router = express.Router();

// Get the summary for a specific month
router.get('/', async (req, res) => {
  const month = req.query.month;

  try {
    const summary = await MonthlySummary.findOne({ month });

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


router.get('/all', async (req, res) => {
    try {
      const summaries = await MonthlySummary.find();
      res.json(summaries);
    } catch (err) {
      res.status(500).json({ message: err.message });
    }
  });

export default router;
