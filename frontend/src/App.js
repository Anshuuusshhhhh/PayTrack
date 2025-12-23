import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './App.css';

// CONFIGURATION
const API_URL = 'http://127.0.0.1:5000';

function App() {
  // STATE
  const [token, setToken] = useState(localStorage.getItem('token'));
  
  // Dashboard Data
  const [stats, setStats] = useState({ 
    balance: 0, total_sent: 0, total_received: 0, tx_count: 0, username: 'Guest' 
  });
  const [history, setHistory] = useState([]);
  
  // Auth State (Login vs Register)
  const [isRegistering, setIsRegistering] = useState(false); // <--- NEW TOGGLE
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  
  // Forms
  const [transferData, setTransferData] = useState({ receiver_id: '', amount: '' });
  const [msg, setMsg] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  // INITIAL LOAD
  useEffect(() => {
    if (token) refreshData();
  }, [token]);

  const refreshData = () => {
    fetchStats();
    fetchHistory();
  };

  // --- API ACTIONS ---
  
  // 1. LOGIN
  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      const res = await axios.post(`${API_URL}/login`, { username, password });
      setToken(res.data.access_token);
      localStorage.setItem('token', res.data.access_token);
      setMsg('');
    } catch (err) {
      setMsg('Invalid credentials. Try again.');
    }
  };

  // 2. REGISTER (NEW)
  const handleRegister = async (e) => {
    e.preventDefault();
    try {
      await axios.post(`${API_URL}/register`, { username, password });
      setMsg('Account created! Please log in.');
      setIsRegistering(false); // Switch back to login screen
    } catch (err) {
      setMsg(err.response?.data?.msg || 'Registration failed');
    }
  };

  const fetchStats = async () => {
    try {
      const res = await axios.get(`${API_URL}/dashboard-stats`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setStats(res.data);
    } catch (err) { console.error(err); }
  };

  const fetchHistory = async () => {
    try {
      const res = await axios.get(`${API_URL}/history`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setHistory(res.data);
    } catch (err) { console.error(err); }
  };

  const handleTransfer = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setMsg('');
    try {
      await axios.post(`${API_URL}/transfer`, 
        { 
          receiver_id: parseInt(transferData.receiver_id), 
          amount: parseFloat(transferData.amount) 
        },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setMsg('Success! Transfer complete.');
      setTransferData({ receiver_id: '', amount: '' });
      refreshData();
    } catch (err) {
      setMsg(`Failed: ${err.response?.data?.msg || 'Check inputs'}`);
    } finally {
      setIsLoading(false);
    }
  };

  const logout = () => {
    setToken(null);
    localStorage.removeItem('token');
    setHistory([]);
    setMsg('');
  };

  // --- RENDER: LOGIN / REGISTER SCREEN ---
  if (!token) {
    return (
      <div className="login-container">
        <div className="login-card">
          <div className="logo-circle">P</div>
          
          {/* Dynamic Header */}
          <h1>{isRegistering ? 'Create Account' : 'Welcome Back'}</h1>
          <p className="subtitle">
            {isRegistering ? 'Join PayTrack today' : 'Sign in to manage your finances'}
          </p>
          
          <form className="login-form" onSubmit={isRegistering ? handleRegister : handleLogin}>
            <input 
              placeholder="Username"
              onChange={e => setUsername(e.target.value)}
              required
            />
            <input 
              type="password"
              placeholder="Password"
              onChange={e => setPassword(e.target.value)}
              required
            />
            <button type="submit" className="primary-btn">
              {isRegistering ? 'Sign Up' : 'Sign In'}
            </button>
          </form>


          {/* Toggle Link */}
          <p style={{ marginTop: '20px', fontSize: '14px', color: '#666' }}>
            {isRegistering ? "Already have an account? " : "New to PayTrack? "}
            <span 
              onClick={() => { setIsRegistering(!isRegistering); setMsg(''); }}
              style={{ color: '#2563eb', cursor: 'pointer', fontWeight: 'bold' }}
            >
              {isRegistering ? 'Login' : 'Create Account'}
            </span>
          </p>

          {msg && <p className="error-msg" style={{color: msg.includes('created') ? 'green' : 'red'}}>{msg}</p>}
        </div>
      </div>
    );
  }

  // --- RENDER: DASHBOARD (Same as before) ---
  return (
    <div className="app-container">
      <header className="navbar">
        <div className="nav-left">
          <div className="logo-circle small">P</div>
          <h2>PayTrack</h2>
          <span className="nav-subtitle">Financial Dashboard</span>
        </div>

        <div className="nav-center">
          <input className="search-input" placeholder="Search transactions..." />
        </div>

        <div className="nav-user">
          <span className="notification">🔔</span>
          <div className="user-pill">
            <span className="user-avatar-mini">
              {stats.username?.charAt(0).toUpperCase()}
            </span>
            <div>
              <div className="username">{stats.username}</div>
              <div className="user-role">Admin</div>
            </div>
          </div>
          <button onClick={logout} className="logout-link">Logout</button>
        </div>
      </header>


      <main className="dashboard-grid">
        <div className="metrics-row">
          <div className="metric-card balance-card">
            <div className="metric-icon">💰</div>
            <div>
              <h3>Total Balance</h3>
              <p className="metric-value">${stats.balance.toLocaleString(undefined, { minimumFractionDigits: 2 })}</p>
            </div>
          </div>
          <div className="metric-card received-card">
            <div className="metric-icon">↙️</div>
            <div>
              <h3>Total Received</h3>
              <p className="metric-value text-green">+${stats.total_received.toLocaleString(undefined, { minimumFractionDigits: 2 })}</p>
            </div>
          </div>
          <div className="metric-card sent-card">
            <div className="metric-icon">↗️</div>
            <div>
              <h3>Total Sent</h3>
              <p className="metric-value text-red">-${stats.total_sent.toLocaleString(undefined, { minimumFractionDigits: 2 })}</p>
            </div>
          </div>
          <div className="metric-card count-card">
            <div className="metric-icon">📊</div>
            <div>
              <h3>Transactions</h3>
              <p className="metric-value">{stats.tx_count}</p>
            </div>
          </div>
        </div>

        <div className="content-split">
          <section className="card transfer-section">
            <div className="card-header">
              <h3>Quick Transfer</h3>
              <p>Send money instantly</p>
            </div>
            <form onSubmit={handleTransfer}>
              <div className="input-group">
                <label>Receiver Account ID</label>
                <input 
                  type="number" 
                  value={transferData.receiver_id}
                  onChange={e => setTransferData({...transferData, receiver_id: e.target.value})}
                  placeholder="e.g. 2"
                  required 
                />
              </div>
              <div className="input-group">
                <label>Amount (USD)</label>
                <div className="currency-input">
                  <span>$</span>
                  <input 
                    type="number" 
                    value={transferData.amount}
                    onChange={e => setTransferData({...transferData, amount: e.target.value})}
                    placeholder="0.00"
                    step="0.01"
                    min="0.01"
                    required 
                  />
                </div>
              </div>
              <button type="submit" className="primary-btn" disabled={isLoading}>
                {isLoading ? 'Processing...' : 'Send Funds Securely'}
              </button>
            </form>
            {msg && <div className={`status-banner ${msg.includes('Success') ? 'success' : 'error'}`}>{msg}</div>}
          </section>

          <section className="card history-section">
            <div className="card-header">
              <h3>Audit Log</h3>
              <p>Real-time transaction history</p>
            </div>
            <div className="table-wrapper">
              <table>
                <thead>
                  <tr>
                    <th>Date & Time</th>
                    <th>Status</th>
                    <th>Counterparty</th>
                    <th className="text-right">Amount</th>
                  </tr>
                </thead>
                <tbody>
                  {history.map((tx) => (
                    <tr key={tx.id}>
                      <td className="date-cell">
                        {new Date(tx.timestamp).toLocaleDateString()}
                        <span className="time-sub">{new Date(tx.timestamp).toLocaleTimeString()}</span>
                      </td>
                      <td>
                        <span className={`pill ${tx.type === 'RECEIVED' ? 'pill-green' : 'pill-red'}`}>
                          {tx.type}
                        </span>
                      </td>
                      <td className="user-cell">
                        <span className="user-avatar">{tx.type === 'SENT' ? tx.receiver : tx.sender}</span>
                        <span>User {tx.type === 'SENT' ? tx.receiver : tx.sender}</span>
                      </td>
                      <td className={`amount-cell text-right ${tx.type === 'RECEIVED' ? 'text-green' : 'text-red'}`}>
                        {tx.type === 'RECEIVED' ? '+' : '-'}${tx.amount.toFixed(2)}
                      </td>
                    </tr>
                  ))}
                  {history.length === 0 && (
                    <tr><td colSpan="4" className="empty-state">No transactions yet. Start by sending money!</td></tr>
                  )}
                </tbody>
              </table>
            </div>
          </section>
        </div>
      </main>
    </div>
  );
}

export default App;