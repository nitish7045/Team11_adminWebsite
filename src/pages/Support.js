import React from "react";
import { FaEnvelope, FaPhone, FaQuestionCircle } from "react-icons/fa";

const SupportPage = () => {
  return (
    <div style={styles.container}>
      <h2 style={styles.heading}>💬 Team11 Fantasy Admin Support</h2>
      <p style={styles.description}>
        Need help? Contact us anytime! Our support team is available 24/7 to assist you.
      </p>

      <div style={styles.supportOptions}>
        <div style={styles.card}>
          <FaEnvelope style={styles.icon} />
          <h3 style={styles.cardTitle}>Email Support</h3>
          <p style={styles.cardText}>Send us an email for any queries.</p>
          <a href="mailto:support@team11fantasy.com" style={styles.link}>
            support@team11fantasy.com
          </a>
        </div>

        <div style={styles.card}>
          <FaPhone style={styles.icon} />
          <h3 style={styles.cardTitle}>Phone Support</h3>
          <p style={styles.cardText}>Call us for quick support.</p>
          <p style={styles.phone}>+91 9876543210</p>
        </div>

        <div style={styles.card}>
          <FaQuestionCircle style={styles.icon} />
          <h3 style={styles.cardTitle}>FAQs</h3>
          <p style={styles.cardText}>Find answers to common questions.</p>
          {/* < style={styles.link}>Visit FAQs</a> */}
        </div>
      </div>

      {/* <button style={styles.homeButton} onClick={() => window.location.href = "/"}>
        Go to Home
      </button> */}
    </div>
  );
};

// CSS-in-JS for modern styling
const styles = {
  container: {
    maxWidth: "1100px",
    margin: "50px auto",
    padding: "30px",
    textAlign: "center",
    borderRadius: "12px",
    boxShadow: "0px 4px 12px rgba(0, 0, 0, 0.1)",
    backgroundColor: "#fff",
  },
  heading: {
    fontSize: "24px",
    fontWeight: "bold",
    color: "#333",
  },
  description: {
    fontSize: "16px",
    color: "#666",
    marginBottom: "20px",
  },
  supportOptions: {
    display: "grid",
    gridTemplateColumns: "1fr",
    gap: "15px",
  },
  card: {
    padding: "20px",
    borderRadius: "10px",
    boxShadow: "0px 4px 8px rgba(0, 0, 0, 0.1)",
    backgroundColor: "#f9f9f9",
    transition: "all 0.3s ease",
    cursor: "pointer",
  },
  cardTitle: {
    fontSize: "18px",
    fontWeight: "bold",
    margin: "10px 0",
  },
  cardText: {
    fontSize: "14px",
    color: "#666",
    marginBottom: "8px",
  },
  link: {
    color: "#007bff",
    fontWeight: "bold",
    textDecoration: "none",
  },
  phone: {
    fontSize: "16px",
    fontWeight: "bold",
    color: "#333",
  },
  icon: {
    fontSize: "30px",
    color: "#007bff",
    marginBottom: "10px",
  },
  homeButton: {
    marginTop: "20px",
    padding: "10px 15px",
    fontSize: "16px",
    fontWeight: "bold",
    backgroundColor: "#007bff",
    color: "#fff",
    border: "none",
    borderRadius: "8px",
    cursor: "pointer",
    transition: "all 0.3s ease",
  },
};

export default SupportPage;
