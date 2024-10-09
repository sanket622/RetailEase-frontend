import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { jwtDecode } from "jwt-decode"; // Import jwt-decode correctly

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [errorEmail, setErrorEmail] = useState("");
  const [errorPassword, setErrorPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  // Check token on initial render and redirect if token is valid
  useEffect(() => {
    const token = JSON.parse(localStorage.getItem("token"));
    
    if (token) {
      try {
        const decodedToken = jwtDecode(token);
        const currentTime = Date.now() / 1000;

        // If token is valid, stay on home page
        if (decodedToken.exp > currentTime) {
          navigate("/"); // Redirect to homepage if logged in
        } else {
          // Token expired, remove it
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

  // Email validation
  const validateEmail = (email) => {
    const regex = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,6}$/;
    return regex.test(email);
  };

  // Password validation (at least one upper case, lower case, number, special character, and 8 chars)
  const validatePassword = (password) => {
    const regex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*])[A-Za-z\d!@#$%^&*]{8,}$/;
    return regex.test(password);
  };

  // Handle email validation on blur
  const handleEmailBlur = () => {
    if (!validateEmail(email)) {
      setErrorEmail("Invalid email format!");
    }
  };

  // Handle password validation on blur
  const handlePasswordBlur = () => {
    if (!validatePassword(password)) {
      setErrorPassword(
        "Password must have at least 8 characters, including upper, lower, number, and special character."
      );
    }
  };

  // Handle login request
  const handleLogin = async () => {
    // Validate if all fields are filled and correctly formatted
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
    
    // Make login request to backend
    let result = await fetch("https://retail-ease-backend-qf94.vercel.app/login", {
      method: "POST",
      body: JSON.stringify({ email, password }),
      headers: {
        "Content-Type": "application/json",
      },
    });

    result = await result.json();
    setLoading(false);

    if (result.auth) {
      // Store token and user data in localStorage
      localStorage.setItem("user", JSON.stringify(result.user));
      localStorage.setItem("token", JSON.stringify(result.auth));

      // Redirect to homepage after successful login
      navigate("/");
    } else {
      setError("Invalid email or password.");
    }
  };

  return (
    <div style={{ width: "400px", margin: "50px auto", textAlign: "center" , padding: "20px" , backgroundColor: "lightblue", border: "1px solid #ccc", borderRadius: "10px", boxShadow: "0px 0px 10px rgba(0, 0, 0, 0.1)" }}>
      <h1 style={{ marginBottom: "20px" }}>Login</h1>

      {/* Email Input */}
      <input
        type="text"
        style={{ width: "90%", padding: "10px", marginBottom: "10px", border: "1px solid #ccc", borderRadius: "5px" }}
        placeholder="Enter Email"
        onChange={(e) => setEmail(e.target.value)}
        value={email}
        onBlur={handleEmailBlur}
        onFocus={() => {
          setErrorEmail("");
          setError("");
        }}
      />
      {errorEmail && <div style={{ color: "red", marginBottom: "10px" }}>{errorEmail}</div>}

      {/* Password Input */}
      <input
        type="password"
        style={{ width: "90%", padding: "10px", marginBottom: "10px", border: "1px solid #ccc", borderRadius: "5px" }}
        placeholder="Enter Password"
        onChange={(e) => setPassword(e.target.value)}
        value={password}
        onBlur={handlePasswordBlur}
        onFocus={() => {
          setErrorPassword("");
          setError("");
        }}
      />
      {errorPassword && <div style={{ color: "red", marginBottom: "10px" }}>{errorPassword}</div>}

      {/* Login Button */}
      <button
        onClick={handleLogin}
        style={{ width: "90%", padding: "10px", backgroundColor: "#28a745", color: "#fff", border: "none", borderRadius: "5px", cursor: "pointer" }}
        type="button"
        disabled={loading}
      >
        {loading ? "Logging in..." : "Login"}
      </button>

      {/* Error Message */}
      {error && <div style={{ color: "red", marginTop: "10px" }}>{error}</div>}
    </div>
  );
};

export default Login;
