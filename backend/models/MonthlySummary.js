import mongoose from 'mongoose';

const monthlySummarySchema = new mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User', // Reference the User model
        required: true,
    },
    month: {
        type: String,
        required: true,
        unique: false, // Remove uniqueness constraint since multiple users will have the same month
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
