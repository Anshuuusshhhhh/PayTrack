import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Navbar from './components/Navbar';
import StatsCards1 from './components/StatsCards';
import QuickTransfer from './components/QuickTransfer';
import AuditLog from './components/AuditLog';
import './styles/globals.css'; // Ensure your styles are imported
import './index.css'; 

const API_URL = 'http://127.0.0.1:5000';

function App() {
  // --- STATE MANAGEMENT ---
  const [token, setToken] = useState<string | null>(localStorage.getItem('token'));
  const [stats, setStats] = useState({ balance: 0, total_sent: 0, total_received: 0, tx_count: 0, username: 'Guest' });
  const [history, setHistory] = useState([]);
  
  // Login States
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [loginError, setLoginError] = useState('');

  // --- 1. INITIAL LOAD ---
  useEffect(() => {
    if (token) {
      fetchDashboardData();
      fetchHistory();
    }
  }, [token]);

  // --- 2. API CALLS ---
  const fetchDashboardData = async () => {
    try {
      const res = await axios.get(`${API_URL}/dashboard-stats`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setStats(res.data);
    } catch (err) {
      console.error("Error fetching stats", err);
    }
  };

  const fetchHistory = async () => {
    try {
      const res = await axios.get(`${API_URL}/history`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setHistory(res.data);
    } catch (err) {
      console.error("Error fetching history", err);
    }
  };

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const res = await axios.post(`${API_URL}/login`, { username, password });
      const newToken = res.data.access_token;
      setToken(newToken);
      localStorage.setItem('token', newToken);
      setLoginError('');
    } catch (err) {
      setLoginError('Invalid credentials');
    }
  };

  const handleLogout = () => {
    setToken(null);
    localStorage.removeItem('token');
  };

  // Wrapper function to pass to QuickTransfer component
  const onTransferSuccess = () => {
    fetchDashboardData(); // Refresh Balance
    fetchHistory();       // Refresh Table
  };

  // --- 3. RENDER ---

  // If NOT logged in, show simple Login Screen
  if (!token) {
    return (
      <div className="flex items-center justify-center h-screen bg-slate-100">
        <div className="bg-white p-8 rounded-lg shadow-md w-96">
          <h2 className="text-2xl font-bold text-slate-800 mb-6">PayTrack Login</h2>
          <form onSubmit={handleLogin} className="space-y-4">
            <input 
              className="w-full border p-2 rounded" 
              placeholder="Username" 
              value={username} onChange={e => setUsername(e.target.value)} 
            />
            <input 
              className="w-full border p-2 rounded" 
              placeholder="Password" type="password" 
              value={password} onChange={e => setPassword(e.target.value)} 
            />
            <button className="w-full bg-blue-600 text-white p-2 rounded hover:bg-blue-700">
              Sign In
            </button>
            {loginError && <p className="text-red-500 text-sm">{loginError}</p>}
          </form>
        </div>
      </div>
    );
  }

  // If Logged In, Show Dashboard
  return (
    <div className="min-h-screen bg-slate-50">
      <Navbar username={stats.username} onLogout={handleLogout} />
      
      <main className="p-8 max-w-7xl mx-auto space-y-8">
        
        {/* Pass real stats to the Cards */}
        <StatsCards 
          balance={stats.balance} 
          sent={stats.total_sent} 
          received={stats.total_received} 
          count={stats.tx_count} 
        />

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Quick Transfer Form */}
          <div className="lg:col-span-1">
            <QuickTransfer token={token} onSuccess={onTransferSuccess} />
          </div>

          {/* Audit Log Table */}
          <div className="lg:col-span-2">
            <AuditLog transactions={history} />
          </div>
        </div>
      </main>
    </div>
  );
}

export default App;