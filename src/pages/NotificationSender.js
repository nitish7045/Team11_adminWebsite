import { height } from "@fortawesome/free-solid-svg-icons/fa0";
import React, { useState } from "react";

const NotificationSender = () => {
  const [type, setType] = useState("");
  const [message, setMessage] = useState("");
  const [audience, setAudience] = useState("");
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);

  const sendNotification = async () => {
    setError(null); // Reset error before sending

    if (!type || !message || !audience) {
      setError("All fields are required!");
      return;
    }

    setLoading(true); // Show loading state
    try {
      const response = await fetch("https://fantacy-app-backend.onrender.com/auth/send-notification", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ type, message, audience }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Failed to send notification");
      }

      alert(`✅ Notification sent successfully to ${data.sentTo} users!`);
      setType("");
      setMessage("");
      setAudience("");
    } catch (error) {
      console.error("Error sending notification:", error);
      setError(error.message || "Error sending notification");
    } finally {
      setLoading(false);
    }
  };

  // Styles
  const styles = {
    container: {
      fontFamily: 'Arial, sans-serif',
      maxWidth: '1700px',
      margin: '0 auto',
      padding: '20px',
      borderRadius: '8px',
      boxShadow: '0 0 10px rgba(0, 0, 0, 0.1)',
      backgroundColor: '#fff',
      height:"100%",
    },
    header: {
      textAlign: 'center',
      color: '#333',
      marginBottom: '20px',
    },
    label: {
      display: 'block',
      marginBottom: '8px',
      fontWeight: 'bold',
      color: '#555',
    },
    input: {
      width: '100%',
      padding: '10px',
      marginBottom: '16px',
      border: '1px solid #ddd',
      borderRadius: '4px',
      fontSize: '16px',
      boxSizing: 'border-box',
    },
    datalist: {
      width: '100%',
      padding: '10px',
      marginBottom: '16px',
      border: '1px solid #ddd',
      borderRadius: '4px',
      fontSize: '16px',
    },
    select: {
      width: '100%',
      padding: '10px',
      marginBottom: '16px',
      border: '1px solid #ddd',
      borderRadius: '4px',
      fontSize: '16px',
      backgroundColor: '#fff',
    },
    button: {
      width: '100%',
      padding: '12px',
      backgroundColor: '#007BFF',
      color: '#fff',
      border: 'none',
      borderRadius: '4px',
      fontSize: '16px',
      cursor: 'pointer',
      transition: 'background-color 0.2s',
    },
    buttonDisabled: {
      backgroundColor: '#ccc',
      cursor: 'not-allowed',
    },
    error: {
      color: 'red',
      textAlign: 'center',
      marginBottom: '16px',
    },
  };

  return (
    <div style={styles.container}>
      <h2 style={styles.header}>Send Push Notification</h2>
      {error && <p style={styles.error}>❌ {error}</p>}

      {/* Notification Type Input with Datalist */}
      <label style={styles.label}>Notification Type:</label>
      <input
        type="text"
        list="notification-types"
        placeholder="Select or type notification type"
        value={type}
        onChange={(e) => setType(e.target.value)}
        disabled={loading}
        style={styles.input}
      />
      <datalist id="notification-types" style={styles.datalist}>
        <option value="match_update" />
        <option value="winner_announcement" />
        <option value="bonus_offer" />
        <option value="system_alert" />
        <option value="general_info" />
      </datalist>

      {/* Message Input */}
      <label style={styles.label}>Message:</label>
      <input
        type="text"
        placeholder="Enter message"
        value={message}
        onChange={(e) => setMessage(e.target.value)}
        disabled={loading}
        style={styles.input}
      />

      {/* Audience Dropdown */}
      <label style={styles.label}>Target Audience:</label>
      <select
        value={audience}
        onChange={(e) => setAudience(e.target.value)}
        disabled={loading}
        style={styles.select}
      >
        <option value="">Select Audience</option>
        <option value="all_users">All Users</option>
        <option value="active_users_24h">Active Users (Last 24h)</option>
        <option value="inactive_users_7d">Inactive Users (Last 7 Days)</option>
        <option value="pending_withdrawals">Users with Pending Withdrawals</option>
        <option value="bonus_wallet_users">Users with Bonus Wallet</option>
      </select>

      {/* Send Button */}
      <button
        onClick={sendNotification}
        disabled={loading}
        style={{ ...styles.button, ...(loading ? styles.buttonDisabled : {}) }}
      >
        {loading ? "Sending..." : "Send Notification"}
      </button>
    </div>
  );
};

export default NotificationSender;