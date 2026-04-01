import React, { useEffect, useContext } from 'react';
import { Link } from 'react-router-dom';
import QuoteContext from '../context/QuoteContext';
import AuthContext from '../context/AuthContext';

const MyQuotes = () => {
  const { myQuotes, loading, getMyQuotes, deleteQuote } = useContext(QuoteContext);
  const { user } = useContext(AuthContext);

  useEffect(() => {
    getMyQuotes();
  }, []);

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this quote?')) {
      await deleteQuote(id);
    }
  };

  if (loading) {
    return <div className="loading">Loading your quotes...</div>;
  }

  return (
    <div className="quotes-container">
      <div className="quotes-header">
        <h1>My Quotes</h1>
      </div>
      {myQuotes.length === 0 ? (
        <div className="empty-state">
          <h2>You haven't added any quotes yet</h2>
          <p>
            <Link to="/add-quote">Add your first quote</Link>
          </p>
        </div>
      ) : (
        myQuotes.map((quote) => (
          <div key={quote.id} className="quote-card">
            <p className="quote-text">"{quote.text}"</p>
            <p className="quote-author">- {user?.username}</p>
            <p className="quote-author">
              {new Date(quote.created_at).toLocaleDateString()}
            </p>
            <div className="quote-actions">
              <button
                className="btn-delete"
                onClick={() => handleDelete(quote.id)}
              >
                Delete
              </button>
            </div>
          </div>
        ))
      )}
    </div>
  );
};

export default MyQuotes;
