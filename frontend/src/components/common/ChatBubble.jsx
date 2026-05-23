import { useState, useRef, useEffect } from 'react';
import './ChatBubble.css';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3001/api';

export default function ChatBubble() {
  const [isOpen, setIsOpen] = useState(false);
  const [isStarted, setIsStarted] = useState(false);
  const [sessionId, setSessionId] = useState(null);
  const [messages, setMessages] = useState([]);
  const [inputMessage, setInputMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [formData, setFormData] = useState({ name: '', email: '' });
  const [formError, setFormError] = useState('');
  const messagesEndRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const validateEmail = (email) => {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
  };

  const handleStartChat = async (e) => {
    e.preventDefault();
    setFormError('');

    if (!formData.email) {
      setFormError('Email is required');
      return;
    }

    if (!validateEmail(formData.email)) {
      setFormError('Please enter a valid email');
      return;
    }

    setIsLoading(true);

    try {
      const response = await fetch(`${API_URL}/chat/start`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      });

      const data = await response.json();

      if (response.ok) {
        setSessionId(data.sessionId);
        setMessages(data.messages || []);
        setIsStarted(true);
      } else {
        setFormError(data.error || 'Failed to start chat');
      }
    } catch (error) {
      setFormError('Connection error. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleSendMessage = async (e) => {
    e.preventDefault();
    if (!inputMessage.trim() || isLoading) return;

    const userMessage = inputMessage.trim();
    setInputMessage('');
    setMessages(prev => [...prev, { role: 'user', content: userMessage }]);
    setIsLoading(true);

    try {
      const response = await fetch(`${API_URL}/chat/message`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ sessionId, message: userMessage })
      });

      const data = await response.json();

      if (response.ok) {
        setMessages(prev => [...prev, { role: 'assistant', content: data.message }]);
      } else {
        setMessages(prev => [...prev, { 
          role: 'assistant', 
          content: 'Sorry, I encountered an error. Please try again.' 
        }]);
      }
    } catch (error) {
      setMessages(prev => [...prev, { 
        role: 'assistant', 
        content: 'Connection error. Please check your connection and try again.' 
      }]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleClose = () => {
    setIsOpen(false);
  };

  const handleEndChat = async () => {
    if (sessionId) {
      try {
        await fetch(`${API_URL}/chat/end/${sessionId}`, { method: 'POST' });
      } catch (e) { /* ignore */ }
    }
    setIsStarted(false);
    setSessionId(null);
    setMessages([]);
    setFormData({ name: '', email: '' });
    setIsOpen(false);
  };

  return (
    <div className="chat-bubble-container">
      {isOpen && (
        <div className="chat-window">
          <div className="chat-header">
            <div className="chat-header-info">
              <div className="chat-avatar">
                <svg viewBox="0 0 24 24" fill="currentColor">
                  <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z"/>
                </svg>
              </div>
              <div>
                <h4>Gateway Hotel</h4>
                <span className="chat-status">Online</span>
              </div>
            </div>
            <div className="chat-header-actions">
              {isStarted && (
                <button 
                  className="chat-end-btn" 
                  onClick={handleEndChat}
                  title="End chat"
                >
                  <svg viewBox="0 0 24 24" fill="currentColor" width="16" height="16">
                    <path d="M19 6.41L17.59 5 12 10.59 6.41 5 5 6.41 10.59 12 5 17.59 6.41 19 12 13.41 17.59 19 19 17.59 13.41 12z"/>
                  </svg>
                </button>
              )}
              <button className="chat-close-btn" onClick={handleClose}>
                <svg viewBox="0 0 24 24" fill="currentColor">
                  <path d="M7 10l5 5 5-5z"/>
                </svg>
              </button>
            </div>
          </div>

          {!isStarted ? (
            <div className="chat-start-form">
              <div className="chat-welcome">
                <h3>Welcome to Gateway Hotel</h3>
                <p>Please enter your details to start chatting with us.</p>
              </div>
              <form onSubmit={handleStartChat}>
                <div className="chat-form-group">
                  <label htmlFor="chat-name">Name (optional)</label>
                  <input
                    type="text"
                    id="chat-name"
                    placeholder="Your name"
                    value={formData.name}
                    onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                  />
                </div>
                <div className="chat-form-group">
                  <label htmlFor="chat-email">Email *</label>
                  <input
                    type="email"
                    id="chat-email"
                    placeholder="your@email.com"
                    value={formData.email}
                    onChange={(e) => setFormData(prev => ({ ...prev, email: e.target.value }))}
                    required
                  />
                </div>
                {formError && <p className="chat-error">{formError}</p>}
                <button type="submit" className="chat-start-btn" disabled={isLoading}>
                  {isLoading ? 'Starting...' : 'Start Chat'}
                </button>
              </form>
            </div>
          ) : (
            <>
              <div className="chat-messages">
                {messages.map((msg, idx) => (
                  <div key={idx} className={`chat-message ${msg.role}`}>
                    <div className="message-content">{msg.content}</div>
                  </div>
                ))}
                {isLoading && (
                  <div className="chat-message assistant">
                    <div className="message-content typing">
                      <span></span><span></span><span></span>
                    </div>
                  </div>
                )}
                <div ref={messagesEndRef} />
              </div>
              <form className="chat-input-form" onSubmit={handleSendMessage}>
                <input
                  type="text"
                  placeholder="Type a message..."
                  value={inputMessage}
                  onChange={(e) => setInputMessage(e.target.value)}
                  disabled={isLoading}
                />
                <button type="submit" disabled={isLoading || !inputMessage.trim()}>
                  <svg viewBox="0 0 24 24" fill="currentColor">
                    <path d="M2.01 21L23 12 2.01 3 2 10l15 2-15 2z"/>
                  </svg>
                </button>
              </form>
            </>
          )}
        </div>
      )}

      <button 
        className={`chat-bubble-btn ${isOpen ? 'open' : ''}`} 
        onClick={() => setIsOpen(!isOpen)}
        aria-label="Open chat"
      >
        {isOpen ? (
          <svg viewBox="0 0 24 24" fill="currentColor">
            <path d="M7 10l5 5 5-5z"/>
          </svg>
        ) : (
          <svg viewBox="0 0 24 24" fill="currentColor">
            <path d="M20 2H4c-1.1 0-2 .9-2 2v18l4-4h14c1.1 0 2-.9 2-2V4c0-1.1-.9-2-2-2zm0 14H6l-2 2V4h16v12z"/>
          </svg>
        )}
      </button>
    </div>
  );
}
