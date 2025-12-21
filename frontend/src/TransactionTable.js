import React, { useState } from 'react';
import './TransactionTable.css'; // Import the CSS we just made

const TransactionTable = ({ transactions }) => {
  const [data, setData] = useState(transactions);
  const [sortConfig, setSortConfig] = useState({ key: null, direction: 'asc' });

  // Update data when props change (e.g., after a new transfer)
  React.useEffect(() => {
    setData(transactions);
  }, [transactions]);

  const sortData = (key) => {
    let direction = 'asc';
    if (sortConfig.key === key && sortConfig.direction === 'asc') {
      direction = 'desc';
    }

    const sortedData = [...data].sort((a, b) => {
      if (a[key] < b[key]) return direction === 'asc' ? -1 : 1;
      if (a[key] > b[key]) return direction === 'asc' ? 1 : -1;
      return 0;
    });

    setData(sortedData);
    setSortConfig({ key, direction });
  };

  const getSortIndicator = (name) => {
    if (sortConfig.key !== name) return ' ↕';
    return sortConfig.direction === 'asc' ? ' ↑' : ' ↓';
  };

  if (!data || data.length === 0) {
    return <div style={{ padding: '20px', color: '#666' }}>No transaction history found.</div>;
  }

  return (
    <div className="table-container">
      <table className="styled-table">
        <thead>
          <tr>
            <th className="sort-header" onClick={() => sortData('timestamp')}>
              Date {getSortIndicator('timestamp')}
            </th>
            <th>Type</th>
            <th>Sender ID</th>
            <th>Receiver ID</th>
            <th className="sort-header" onClick={() => sortData('amount')}>
              Amount {getSortIndicator('amount')}
            </th>
          </tr>
        </thead>
        <tbody>
          {data.map((txn) => (
            <tr key={txn.id}>
              <td>{new Date(txn.timestamp).toLocaleString()}</td>
              <td>
                <span className={`badge ${txn.type === 'SENT' ? 'badge-sent' : 'badge-received'}`}>
                  {txn.type}
                </span>
              </td>
              <td>{txn.sender}</td>
              <td>{txn.receiver}</td>
              <td style={{ fontWeight: 'bold' }}>
                ${txn.amount.toFixed(2)}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default TransactionTable;