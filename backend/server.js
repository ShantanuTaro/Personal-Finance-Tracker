import express from 'express';
import mongoose from 'mongoose';
import cors from 'cors';
import dotenv from 'dotenv';

import incomeRoutes from './routes/income.js';
import expenseRoutes from './routes/expenses.js';
import summaryRoutes from './routes/summary.js';
import authRoutes from './routes/auth.js';  // Importing auth routes
import protect from './middleware/auth.js';  // Import JWT protection middleware

dotenv.config(); // For environment variables

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json());  // To parse JSON bodies

// Auth Routes (Signup/Login)
app.use('/api/auth', authRoutes);  // Add the auth routes

// Routes
app.use('/api/income', incomeRoutes);
app.use('/api/expenses', expenseRoutes);
app.use('/api/summary', summaryRoutes);

// Connect to MongoDB
mongoose.connect(process.env.MONGO_URI, { useNewUrlParser: true, useUnifiedTopology: true })
    .then(() => {
        console.log('Connected to MongoDB');
        app.listen(PORT, () => {
            console.log(`Server running on port ${PORT}`);
        });
    })
    .catch(err => console.error('Error connecting to MongoDB:', err));