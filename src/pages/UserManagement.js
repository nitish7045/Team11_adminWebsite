import React, { useEffect, useState } from "react";
import axios from "axios";
import "./UserManagement.css"; // Import the CSS file

const UserManagement = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [filter, setFilter] = useState("all");

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const response = await axios.get(
          "https://fantacy-app-backend.onrender.com/auth/admin/fetch-users"
        );
        
        // Sort by userId in descending order
        const sortedUsers = response.data.sort((a, b) => b.userId - a.userId);
        
        setUsers(sortedUsers);
      } catch (error) {
        setError("Failed to fetch users");
      } finally {
        setLoading(false);
      }
    };
  
    fetchUsers();
  }, []);
  

  const handleBlockUser = async (userId) => {
    try {
      await axios.put(`https://fantacy-app-backend.onrender.com/auth/block/${userId}`);
      setUsers(users.map(user => user.userId === userId ? { ...user, isBlocked: true } : user));
    } catch (error) {
      alert("Failed to block user");
    }
  };

  const handleUnblockUser = async (userId) => {
    try {
      await axios.put(`https://fantacy-app-backend.onrender.com/auth/unblock/${userId}`);
      setUsers(users.map(user => user.userId === userId ? { ...user, isBlocked: false } : user));
    } catch (error) {
      alert("Failed to unblock user");
    }
  };

  // Filtered and searched users
  const filteredUsers = users.filter((user) => {
    const matchesSearch =
    (user.email.toLowerCase().includes(searchQuery.toLowerCase())) ||
    (String(user.userId).toLowerCase().includes(searchQuery.toLowerCase()))
    
    if (filter === "blocked") return user.isBlocked && matchesSearch;
    if (filter === "unblocked") return !user.isBlocked && matchesSearch;
    return matchesSearch;
  });

  return (
    <div className="user-management-container">
      <h1>User Management</h1>
      <div className="search-filter-container">
        <input
          type="text"
          placeholder="Search by Email or User ID"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="search-input"
        />
        <select value={filter} onChange={(e) => setFilter(e.target.value)} className="filter-select">
          <option value="all">All Users</option>
          <option value="blocked">Blocked Users</option>
          <option value="unblocked">Unblocked Users</option>
        </select>
      </div>
      {loading ? (
        <p className="loading">Loading users...</p>
      ) : error ? (
        <p className="error">{error}</p>
      ) : (
        <table className="user-table">
          <thead>
            <tr>
              <th>User ID</th>
              <th>Full Name</th>
              <th>Email</th>
              <th>Phone</th>
              <th>Blocked</th>
              <th>Created At</th>
              <th>Modified At</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {filteredUsers.map((user) => (
              <tr key={user._id}>
                <td>{user.userId}</td>
                <td>{user.fullName}</td>
                <td>{user.email}</td>
                <td>{user.phone}</td>
                <td>{user.isBlocked ? "Yes" : "No"}</td>
                <td>{new Date(user.createdAt).toLocaleString()}</td>
                <td>
  {user.updatedAt
    ? new Date(user.updatedAt).toLocaleString()
    : new Date(user.createdAt).toLocaleString()}
</td>

                <td>
                  {user.isBlocked ? (
                    <button className="unblock-button" onClick={() => handleUnblockUser(user.userId)}>Unblock</button>
                  ) : (
                    <button className="block-button" onClick={() => handleBlockUser(user.userId)}>Block</button>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
};

export default UserManagement;