import React, { useEffect, useState } from "react";
import axios from "axios";
import "./WalletManagement.css"; // Import CSS file for styling

const WalletManagement = () => {
  const [wallets, setWallets] = useState([]);
  const [filteredWallets, setFilteredWallets] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [filterStatus, setFilterStatus] = useState("");

  useEffect(() => {
    const fetchWallets = async () => {
      try {
        const response = await axios.get(
          "https://fantacy-app-backend.onrender.com/auth/admin/wallet"
        );
        setWallets(response.data);
        setFilteredWallets(response.data);
      } catch (error) {
        setError("Failed to fetch wallets");
      } finally {
        setLoading(false);
      }
    };

    fetchWallets();
  }, []);

  // Search and Filter Function
  useEffect(() => {
    let filteredData = wallets;

    // Search by Wallet ID or User ID
    if (searchQuery) {
      filteredData = filteredData.filter(
        (wallet) =>
          wallet.walletId.toString().toLowerCase().includes(searchQuery.toLowerCase()) ||
          wallet.userId.toString().toLowerCase().includes(searchQuery.toLowerCase())
      );
    }

    // Filter by Blocked Status
    if (filterStatus !== "") {
      const isBlocked = filterStatus === "blocked";
      filteredData = filteredData.filter((wallet) => wallet.isBlocked === isBlocked);
    }

    setFilteredWallets(filteredData);
  }, [searchQuery, filterStatus, wallets]);

  return (
    <div className="wallet-management-container">
      <h1>Wallet Management</h1>

      {/* Search and Filter Inputs */}
      <div className="search-filter-container">
        <input
          type="text"
          placeholder="Search by Wallet ID or User ID"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="search-input"
        />

        <select value={filterStatus} onChange={(e) => setFilterStatus(e.target.value)} className="filter-select">
          <option value="">All Wallets</option>
          <option value="blocked">Blocked</option>
          <option value="unblocked">Unblocked</option>
        </select>
      </div>

      {/* Table */}
      {loading ? (
        <p className="loading">Loading wallets...</p>
      ) : error ? (
        <p className="error">{error}</p>
      ) : (
        <table className="wallet-table">
          <thead>
            <tr>
              <th>Wallet ID</th>
              <th>User ID</th>
              <th>Balance</th>
              <th>Blocked</th>
              <th>Created At</th>
              <th>Updated At</th>
            </tr>
          </thead>
          <tbody>
            {filteredWallets.length > 0 ? (
              filteredWallets.map((wallet) => (
                <tr key={wallet.id}>
                  <td>{wallet.walletId}</td>
                  <td>{wallet.userId}</td>
                  <td>₹ {wallet.balance}</td>
                  <td>{wallet.isBlocked ? "Yes" : "No"}</td>
                  <td>{new Date(wallet.createdAt).toLocaleString()}</td>
                  <td>{new Date(wallet.updatedAt).toLocaleString()}</td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="6" className="no-results">No wallets found</td>
              </tr>
            )}
          </tbody>
        </table>
      )}
    </div>
  );
};

export default WalletManagement;
