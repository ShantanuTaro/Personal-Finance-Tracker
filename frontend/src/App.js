import TransactionForm from './components/TransactionForm';
import TransactionList from './components/TransactionList';
import { TransactionProvider } from './context/TransactionContext';

const App = () => {
  return (
    <TransactionProvider>
      <div>
        <h1>Personal Finance Tracker</h1>
        <TransactionForm />
        <TransactionList />
      </div>
    </TransactionProvider>
  );
};

export default App;
