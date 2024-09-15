import { createContext, useReducer } from 'react';
import axios from 'axios';

const TransactionContext = createContext();

const transactionReducer = (state, action) => {
  switch (action.type) {
    case 'SET_TRANSACTIONS':
      return { ...state, transactions: action.payload };
    case 'ADD_TRANSACTION':
      return { ...state, transactions: [...state.transactions, action.payload] };
    case 'DELETE_TRANSACTION':
      return {
        ...state,
        transactions: state.transactions.filter((t) => t._id !== action.payload),
      };
    default:
      return state;
  }
};

export const TransactionProvider = ({ children }) => {
  const [state, dispatch] = useReducer(transactionReducer, { transactions: [] });

  // Fetch transactions
  const fetchTransactions = async () => {
    const { data } = await axios.get('/api/transactions');
    dispatch({ type: 'SET_TRANSACTIONS', payload: data });
  };

  return (
    <TransactionContext.Provider value={{ ...state, dispatch, fetchTransactions }}>
      {children}
    </TransactionContext.Provider>
  );
};

export default TransactionContext;
