import React, { useEffect, useState } from "react";
import axios from "axios";
import "./Transactions.css"; // Import CSS file for styling

const Transactions = () => {
  const [transactions, setTransactions] = useState([]);
  const [filteredTransactions, setFilteredTransactions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [filterStatus, setFilterStatus] = useState("");
  const [filterType, setFilterType] = useState("");

  useEffect(() => {
    const fetchTransactions = async () => {
      try {
        const response = await axios.get(
          "https://fantacy-app-backend.onrender.com/auth/admin/transaction"
        );
        setTransactions(response.data);
        setFilteredTransactions(response.data);
      } catch (error) {
        setError("Failed to fetch transactions");
      } finally {
        setLoading(false);
      }
    };

    fetchTransactions();
  }, []);

  // Search and Filter Function
  useEffect(() => {
    let filteredData = transactions;

    // Search by Transaction ID or User ID
    if (searchQuery) {
      filteredData = filteredData.filter(
        (transaction) =>
          transaction.transactionId
            .toString()
            .toLowerCase()
            .includes(searchQuery.toLowerCase()) ||
          transaction.userId.toString().toLowerCase().includes(searchQuery.toLowerCase())
      );
    }

    // Filter by Status
    if (filterStatus) {
      filteredData = filteredData.filter((transaction) => transaction.status === filterStatus);
    }

    // Filter by Type
    if (filterType) {
      filteredData = filteredData.filter(
        (transaction) => transaction.transactionType === filterType
      );
    }

    setFilteredTransactions(filteredData);
  }, [searchQuery, filterStatus, filterType, transactions]);

  return (
    <div className="transactions-container">
      <h1>Transactions</h1>

      {/* Search and Filter Inputs */}
      <div className="search-filter-container">
        <input
          type="text"
          placeholder="Search by Transaction ID or User ID"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="search-input"
        />

        <select value={filterStatus} onChange={(e) => setFilterStatus(e.target.value)} className="filter-select">
          <option value="">All Status</option>
          <option value="complete">Complete</option>
          <option value="pending">Pending</option>
          <option value="failed">Failed</option>
        </select>

        <select value={filterType} onChange={(e) => setFilterType(e.target.value)} className="filter-select">
          <option value="">All Types</option>
          <option value="recharge">Recharge</option>
          <option value="withdrawal">Withdrawal</option>
          <option value="transfer">Transfer</option>
        </select>
      </div>

      {/* Table */}
      {loading ? (
        <p className="loading">Loading transactions...</p>
      ) : error ? (
        <p className="error">{error}</p>
      ) : (
        <table className="transaction-table">
          <thead>
            <tr>
              <th>Transaction ID</th>
              <th>User ID</th>
              <th>Wallet ID</th>
              <th>Amount</th>
              <th>Transaction Type</th>
              <th>Status</th>
              <th>Transaction Date</th>
            </tr>
          </thead>
          <tbody>
            {filteredTransactions.length > 0 ? (
              filteredTransactions.map((transaction) => (
                <tr key={transaction.id}>
                  <td>{transaction.transactionId}</td>
                  <td>{transaction.userId}</td>
                  <td>{transaction.walletId}</td>
                  <td>₹ {transaction.amount}</td>
                  <td>{transaction.transactionType}</td>
                  <td>{transaction.status}</td>
                  <td>{new Date(transaction.transactionDate).toLocaleString()}</td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="7" className="no-results">No transactions found</td>
              </tr>
            )}
          </tbody>
        </table>
      )}
    </div>
  );
};

export default Transactions;
