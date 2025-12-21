import React, { useState, useEffect } from 'react';
import axios from 'axios';
import TransactionTable from './TransactionTable'; // The AI Component

const API_URL = 'http://127.0.0.1:5000';

function App() {
  const [token, setToken] = useState(localStorage.getItem('token'));
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [transferData, setTransferData] = useState({ receiver_id: '', amount: '' });
  const [history, setHistory] = useState([]);
  const [message, setMessage] = useState('');

  // 1. LOGIN FUNCTION
  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      const res = await axios.post(`${API_URL}/login`, { username, password });
      setToken(res.data.access_token);
      localStorage.setItem('token', res.data.access_token);
      setMessage('Login Successful!');
      fetchHistory(res.data.access_token);
    } catch (err) {
      setMessage('Login Failed. (Did you create a user in DB yet?)');
    }
  };

  // 2. TRANSFER FUNCTION
  const handleTransfer = async (e) => {
    e.preventDefault();
    try {
      const res = await axios.post(`${API_URL}/transfer`, 
        { receiver_id: parseInt(transferData.receiver_id), amount: parseFloat(transferData.amount) },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setMessage(`Success! New Balance: $${res.data.new_balance}`);
      fetchHistory(token); // Refresh table immediately
    } catch (err) {
      setMessage(`Error: ${err.response?.data?.msg || 'Transfer failed'}`);
    }
  };

  // 3. FETCH HISTORY
  const fetchHistory = async (jwt) => {
    try {
      const res = await axios.get(`${API_URL}/history`, {
        headers: { Authorization: `Bearer ${jwt}` }
      });
      setHistory(res.data);
    } catch (err) {
      console.error(err);
    }
  };

  // Logout
  const logout = () => {
    setToken(null);
    localStorage.removeItem('token');
    setHistory([]);
  };

  // --- UI RENDER ---
  if (!token) {
    return (
      <div className="p-10">
        <h2 className="text-xl font-bold mb-4">Login System</h2>
        <form onSubmit={handleLogin} className="space-y-4">
          <input className="border p-2 block" placeholder="Username" onChange={e => setUsername(e.target.value)} />
          <input className="border p-2 block" placeholder="Password" type="password" onChange={e => setPassword(e.target.value)} />
          <button className="bg-blue-500 text-white p-2 rounded">Login</button>
        </form>
        <p className="mt-4 text-red-500">{message}</p>
        <p className="text-sm text-gray-500 mt-10">
          *Tip: Since DB is empty, use MySQL Workbench to manually insert 2 users first!
          <br/>INSERT INTO user (username, password, balance) VALUES ('alice', 'pass', 1000);
          <br/>INSERT INTO user (username, password, balance) VALUES ('bob', 'pass', 1000);
        </p>
      </div>
    );
  }

  return (
    <div className="p-10 max-w-4xl mx-auto">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-2xl font-bold">Bank Dashboard</h1>
        <button onClick={logout} className="text-red-500 underline">Logout</button>
      </div>

      {/* Transfer Section */}
      <div className="bg-gray-100 p-6 rounded-lg mb-8">
        <h3 className="font-bold mb-4">Make a Transfer</h3>
        <div className="flex gap-4">
          <input 
            type="number" placeholder="Receiver ID (e.g., 2)" 
            className="border p-2 rounded"
            onChange={e => setTransferData({...transferData, receiver_id: e.target.value})}
          />
          <input 
            type="number" placeholder="Amount (e.g., 50)" 
            className="border p-2 rounded"
            onChange={e => setTransferData({...transferData, amount: e.target.value})}
          />
          <button onClick={handleTransfer} className="bg-green-600 text-white px-6 py-2 rounded">
            Send Money
          </button>
        </div>
        <p className="mt-2 font-bold text-blue-600">{message}</p>
      </div>

      {/* History Section (Using AI Component) */}
      <h3 className="font-bold mb-4">Audit Log (History)</h3>
      <TransactionTable transactions={history} />
    </div>
  );
}

export default App;