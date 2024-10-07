import { createSlice } from '@reduxjs/toolkit';

const financeSlice = createSlice({
  name: 'finance',
  initialState: {
    income: [],
    expenses: [],
    summaries: [], // Add any other state you need
  },
  reducers: {
    setIncome(state, action) {
      state.income = action.payload;
    },
    setExpenses(state, action) {
      state.expenses = action.payload;
    },
    setSummaries(state, action) {
      state.summaries = action.payload;
    },
    // Add any additional reducers as needed
  },
});

export const { setIncome, setExpenses, setSummaries } = financeSlice.actions;
export default financeSlice.reducer;