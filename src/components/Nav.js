import React from "react";
import { Link, useNavigate } from "react-router-dom";

const Nav = () => {
  const auth = localStorage.getItem("user");
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.clear();
    navigate("/signup");
  };

  return (
    <div style={{ padding: "20px", borderBottom: "1px solid #ddd", display: "flex", alignItems: "center", justifyContent: "space-between" }}>
      <img
        style={{ height: "50px", width: "auto" }}
        alt="logo"
        src="https://cdn.dribbble.com/users/160383/screenshots/5656135/scott_4x.png"
      />

      {auth ? (
        <ul style={{ listStyle: "none", display: "flex", gap: "20px", margin: 0, padding: 0 }}>
          <li>
            <Link to="/" style={{ textDecoration: "none", color: "#333", fontWeight: "bold" }}>Products</Link>
          </li>
          <li>
            <Link to="/add" style={{ textDecoration: "none", color: "#333", fontWeight: "bold" }}>Add Product</Link>
          </li>
          <li>
            <Link
              onClick={handleLogout}
              to="/signup"
              style={{ textDecoration: "none", color: "#ff6347", fontWeight: "bold" }}
            >
              Logout ({JSON.parse(auth).name})
            </Link>
          </li>
        </ul>
      ) : (
        <ul style={{ listStyle: "none", display: "flex", gap: "20px", margin: 0, padding: 0 }}>
          <li>
            <Link to="/signup" style={{ textDecoration: "none", color: "#333", fontWeight: "bold" }}>Sign Up</Link>
          </li>
          <li>
            <Link to="/login" style={{ textDecoration: "none", color: "#333", fontWeight: "bold" }}>Login</Link>
          </li>
        </ul>
      )}
    </div>
  );
};

export default Nav;
