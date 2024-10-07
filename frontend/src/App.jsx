import React from 'react';
import './App.css';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import IncomeExpenseGraphs from './components/IncomeExpenseGraphs';
import MonthlyCards from './components/MonthlyCards';
import SignUp from './components/SignUp';
import Login from './components/Login';
import Navbar from './components/Navbar';
import PrivateRoute from './components/PrivateRoute';

import { useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { setToken } from './redux/authSlice';

const App = () => {
  
  const dispatch = useDispatch();

  useEffect(() => {
    const token = localStorage.getItem('authToken');
    if (token) {
      dispatch(setToken(token)); // Restore the token from localStorage on app load
    }
  }, [dispatch]);


  return (
    <Router>

      <Navbar />
      <div className='app-container'>
        <Routes>
          {/* Route for the dashboard (accessible after login) */}
          <Route path="/dashboard" element={
            <PrivateRoute>
              <div>
                <div className="container mx-auto p-4">
                  <IncomeExpenseGraphs />
                </div>
                <div className="p-4">
                  <MonthlyCards />
                </div>
              </div>
            </PrivateRoute>
          } />
          
          {/* Route for sign-up page */}
          <Route path="/signup" element={<SignUp />} />
          
          {/* Route for login page */}
          <Route path="/" element={<Login />} />
        </Routes>
      </div>
    </Router>
  );
};

export default App;
