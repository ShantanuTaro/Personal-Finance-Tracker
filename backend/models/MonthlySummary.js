import mongoose from 'mongoose';

const monthlySummarySchema = new mongoose.Schema({
  month: {
    type: String,
    required: true,
    unique: true // Ensure only one entry per month
  },
  totalIncome: {
    type: Number,
    default: 0
  },
  totalExpenses: {
    type: Number,
    default: 0
  },
  totalNet: {
    type: Number,
    default: 0
  }
});

const MonthlySummary = mongoose.model('MonthlySummary', monthlySummarySchema);
export default MonthlySummary;
