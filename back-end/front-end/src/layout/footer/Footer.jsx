// Footer.js
import React from "react";

function Footer() {
  return (
    <footer className="footer">
      <p>&copy; 2024 My Website. All rights reserved.</p>
      <style jsx>{`
        .footer {
          background-color: #3c5997;
          color: white;
          text-align: center;
          padding: 10px 0;
          position: fixed;
          bottom: 0;
          width: 100%;
        }
      `}</style>
    </footer>
  );
}

export default Footer;
