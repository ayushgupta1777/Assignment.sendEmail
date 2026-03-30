import React, { useState } from 'react';
import axios from 'axios';

const API_URL = '/api/send-email';

function App() {
  const [formData, setFormData] = useState({
    to: '',
    cc: '',
    bcc: '',
    subject: '',
    message: ''
  });
  const [showExtras, setShowExtras] = useState(false);
  const [status, setStatus] = useState({ type: '', message: '' });
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setStatus({ type: '', message: '' });

    try {
      const response = await axios.post(API_URL, formData);
      setStatus({ type: 'success', message: response.data.message });
      setFormData({ to: '', cc: '', bcc: '', subject: '', message: '' });
    } catch (err) {
      console.error(err);
      setStatus({ 
        type: 'error', 
        message: err.response?.data?.error || 'Failed to send email. Check your server and credentials.' 
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="app-container">
      <h1>Email Sender Pro</h1>
      
      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label htmlFor="to">To:</label>
          <input
            type="email"
            id="to"
            name="to"
            placeholder="recipient@example.com"
            value={formData.to}
            onChange={handleChange}
            required
          />
        </div>

        <span 
          className="toggle-fields" 
          onClick={() => setShowExtras(!showExtras)}
        >
          {showExtras ? '- Hide CC/BCC' : '+ Add CC/BCC'}
        </span>

        {showExtras && (
          <div className="row" style={{ animation: 'fadeIn 0.5s ease' }}>
            <div className="form-group">
              <label htmlFor="cc">CC:</label>
              <input
                type="email"
                id="cc"
                name="cc"
                placeholder="cc@example.com"
                value={formData.cc}
                onChange={handleChange}
              />
            </div>
            <div className="form-group">
              <label htmlFor="bcc">BCC:</label>
              <input
                type="email"
                id="bcc"
                name="bcc"
                placeholder="bcc@example.com"
                value={formData.bcc}
                onChange={handleChange}
              />
            </div>
          </div>
        )}

        <div className="form-group">
          <label htmlFor="subject">Subject:</label>
          <input
            type="text"
            id="subject"
            name="subject"
            placeholder="Enter subject"
            value={formData.subject}
            onChange={handleChange}
            required
          />
        </div>

        <div className="form-group">
          <label htmlFor="message">Message:</label>
          <textarea
            id="message"
            name="message"
            rows="5"
            placeholder="Type your message here..."
            value={formData.message}
            onChange={handleChange}
            required
          ></textarea>
        </div>

        <button type="submit" className="send-btn" disabled={loading}>
          {loading ? (
            <>
              <span className="spinner"></span>
              Sending...
            </>
          ) : 'Send Email'}
        </button>
      </form>

      {status.message && (
        <div className={`status-msg ${status.type}`}>
          {status.message}
        </div>
      )}
    </div>
  );
}

export default App;
