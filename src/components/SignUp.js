import React, { useState, useEffect } from "react";
import { jwtDecode } from "jwt-decode";
import { useNavigate } from "react-router-dom";

const SignUp = () => {
    const [name, setName] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState("");
    const [errorEmail, setErrorEmail] = useState("");
    const [errorPassword, setErrorPassword] = useState("");
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();

    useEffect(() => {
        const token = JSON.parse(localStorage.getItem("token"));
        if (token) {
            try {
                const decodedToken = jwtDecode(token);
                const currentTime = Date.now() / 1000;

                // If token is still valid, redirect to home
                if (decodedToken.exp > currentTime) {
                    navigate("/"); // Stay on the current page if logged in
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
        const regex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*])[A-Za-z\d!@#$%^&*]{8,}$/;
        return regex.test(password);
    };

    const handleEmailBlur = () => {
        if (!validateEmail(email)) {
            setErrorEmail("Invalid email format!");
        }
    };

    const handlePasswordBlur = () => {
        if (!validatePassword(password)) {
            setErrorPassword("Password must meet the required criteria.");
        }
    };

    const collectionData = async () => {
        if (!name || !email || !password) {
            setError("Please fill all the fields");
            return;
        }

        if (!validateEmail(email)) {
            setErrorEmail("Invalid email format!");
            return;
        }

        if (!validatePassword(password)) {
            setErrorPassword("Password must meet the required criteria.");
            return;
        }

        setLoading(true);
        let result = await fetch("https://retail-ease-backend-qf94.vercel.app/register", {
            method: "post",
            body: JSON.stringify({ name, email, password }),
            headers: {
                "Content-Type": "application/json",
            },
        });

        result = await result.json();
        setLoading(false);

        if (result.message && result.message.includes("User already exists")) {
            setError("User already exists. Please log in.");
            return;
        }

        localStorage.setItem("user", JSON.stringify(result.result));
        localStorage.setItem("token", JSON.stringify(result.auth));
        navigate("/");
    };

    return (
        <div style={{ maxWidth: '400px', margin: 'auto', padding: '20px', backgroundColor: '#f9f9f9', borderRadius: '10px', boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)' }}>
            <h1 style={{ textAlign: 'center', marginBottom: '20px' }}>Register</h1>
            <input
                style={{ width: '100%', padding: '10px', marginBottom: '15px', borderRadius: '5px', border: '1px solid #ccc', fontSize: '16px' }}
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                onFocus={() => setError("")}
                placeholder="Enter Name"
            />
            <input
                style={{ width: '100%', padding: '10px', marginBottom: '15px', borderRadius: '5px', border: '1px solid #ccc', fontSize: '16px' }}
                type="text"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                onBlur={handleEmailBlur}
                onFocus={() => { setErrorEmail(""); setError(""); }}
                placeholder="Enter Email"
            />
            {errorEmail && <div style={{ color: "red", marginBottom: '10px' }}>{errorEmail}</div>}
            <input
                style={{ width: '100%', padding: '10px', marginBottom: '15px', borderRadius: '5px', border: '1px solid #ccc', fontSize: '16px' }}
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                onBlur={handlePasswordBlur}
                onFocus={() => { setErrorPassword(""); setError(""); }}
                placeholder="Enter Password"
            />
            {errorPassword && <div style={{ color: "red", marginBottom: '10px' }}>{errorPassword}</div>}
            <button
                style={{ width: '100%', padding: '12px', backgroundColor: '#28a745', color: 'white', fontSize: '16px', border: 'none', borderRadius: '5px', cursor: 'pointer', transition: 'background-color 0.3s ease' }}
                onClick={collectionData}
                type="button"
                disabled={loading}
            >
                {loading ? "Registering..." : "Sign Up"}
            </button>
            {error && <div style={{ color: "red", marginTop: '10px' }}>{error}</div>}
        </div>
    );
};

export default SignUp;
