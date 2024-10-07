import mongoose from 'mongoose';

const ExpenseSchema = new mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User', // Reference the User model
        required: true,
    },
    month: {
        type: String,
        required: [true, 'Month is required'],
        trim: true
    },
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
        enum: ['Dining Out', 'Rent/Mortgage', 'Utilities', 'Retail', 'Other', 'Food', 'Housing', 'Health', 'Transportation'],
        required: [true, 'Tag is required']
    },
    date: {
        type: Date,
        default: Date.now
    }
});

const Expense = mongoose.model('Expense', ExpenseSchema);
export default Expense;
