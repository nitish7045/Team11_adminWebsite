import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { ClipLoader } from "react-spinners";
import { FaCheckCircle } from "react-icons/fa";

const AdminRegister = () => {
  const [formData, setFormData] = useState({
    username: "",
    email: "",
    password: "",
  });
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const navigate = useNavigate();

  // **Temporary flag to disable registration**
  const isRegistrationDisabled = true; // Change this to false to enable registration

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (isRegistrationDisabled) {
      setError("Admin registration is temporarily disabled.");
      return;
    }

    setMessage("");
    setError("");
    setLoading(true);

    try {
      const response = await axios.post(
        "https://fantacy-app-backend.onrender.com/auth/admin/register",
        formData
      );

      console.log(response.data);
      setMessage(response.data.message);
      setSuccess(true);
      setFormData({ username: "", email: "", password: "" });

      setTimeout(() => {
        navigate("/login");
      }, 2000);
    } catch (err) {
      console.error("Registration Error:", err.response?.data || err.message);
      setError(err.response?.data?.message || "Registration failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={styles.container}>
      <h2 style={styles.title}>Admin Registration</h2>
      {isRegistrationDisabled && (
        <p style={styles.disabledMessage}>
          Admin registration is temporarily disabled. Please try again later.
        </p>
      )}
      <form onSubmit={handleSubmit} style={styles.form}>
        <input
          type="text"
          name="username"
          placeholder="Username"
          value={formData.username}
          onChange={handleChange}
          required
          style={styles.input}
          disabled={isRegistrationDisabled} // Disable input if registration is disabled
        />
        <input
          type="email"
          name="email"
          placeholder="Email"
          value={formData.email}
          onChange={handleChange}
          required
          style={styles.input}
          disabled={isRegistrationDisabled}
        />
        <input
          type="password"
          name="password"
          placeholder="Password"
          value={formData.password}
          onChange={handleChange}
          required
          style={styles.input}
          disabled={isRegistrationDisabled}
        />
        <button
          type="submit"
          style={styles.buttonPrimary}
          disabled={loading || success || isRegistrationDisabled}
        >
          {loading ? <ClipLoader size={20} color="#ffffff" /> : "Register"}
        </button>
      </form>
      {message && (
        <div style={styles.successMessage}>
          <FaCheckCircle style={styles.successIcon} />
          <p>{message}</p>
        </div>
      )}
      {error && <p style={styles.error}>{error}</p>}
      <br />
      <button onClick={() => navigate("/")} style={styles.buttonSecondary}>
        Home
      </button>
    </div>
  );
};

// Styling for a modern UI
const styles = {
  container: {
    maxWidth: "400px",
    margin: "50px auto",
    padding: "40px",
    border: "1px solid #ddd",
    borderRadius: "12px",
    boxShadow: "0px 4px 12px rgba(0, 0, 0, 0.1)",
    textAlign: "center",
    backgroundColor: "#ffffff",
  },
  title: {
    fontSize: "2rem",
    fontWeight: "bold",
    color: "#333333",
    marginBottom: "20px",
  },
  disabledMessage: {
    fontSize: "18px",
    fontWeight: "bold",
    color: "red",
    textAlign: "center",
  },
  form: {
    display: "flex",
    flexDirection: "column",
  },
  input: {
    margin: "10px 0",
    padding: "12px",
    fontSize: "16px",
    borderRadius: "8px",
    border: "1px solid #ccc",
    outline: "none",
  },
  buttonPrimary: {
    padding: "12px",
    backgroundColor: "#007bff",
    color: "white",
    border: "none",
    borderRadius: "8px",
    cursor: "pointer",
    fontSize: "16px",
    fontWeight: "600",
    margin: "10px 0",
  },
  buttonSecondary: {
    padding: "12px",
    backgroundColor: "transparent",
    color: "#007bff",
    border: "2px solid #007bff",
    borderRadius: "8px",
    cursor: "pointer",
    fontSize: "16px",
    fontWeight: "600",
    margin: "10px 0",
  },
  successMessage: {
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    color: "green",
    fontWeight: "bold",
    marginTop: "10px",
  },
  successIcon: {
    marginRight: "8px",
    fontSize: "20px",
  },
  error: {
    color: "red",
    fontWeight: "bold",
    marginTop: "10px",
  },
};

export default AdminRegister;
