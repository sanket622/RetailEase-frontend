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
        <div className="register">
            <h1>Register</h1>
            <input
                className="inputBox"
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                onFocus={() => setError("")}
                placeholder="Enter Name"
            />
            <input
                className="inputBox"
                type="text"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                onBlur={handleEmailBlur}
                onFocus={() => { setErrorEmail(""); setError(""); }}
                placeholder="Enter Email"
            />
            {errorEmail && <div style={{ color: "red" }}>{errorEmail}</div>}
            <input
                className="inputBox"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                onBlur={handlePasswordBlur}
                onFocus={() => { setErrorPassword(""); setError(""); }}
                placeholder="Enter Password"
            />
            {errorPassword && <div style={{ color: "red" }}>{errorPassword}</div>}
            <button
                className="appbtn"
                onClick={collectionData}
                type="button"
                disabled={loading}
            >
                {loading ? "Registering..." : "Sign Up"}
            </button>
            {error && <div style={{ color: "red" }}>{error}</div>}
        </div>
    );
};

export default SignUp;
