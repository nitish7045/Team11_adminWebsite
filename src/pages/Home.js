import React from "react";
import { useNavigate } from "react-router-dom";

const Home = () => {
  const navigate = useNavigate();

  return (
    <div style={styles.container}>
      <div style={styles.content}>
        <h1 style={styles.title}>Welcome to Team11 Admin Panel</h1>
        <p style={styles.subtitle}>Manage your fantasy world with ease.</p>
        <div style={styles.buttonContainer}>
          <button
            onClick={() => navigate("/login")}
            style={styles.buttonPrimary}
          >
            Admin Login
          </button>
          <button
            onClick={() => navigate("/register")}
            style={styles.buttonSecondary}
          >
            Admin Signup
          </button>
        </div>
      </div>
    </div>
  );
};

const styles = {
  container: {
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "center",
    minHeight: "100vh",
    width: "100%",
    backgroundColor: "#f0f2f5", // Light background color
    padding: "20px", // Add padding for better spacing
  },
  content: {
    textAlign: "center",
    maxWidth: "600px", // Limit content width for better readability
    padding: "40px",
    backgroundColor: "#ffffff", // White background for content
    borderRadius: "12px", // Rounded corners
    boxShadow: "0 4px 12px rgba(0, 0, 0, 0.1)", // Subtle shadow
  },
  title: {
    fontSize: "2.5rem",
    fontWeight: "bold",
    color: "#333333", // Darker text for better contrast
    marginBottom: "16px",
  },
  subtitle: {
    fontSize: "1.2rem",
    color: "#666666", // Lighter text for subtitle
    marginBottom: "32px",
  },
  buttonContainer: {
    display: "flex",
    gap: "16px", // Space between buttons
    justifyContent: "center",
  },
  buttonPrimary: {
    padding: "12px 24px",
    fontSize: "16px",
    fontWeight: "600",
    color: "#ffffff",
    backgroundColor: "#007bff", // Primary button color
    border: "none",
    borderRadius: "8px",
    cursor: "pointer",
    transition: "background-color 0.3s ease",
  },
  buttonSecondary: {
    padding: "12px 24px",
    fontSize: "16px",
    fontWeight: "600",
    color: "#007bff", // Secondary button color
    backgroundColor: "transparent",
    border: "2px solid #007bff",
    borderRadius: "8px",
    cursor: "pointer",
    transition: "background-color 0.3s ease, color 0.3s ease",
  },
};

export default Home;