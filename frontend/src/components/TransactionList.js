import { useContext, useEffect } from 'react';
import TransactionContext from '../context/TransactionContext';

const TransactionList = () => {
  const { transactions, fetchTransactions } = useContext(TransactionContext);

  useEffect(() => {
    fetchTransactions();
  }, [fetchTransactions]);

  return (
    <ul>
      {transactions.map((transaction) => (
        <li key={transaction._id}>
          {transaction.description} - ${transaction.amount}
        </li>
      ))}
    </ul>
  );
};

export default TransactionList;
