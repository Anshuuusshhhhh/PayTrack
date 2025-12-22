import React from 'react';
import { Download, TrendingUp, Filter, Calendar } from 'lucide-react';

// 1. Define the shape of the data coming from Python
interface TransactionProp {
  id: number;
  timestamp: string;
  type: 'SENT' | 'RECEIVED';
  sender: number;
  receiver: number;
  amount: number;
}

// 2. Accept 'transactions' as a prop
export default function AuditLog({ transactions }: { transactions: TransactionProp[] }) {
  
  const handleExport = () => {
    console.log('Exporting transaction history...');
    alert("Export feature coming soon!"); 
  };

  return (
    <div className="bg-white rounded-2xl p-6 shadow-lg border border-slate-100 hover:shadow-xl transition-shadow">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-blue-600 to-cyan-600 flex items-center justify-center shadow-lg">
            <TrendingUp className="w-6 h-6 text-white" />
          </div>
          <div>
            <h2 className="text-slate-900 text-xl" style={{ fontWeight: 700 }}>
              Transaction History
            </h2>
            <p className="text-slate-500 text-sm">All your recent transactions</p>
          </div>
        </div>
        
        <div className="flex items-center gap-2">
          <button
            className="flex items-center gap-2 px-4 py-2 text-slate-600 hover:bg-slate-100 rounded-xl transition-colors border border-slate-200"
          >
            <Calendar className="w-4 h-4" />
            <span className="text-sm" style={{ fontWeight: 600 }}>Filter</span>
          </button>
          <button
            onClick={handleExport}
            className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-indigo-600 to-purple-600 text-white hover:from-indigo-700 hover:to-purple-700 rounded-xl transition-all shadow-md"
            aria-label="Export transaction history"
          >
            <Download className="w-4 h-4" />
            <span className="text-sm" style={{ fontWeight: 600 }}>Export</span>
          </button>
        </div>
      </div>
      
      {/* Table */}
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className="bg-gradient-to-r from-slate-50 to-blue-50 border-b-2 border-indigo-100">
              <th className="px-4 py-4 text-left text-xs text-slate-600 uppercase tracking-wider" style={{ fontWeight: 600 }}>
                Date & Time
              </th>
              <th className="px-4 py-4 text-left text-xs text-slate-600 uppercase tracking-wider" style={{ fontWeight: 600 }}>
                Type
              </th>
              <th className="px-4 py-4 text-left text-xs text-slate-600 uppercase tracking-wider" style={{ fontWeight: 600 }}>
                Sender
              </th>
              <th className="px-4 py-4 text-left text-xs text-slate-600 uppercase tracking-wider" style={{ fontWeight: 600 }}>
                Receiver
              </th>
              <th className="px-4 py-4 text-left text-xs text-slate-600 uppercase tracking-wider" style={{ fontWeight: 600 }}>
                Status
              </th>
              <th className="px-4 py-4 text-right text-xs text-slate-600 uppercase tracking-wider" style={{ fontWeight: 600 }}>
                Amount
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {transactions.map((transaction) => (
              <tr 
                key={transaction.id}
                className="hover:bg-gradient-to-r hover:from-slate-50 hover:to-blue-50 transition-all cursor-pointer group"
              >
                {/* Date Column */}
                <td className="px-4 py-4 text-sm text-slate-600">
                  <div className="flex items-center gap-2">
                    <Calendar className="w-4 h-4 text-slate-400 group-hover:text-indigo-500 transition-colors" />
                    {new Date(transaction.timestamp).toLocaleString()}
                  </div>
                </td>

                {/* Type Column */}
                <td className="px-4 py-4">
                  {transaction.type === 'SENT' ? (
                    <span className="inline-flex items-center px-3 py-1.5 rounded-lg text-xs bg-gradient-to-r from-orange-100 to-red-100 text-red-700 border border-red-200" style={{ fontWeight: 600 }}>
                      ↑ SENT
                    </span>
                  ) : (
                    <span className="inline-flex items-center px-3 py-1.5 rounded-lg text-xs bg-gradient-to-r from-emerald-100 to-green-100 text-emerald-700 border border-emerald-200" style={{ fontWeight: 600 }}>
                      ↓ RECEIVED
                    </span>
                  )}
                </td>

                {/* Sender Column */}
                <td className="px-4 py-4 text-sm">
                  <div className="flex items-center gap-2">
                    <div className="w-8 h-8 rounded-full bg-gradient-to-br from-blue-400 to-indigo-500 flex items-center justify-center text-white text-xs shadow-md">
                      {transaction.sender.toString().slice(-2)}
                    </div>
                    <span className="text-slate-700" style={{ fontWeight: 600 }}>
                      ACC-{transaction.sender}
                    </span>
                  </div>
                </td>

                {/* Receiver Column */}
                <td className="px-4 py-4 text-sm">
                  <div className="flex items-center gap-2">
                    <div className="w-8 h-8 rounded-full bg-gradient-to-br from-purple-400 to-pink-500 flex items-center justify-center text-white text-xs shadow-md">
                      {transaction.receiver.toString().slice(-2)}
                    </div>
                    <span className="text-slate-700" style={{ fontWeight: 600 }}>
                      ACC-{transaction.receiver}
                    </span>
                  </div>
                </td>

                {/* Status Column (Hardcoded to Completed because DB Transactions are atomic) */}
                <td className="px-4 py-4">
                  <span className="inline-flex items-center px-3 py-1 rounded-full text-xs bg-emerald-100 text-emerald-700">
                    ✓ Completed
                  </span>
                </td>

                {/* Amount Column */}
                <td className={`px-4 py-4 text-sm text-right ${
                  transaction.type === 'RECEIVED' ? 'text-emerald-600' : 'text-slate-700'
                }`} style={{ fontWeight: 700 }}>
                  <div className="flex items-center justify-end gap-2">
                    {transaction.type === 'RECEIVED' && <span className="text-emerald-500">+</span>}
                    {transaction.type === 'SENT' && <span className="text-red-500">-</span>}
                    ${transaction.amount.toFixed(2)}
                  </div>
                </td>
              </tr>
            ))}

            {/* Empty State Message */}
            {transactions.length === 0 && (
              <tr>
                <td colSpan={6} className="text-center py-10 text-slate-500">
                  No transactions found yet. Try sending some money!
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}