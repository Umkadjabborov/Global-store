import React, { useState, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import QuoteContext from '../context/QuoteContext';

const AddQuote = () => {
  const [text, setText] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [loading, setLoading] = useState(false);
  const { createQuote } = useContext(QuoteContext);
  const navigate = useNavigate();

  const onSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');
    setLoading(true);

    const result = await createQuote(text);

    setLoading(false);

    if (result.success) {
      setSuccess('Quote added successfully!');
      setText('');
      setTimeout(() => {
        navigate('/my-quotes');
      }, 2000);
    } else {
      setError(result.message);
    }
  };

  return (
    <div className="container">
      <div className="form-container">
        <h2 className="text-center">Add New Quote</h2>
        {error && <div className="error">{error}</div>}
        {success && <div className="success">{success}</div>}
        <form onSubmit={onSubmit}>
          <div className="form-group">
            <label>Quote</label>
            <textarea
              value={text}
              onChange={(e) => setText(e.target.value)}
              placeholder="Enter your quote here..."
              required
            />
          </div>
          <button type="submit" className="btn" disabled={loading}>
            {loading ? 'Adding...' : 'Add Quote'}
          </button>
        </form>
      </div>
    </div>
  );
};

export default AddQuote;
