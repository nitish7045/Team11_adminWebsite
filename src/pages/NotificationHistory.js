import React, { useEffect, useState, useMemo } from "react";

const NotificationHistory = () => {
  const [notifications, setNotifications] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [filterType, setFilterType] = useState("");

  useEffect(() => {
    fetchNotificationHistory();
  }, []);

  const fetchNotificationHistory = async () => {
    try {
      const response = await fetch(
        "https://fantacy-app.onrender.com/auth/notification-history"
      );
      const data = await response.json();
      if (data.success) {
        setNotifications(data.notifications);
      } else {
        console.error("Error fetching history:", data.error);
      }
    } catch (error) {
      console.error("Error:", error);
    }
  };

  // Filtered notifications using useMemo for performance boost
  const filteredNotifications = useMemo(() => {
    return notifications.filter((noti) => {
      return (
        (filterType === "" || noti.type.toLowerCase() === filterType.toLowerCase()) &&
        (searchQuery === "" ||
          noti.message.toLowerCase().includes(searchQuery.toLowerCase()) ||
          noti.expoPushToken.toLowerCase().includes(searchQuery.toLowerCase()))
      );
    });
  }, [notifications, searchQuery, filterType]);

  return (
    <div style={{ fontFamily: "Arial, sans-serif", padding: "20px", maxWidth: "1700px", margin: "0 auto", }}>
      <h2 style={{ textAlign: "center", color: "#333", marginBottom: "20px" }}>Notification History</h2>

      {/* Search & Filter Section */}
      <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "10px" }}>
        <input
          type="text"
          placeholder="Search notifications..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          style={{
            padding: "8px",
            width: "40%",
            borderRadius: "5px",
            border: "1px solid #ccc",
          }}
        />
        <select
          value={filterType}
          onChange={(e) => setFilterType(e.target.value)}
          style={{
            padding: "8px",
            borderRadius: "5px",
            border: "1px solid #ccc",
          }}
        >
          <option value="">All Types</option>
          <option value="Match Result Declared">Match Result Declared</option>
          <option value="New Cricket Match Added">New Cricket Match Added</option>
          <option value="New Football Match Added">New Football Match Added</option>
        </select>
      </div>

      {/* Table */}
      <table style={{ width: "100%", borderCollapse: "collapse", boxShadow: "0 0 10px rgba(0, 0, 0, 0.1)" ,marginTop:"30px",alignContent:"center"}}>
      <thead>
  <tr>
    <th style={{ backgroundColor: "#007BFF", color: "#fff", padding: "12px", textAlign: "center" }}>
      Notification ID
    </th>
    <th style={{ backgroundColor: "#007BFF", color: "#fff", padding: "12px", textAlign: "center" }}>
      Type
    </th>
    <th style={{ backgroundColor: "#007BFF", color: "#fff", padding: "12px", textAlign: "center" }}>
      Message
    </th>
    <th style={{ backgroundColor: "#007BFF", color: "#fff", padding: "12px", textAlign: "center" }}>
      Sent At (IST)
    </th>
    <th style={{ backgroundColor: "#007BFF", color: "#fff", padding: "12px", textAlign: "center" }}>
      Push Token
    </th>
  </tr>
</thead>

        <tbody >
          {filteredNotifications.length > 0 ? (
            filteredNotifications.map((noti, index) => (
              <tr
                key={noti.notiId}
                style={{
                  backgroundColor: index % 2 === 0 ? "#fff" : "#f9f9f9",
                  transition: "background-color 0.2s",
                }}
                onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = "#f1f1f1")}
                onMouseLeave={(e) =>
                  (e.currentTarget.style.backgroundColor = index % 2 === 0 ? "#fff" : "#f9f9f9")
                }
              >
                <td style={{ padding: "12px", borderBottom: "1px solid #ddd" }}>{noti.notiId}</td>
                <td style={{ padding: "12px", borderBottom: "1px solid #ddd" }}>{noti.type}</td>
                <td style={{ padding: "12px", borderBottom: "1px solid #ddd" }}>{noti.message}</td>
                <td style={{ padding: "12px", borderBottom: "1px solid #ddd" }}>
  {new Date(noti.createdAt).toLocaleString("en-IN", {
    timeZone: "Asia/Kolkata",
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
    hour12: true,
  })}
</td>

                <td style={{ padding: "12px", borderBottom: "1px solid #ddd" }}>{noti.expoPushToken}</td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan="5" style={{ textAlign: "center", padding: "20px" }}>
                No matching notifications found.
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
};

export default NotificationHistory;
