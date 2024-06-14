// Header.js
import React from "react";
import { Link } from "react-router-dom";

function Header() {
  return (
    <header className="header">
      <h1>My Website</h1>
      <nav>
        <ul>
          <li>
            <Link to="/">Home</Link>
          </li>
          <li>
            <Link to="/login">Login</Link>
          </li>
          <li>
            <Link to="/signup">Sign Up</Link>
          </li>
        </ul>
      </nav>
      <style jsx>{`
        .header {
          background-color: #3c5997;
          color: white;
          padding: 10px 20px;
          display: flex;
          justify-content: space-between;
          align-items: center;
        }
        nav ul {
          list-style: none;
          display: flex;
          gap: 15px;
        }
        nav a {
          color: white;
          text-decoration: none;
        }
      `}</style>
    </header>
  );
}

export default Header;
