import React from 'react';
import { BrowserRouter as Router, Route, Routes, Navigate } from 'react-router-dom';
import Area from './components/areas/Area';
import Login from './components/Login';
import './App.css';

const PrivateRoute = ({ children }) => {
  const isAuthenticated = localStorage.getItem('token') !== null;
  return isAuthenticated ? children : <Navigate to="/login" />;
};

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/" element={
          <PrivateRoute>
            <Area />
          </PrivateRoute>
        } />
       // <Route path="/" element={<Navigate to="/areas" />} />
      </Routes>
    </Router>
  );
}

export default App;

