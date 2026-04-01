import React, { createContext, useState } from 'react';
import axios from 'axios';

const QuoteContext = createContext();

export const QuoteProvider = ({ children }) => {
  const [allQuotes, setAllQuotes] = useState([]);
  const [myQuotes, setMyQuotes] = useState([]);
  const [loading, setLoading] = useState(false);

  const getAllQuotes = async () => {
    setLoading(true);
    try {
      console.log('Fetching quotes from API...');
      const response = await axios.get('http://localhost:5000/api/quotes');
      console.log('Quotes API response:', response.data);
      setAllQuotes(response.data);
    } catch (error) {
      console.error('Get all quotes error:', error);
      console.error('Error details:', error.response);
    } finally {
      setLoading(false);
    }
  };

  const getMyQuotes = async () => {
    setLoading(true);
    try {
      const response = await axios.get('http://localhost:5000/api/quotes/my');
      setMyQuotes(response.data);
    } catch (error) {
      console.error('Get my quotes error:', error);
    } finally {
      setLoading(false);
    }
  };

  const createQuote = async (text) => {
    try {
      const response = await axios.post('http://localhost:5000/api/quotes', { text });
      return { success: true, message: response.data.message };
    } catch (error) {
      return {
        success: false,
        message: error.response?.data?.message || 'Failed to create quote',
      };
    }
  };

  const deleteQuote = async (id) => {
    try {
      await axios.delete(`http://localhost:5000/api/quotes/${id}`);
      setMyQuotes(myQuotes.filter((quote) => quote.id !== id));
      setAllQuotes(allQuotes.filter((quote) => quote.id !== id));
      return { success: true };
    } catch (error) {
      return {
        success: false,
        message: error.response?.data?.message || 'Failed to delete quote',
      };
    }
  };

  return (
    <QuoteContext.Provider
      value={{
        allQuotes,
        myQuotes,
        loading,
        getAllQuotes,
        getMyQuotes,
        createQuote,
        deleteQuote,
      }}
    >
      {children}
    </QuoteContext.Provider>
  );
};

export default QuoteContext;
