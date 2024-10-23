import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { jwtDecode } from "jwt-decode";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [errorEmail, setErrorEmail] = useState("");
  const [errorPassword, setErrorPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const navigate = useNavigate();
  useEffect(() => {
    const token = JSON.parse(localStorage.getItem("token"));

    if (token) {
      try {
        const decodedToken = jwtDecode(token);
        const currentTime = Date.now() / 1000;
        if (decodedToken.exp > currentTime) {
          navigate("/");
        } else {
          localStorage.removeItem("token");
          localStorage.removeItem("user");
        }
      } catch (error) {
        console.error("Error decoding token:", error);
        localStorage.removeItem("token");
        localStorage.removeItem("user");
      }
    }
  }, [navigate]);

  const validateEmail = (email) => {
    const regex = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,6}$/;
    return regex.test(email);
  };

  const validatePassword = (password) => {
    const regex =
      /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*])[A-Za-z\d!@#$%^&*]{8,}$/;
    return regex.test(password);
  };

  const handleEmailBlur = () => {
    if (email && !validateEmail(email)) {
      setErrorEmail("Invalid email format!");
    }
  };

  const handlePasswordBlur = () => {
    if (password && !validatePassword(password)) {
      setErrorPassword(
        "Password must have at least 8 characters, including upper, lower, number, and special character."
      );
    }
  };

  const handleLogin = async () => {
    if (!email || !password) {
      setError("Please fill in all fields.");
      return;
    }

    if (!validateEmail(email)) {
      setErrorEmail("Invalid email format!");
      return;
    }

    if (!validatePassword(password)) {
      setErrorPassword(
        "Password must have at least 8 characters, including upper, lower, number, and special character."
      );
      return;
    }

    setLoading(true);

    let result = await fetch(
      "https://retail-ease-backend-qf94.vercel.app/login",
      {
        method: "POST",
        body: JSON.stringify({ email, password }),
        headers: {
          "Content-Type": "application/json",
        },
      }
    );

    result = await result.json();
    setLoading(false);

    if (result.auth) {
      localStorage.setItem("user", JSON.stringify(result.user));
      localStorage.setItem("token", JSON.stringify(result.auth));
      navigate("/");
    } else {
      setError("Invalid email or password.");
    }
  };

  return (
    <div
      style={{
        width: "400px",
        margin: "50px auto",
        textAlign: "center",
        padding: "20px",
        backgroundColor: "lightblue",
        border: "1px solid #ccc",
        borderRadius: "10px",
        boxShadow: "0px 0px 10px rgba(0, 0, 0, 0.1)",
      }}
    >
      <h1 style={{ marginBottom: "20px" }}>Login</h1>

      {/* Email Input */}
      <input
        type="text"
        style={{
          width: "90%",
          padding: "10px",
          marginBottom: "10px",
          border: "1px solid #ccc",
          borderRadius: "5px",
        }}
        placeholder="Enter Email"
        onChange={(e) => setEmail(e.target.value)}
        value={email}
        onBlur={handleEmailBlur}
        onFocus={() => {
          setErrorEmail("");
          setError("");
        }}
      />
      {errorEmail && (
        <div style={{ color: "red", marginBottom: "10px" }}>{errorEmail}</div>
      )}
      <input
        type={showPassword ? "text" : "password"}
        style={{
          width: "90%",
          padding: "10px",
          marginBottom: "10px",
          border: "1px solid #ccc",
          borderRadius: "5px",
        }}
        placeholder="Enter Password"
        onChange={(e) => setPassword(e.target.value)}
        value={password}
        onBlur={handlePasswordBlur}
        onFocus={() => {
          setErrorPassword("");
          setError("");
        }}
      />
      {errorPassword && (
        <div style={{ color: "red", marginBottom: "10px" }}>
          {errorPassword}
        </div>
      )}
      <div
        style={{
          marginLeft: "8px",
          marginBottom: "15px",
          display: "flex",
          alignItems: "center",
        }}
      >
        <input
          type="checkbox"
          id="showPassword"
          checked={showPassword}
          onChange={() => setShowPassword(!showPassword)}
          style={{ width: "20px", height: "20px" }}
        />
        <label
          htmlFor="showPassword"
          style={{ marginLeft: "10px", fontSize: "16px" }}
        >
          Show Password
        </label>
      </div>
      <button
        onClick={handleLogin}
        style={{
          width: "90%",
          padding: "10px",
          backgroundColor: "#28a745",
          color: "#fff",
          border: "none",
          borderRadius: "5px",
          cursor: "pointer",
        }}
        type="button"
        disabled={loading}
      >
        {loading ? "Logging in..." : "Login"}
      </button>
      {error && <div style={{ color: "red", marginTop: "10px" }}>{error}</div>}
    </div>
  );
};

export default Login;
