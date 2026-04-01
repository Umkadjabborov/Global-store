import React, { useEffect, useContext } from 'react';
import QuoteContext from '../context/QuoteContext';

const AllQuotes = () => {
  const { allQuotes, loading, getAllQuotes } = useContext(QuoteContext);

  useEffect(() => {
    getAllQuotes();
  }, []);

  if (loading) {
    return <div className="loading">Loading quotes...</div>;
  }

  return (
    <div className="quotes-container">
      <div className="quotes-header">
        <h1>All Quotes</h1>
      </div>
      {allQuotes.length === 0 ? (
        <div className="empty-state">
          <h2>No quotes yet</h2>
          <p>Be the first to add a quote!</p>
        </div>
      ) : (
        allQuotes.map((quote) => (
          <div key={quote.id} className="quote-card">
            <p className="quote-text">"{quote.text}"</p>
            <p className="quote-author">- {quote.username}</p>
            <p className="quote-author">
              {new Date(quote.created_at).toLocaleDateString()}
            </p>
          </div>
        ))
      )}
    </div>
  );
};

export default AllQuotes;
