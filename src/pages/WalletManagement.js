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
    fetchWallets();
  }, []);

  const fetchWallets = async () => {
    setLoading(true);
    try {
      const response = await axios.get(
        "https://fantacy-app-backend.onrender.com/auth/admin/wallet"
      );
      const sortedWallets = response.data.sort((a, b) => b.walletId - a.walletId); // Sort by Wallet ID (Descending)
      setWallets(sortedWallets);
      setFilteredWallets(sortedWallets);
      setError(null);
    } catch (error) {
      setError("Failed to fetch wallets");
    } finally {
      setLoading(false);
    }
  };

  // Handle Block/Unblock Action
  const handleBlockUnblock = async (walletId, isBlocked) => {
    const url = `https://fantacy-app-backend.onrender.com/auth/wallet/${isBlocked ? "unblock" : "block"}/${walletId}`;
  
    try {
      const response = await axios.put(url, {}, {
        headers: {
          "Content-Type": "application/json",
        },
      });
  
      if (response.status === 200) {
        // Update wallet state locally instead of fetching again
        setWallets((prevWallets) =>
          prevWallets.map((wallet) =>
            wallet.walletId === walletId ? { ...wallet, isBlocked: !isBlocked } : wallet
          )
        );

        setFilteredWallets((prevWallets) =>
          prevWallets.map((wallet) =>
            wallet.walletId === walletId ? { ...wallet, isBlocked: !isBlocked } : wallet
          )
        );
      } else {
        throw new Error("Failed to update wallet status.");
      }
    } catch (error) {
      console.error("Error updating wallet status:", error.response?.data || error.message);
      alert("Failed to update wallet status.");
    }
  };

  // Search and Filter Function
  useEffect(() => {
    let filteredData = wallets;

    if (searchQuery) {
      filteredData = filteredData.filter(
        (wallet) =>
          wallet.walletId.toString().toLowerCase().includes(searchQuery.toLowerCase()) ||
          wallet.userId.toString().toLowerCase().includes(searchQuery.toLowerCase())
      );
    }

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
              <th>Status</th>
              <th>Created At</th>
              <th>Updated At</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {filteredWallets.length > 0 ? (
              filteredWallets.map((wallet) => (
                <tr key={wallet.walletId}>
                  <td>{wallet.walletId}</td>
                  <td>{wallet.userId}</td>
                  <td>₹ {wallet.balance}</td>
                  <td className={wallet.isBlocked ? "blocked" : "unblocked"}>
                    {wallet.isBlocked ? "Blocked" : "Active"}
                  </td>
                  <td>{new Date(wallet.createdAt).toLocaleString()}</td>
                  <td>{new Date(wallet.updatedAt).toLocaleString()}</td>
                  <td>
                    <button
                      className={wallet.isBlocked ? "unblock-btn" : "block-btn"}
                      onClick={() => handleBlockUnblock(wallet.walletId, wallet.isBlocked)}
                    >
                      {wallet.isBlocked ? "Unblock" : "Block"}
                    </button>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="7" className="no-results">No wallets found</td>
              </tr>
            )}
          </tbody>
        </table>
      )}
    </div>
  );
};

export default WalletManagement;
