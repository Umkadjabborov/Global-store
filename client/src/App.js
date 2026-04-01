import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import { QuoteProvider } from './context/QuoteContext';
import Navbar from './components/Navbar';
import ProtectedRoute from './components/ProtectedRoute';
import Register from './pages/Register';
import Login from './pages/Login';
import AllQuotes from './pages/AllQuotes';
import MyQuotes from './pages/MyQuotes';
import AddQuote from './pages/AddQuote';

function App() {
  return (
    <AuthProvider>
      <QuoteProvider>
        <Router>
          <Navbar />
          <Routes>
            <Route path="/" element={<AllQuotes />} />
            <Route path="/register" element={<Register />} />
            <Route path="/login" element={<Login />} />
            <Route
              path="/my-quotes"
              element={
                <ProtectedRoute>
                  <MyQuotes />
                </ProtectedRoute>
              }
            />
            <Route
              path="/add-quote"
              element={
                <ProtectedRoute>
                  <AddQuote />
                </ProtectedRoute>
              }
            />
          </Routes>
        </Router>
      </QuoteProvider>
    </AuthProvider>
  );
}

export default App;
