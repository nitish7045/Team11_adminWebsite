import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { ClipLoader } from "react-spinners"; // For loading spinner
import { FaCheckCircle } from "react-icons/fa"; // For success icon

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false); // Track success state
  const navigate = useNavigate();

  const handleLogin = async () => {
    setError("");
    setSuccess(false);
    setLoading(true);

    try {
      const response = await fetch(
        "https://fantacy-app-backend.onrender.com/auth/admin/login",
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ email, password }),
        }
      );

      const data = await response.json();
      console.log("Login API Response:", data);

      if (response.ok) {
        if (!data.adminId) {
          setError("Invalid admin data received.");
          setLoading(false);
          return;
        }

        const adminData = {
          adminId: data.adminId,
          username: data.username || "Admin",
          token: data.token || "",
        };

        localStorage.setItem("adminData", JSON.stringify(adminData));

        setSuccess(true); // Set success to true
        setTimeout(() => {
          navigate("/dashboard"); // Use navigate for smoother transition
        }, 2000);
      } else {
        setError(data.message || "Invalid credentials");
        setLoading(false);
      }
    } catch (error) {
      setError("Server error. Please try again.");
      setLoading(false);
    }
  };

  return (
    <div style={styles.container}>
      <div style={styles.card}>
        <h2 style={styles.title}>Admin Login</h2>
        {error && <p style={styles.error}>{error}</p>}
        {success && (
          <div style={styles.successMessage}>
            <FaCheckCircle style={styles.successIcon} />
            <p>Login successful! Redirecting...</p>
          </div>
        )}
        <input
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          style={styles.input}
        />
        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          style={styles.input}
        />
        <button
          onClick={handleLogin}
          style={styles.buttonPrimary}
          disabled={loading || success} // Disable during loading or success
        >
          {loading ? (
            <ClipLoader size={20} color="#ffffff" /> // Loading spinner
          ) : (
            "Login"
          )}
        </button>
        <button onClick={() => navigate("/")} style={styles.buttonSecondary}>
          Home
        </button>
      </div>
    </div>
  );
};

// Styling for a modern and polished UI
const styles = {
  container: {
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "center",
    minHeight: "100vh",
    backgroundColor: "#f0f2f5",
    padding: "20px",
  },
  card: {
    backgroundColor: "#ffffff",
    padding: "40px",
    borderRadius: "12px",
    boxShadow: "0 4px 12px rgba(0, 0, 0, 0.1)",
    textAlign: "center",
    maxWidth: "400px",
    width: "100%",
    transition: "transform 0.3s ease, box-shadow 0.3s ease",
  },
  title: {
    fontSize: "2rem",
    fontWeight: "bold",
    color: "#333333",
    marginBottom: "20px",
  },
  input: {
    width: "100%",
    padding: "12px",
    margin: "10px 0",
    fontSize: "16px",
    border: "1px solid #cccccc",
    borderRadius: "8px",
    outline: "none",
    transition: "border-color 0.3s ease, box-shadow 0.3s ease",
  },
  inputFocus: {
    borderColor: "#007bff",
    boxShadow: "0 0 8px rgba(0, 123, 255, 0.3)",
  },
  buttonPrimary: {
    width: "100%",
    padding: "12px",
    fontSize: "16px",
    fontWeight: "600",
    color: "#ffffff",
    backgroundColor: "#007bff",
    border: "none",
    borderRadius: "8px",
    cursor: "pointer",
    margin: "10px 0",
    transition: "background-color 0.3s ease, transform 0.2s ease",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
  },
  buttonPrimaryHover: {
    backgroundColor: "#0056b3",
    transform: "scale(1.02)",
  },
  buttonSecondary: {
    width: "100%",
    padding: "12px",
    fontSize: "16px",
    fontWeight: "600",
    color: "#007bff",
    backgroundColor: "transparent",
    border: "2px solid #007bff",
    borderRadius: "8px",
    cursor: "pointer",
    margin: "10px 0",
    transition: "background-color 0.3s ease, color 0.3s ease, transform 0.2s ease",
  },
  buttonSecondaryHover: {
    backgroundColor: "#007bff",
    color: "#ffffff",
    transform: "scale(1.02)",
  },
  error: {
    color: "red",
    fontWeight: "bold",
    marginBottom: "10px",
    animation: "fadeIn 0.5s ease", // Fade-in animation
  },
  successMessage: {
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    color: "green",
    fontWeight: "bold",
    marginBottom: "10px",
    animation: "fadeIn 0.5s ease", // Fade-in animation
  },
  successIcon: {
    marginRight: "8px",
    fontSize: "20px",
    animation: "bounce 0.5s ease", // Bounce animation
  },
};

// Add CSS animations
const styleSheet = document.styleSheets[0];
styleSheet.insertRule(
  `@keyframes fadeIn {
    from { opacity: 0; }
    to { opacity: 1; }
  }`,
  styleSheet.cssRules.length
);
styleSheet.insertRule(
  `@keyframes bounce {
    0% { transform: scale(1); }
    50% { transform: scale(1.2); }
    100% { transform: scale(1); }
  }`,
  styleSheet.cssRules.length
);

export default Login;