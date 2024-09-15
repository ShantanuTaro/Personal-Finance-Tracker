import mongoose from 'mongoose';

const IncomeSchema = new mongoose.Schema({
  source: {
      type: String,
      required: [true, 'Source is required'],
      trim: true
  },
  amount: {
      type: Number,
      required: [true, 'Amount is required'],
      min: [0, 'Amount cannot be negative']
  },
  tag: {
      type: String,
      enum: ['Salary', 'Freelance', 'Investment', 'Other'],
      required: [true, 'Tag is required']
  },
  date: {
      type: Date,
      default: Date.now
  }
});


const ExpenseSchema = new mongoose.Schema({
  source: {
      type: String,
      required: [true, 'Source is required'],
      trim: true
  },
  amount: {
      type: Number,
      required: [true, 'Amount is required'],
      min: [0, 'Amount cannot be negative']
  },
  tag: {
      type: String,
      enum: ['Dining Out', 'Rent/Mortgage', 'Utilities', 'Retail', 'Other'],
      required: [true, 'Tag is required']
  },
  date: {
      type: Date,
      default: Date.now
  }
});



module.exports = mongoose.model('Income', IncomeSchema);
module.exports = mongoose.model('Expense', ExpenseSchema);
