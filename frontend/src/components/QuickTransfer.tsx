import React, { useState } from 'react';
import axios from 'axios';
import { Send, Users, DollarSign, CheckCircle, AlertCircle } from 'lucide-react';

// 1. Define Props to accept Token and Refresh Callback
interface QuickTransferProps {
  token: string | null;
  onSuccess: () => void;
}

const API_URL = 'http://127.0.0.1:5000';

export default function QuickTransfer({ token, onSuccess }: QuickTransferProps) {
  const [receiverId, setReceiverId] = useState('');
  const [amount, setAmount] = useState('');
  const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  // 2. The Real Backend Connection
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setMessage(null);
    
    if (!receiverId || !amount) {
      setMessage({ type: 'error', text: 'Please fill in all fields' });
      return;
    }
    
    if (parseFloat(amount) <= 0) {
      setMessage({ type: 'error', text: 'Amount must be greater than zero' });
      return;
    }

    setIsLoading(true);

    try {
      // Logic: Strip "ACC-" if the user typed it, so we send just the integer ID (e.g., "ACC-2" -> 2)
      const cleanReceiverId = receiverId.toString().replace(/[^0-9]/g, '');

      await axios.post(`${API_URL}/transfer`, 
        { 
          receiver_id: parseInt(cleanReceiverId), 
          amount: parseFloat(amount) 
        },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      
      // Success!
      setMessage({ type: 'success', text: 'Transfer Complete' });
      onSuccess(); // Tell App.tsx to refresh the Dashboard stats
      
      // Reset form
      setReceiverId('');
      setAmount('');
      
      // Clear success message after 3 seconds
      setTimeout(() => setMessage(null), 3000);

    } catch (err: any) {
      // Error Handling
      const errorText = err.response?.data?.msg || 'Transfer Failed';
      setMessage({ type: 'error', text: errorText });
    } finally {
      setIsLoading(false);
    }
  };

  // Recent contacts (Updated with IDs that likely exist in your demo DB)
  // Clicking these will fill the form
  const recentContacts = [
    { id: '2', display: 'ACC-2', name: 'Bob K.', avatar: 'BK' },
    { id: '3', display: 'ACC-3', name: 'Carol S.', avatar: 'CS' },
    { id: '1', display: 'ACC-1', name: 'Alice M.', avatar: 'AM' }
  ];

  return (
    <div className="bg-white rounded-2xl p-6 shadow-lg border border-slate-100 hover:shadow-xl transition-shadow h-full">
      {/* Header with gradient */}
      <div className="flex items-center gap-3 mb-6">
        <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-indigo-600 to-purple-600 flex items-center justify-center shadow-lg">
          <Send className="w-6 h-6 text-white" />
        </div>
        <div>
          <h2 className="text-slate-900 text-xl" style={{ fontWeight: 700 }}>
            Quick Transfer
          </h2>
          <p className="text-slate-500 text-sm">Send money securely</p>
        </div>
      </div>
      
      {/* Recent Contacts */}
      <div className="mb-6">
        <p className="text-slate-600 text-sm mb-3" style={{ fontWeight: 600 }}>Recent Contacts</p>
        <div className="flex gap-3">
          {recentContacts.map((contact) => (
            <button
              key={contact.id}
              type="button"
              onClick={() => setReceiverId(contact.id)}
              className="flex flex-col items-center gap-2 hover:bg-slate-50 p-2 rounded-xl transition-colors group"
            >
              <div className="w-12 h-12 rounded-full bg-gradient-to-br from-blue-400 to-indigo-500 flex items-center justify-center text-white shadow-md group-hover:scale-105 transition-transform">
                <span className="text-xs" style={{ fontWeight: 600 }}>{contact.avatar}</span>
              </div>
              <span className="text-xs text-slate-600">{contact.name}</span>
            </button>
          ))}
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-5">
        {/* Receiver ID Input */}
        <div>
          <label htmlFor="receiverId" className="block text-sm text-slate-700 mb-2" style={{ fontWeight: 600 }}>
            <div className="flex items-center gap-2">
              <Users className="w-4 h-4 text-indigo-500" />
              Receiver ID
            </div>
          </label>
          <input
            id="receiverId"
            type="text"
            value={receiverId}
            onChange={(e) => setReceiverId(e.target.value)}
            placeholder="Enter receiver ID (e.g. 2)"
            className="w-full px-4 py-3 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all bg-slate-50"
          />
        </div>
        
        {/* Amount Input */}
        <div>
          <label htmlFor="amount" className="block text-sm text-slate-700 mb-2" style={{ fontWeight: 600 }}>
            <div className="flex items-center gap-2">
              <DollarSign className="w-4 h-4 text-emerald-500" />
              Amount
            </div>
          </label>
          <div className="relative">
            <span className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 text-2xl">$</span>
            <input
              id="amount"
              type="number"
              step="0.01"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              placeholder="0.00"
              className="w-full pl-10 pr-4 py-3 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all text-2xl bg-slate-50"
            />
          </div>
        </div>
        
        {/* Submit Button */}
        <button
          type="submit"
          disabled={isLoading}
          className={`w-full bg-gradient-to-r from-indigo-600 to-purple-600 text-white py-4 rounded-xl hover:from-indigo-700 hover:to-purple-700 transition-all flex items-center justify-center gap-2 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 ${isLoading ? 'opacity-75 cursor-not-allowed' : ''}`}
        >
          {isLoading ? (
            <span className="animate-pulse">Processing...</span>
          ) : (
            <>
              <Send className="w-5 h-5" />
              <span style={{ fontWeight: 600 }}>Send Funds Securely</span>
            </>
          )}
        </button>
        
        {/* Feedback Message */}
        {message && (
          <div className={`text-center py-3 px-4 rounded-xl flex items-center justify-center gap-2 ${
            message.type === 'success' 
              ? 'bg-gradient-to-r from-emerald-50 to-green-50 text-emerald-700 border border-emerald-200' 
              : 'bg-gradient-to-r from-red-50 to-orange-50 text-red-600 border border-red-200'
          }`}>
            {message.type === 'success' ? <CheckCircle className="w-5 h-5" /> : <AlertCircle className="w-5 h-5" />}
            <span style={{ fontWeight: 600 }}>{message.text}</span>
          </div>
        )}
      </form>
    </div>
  );
}