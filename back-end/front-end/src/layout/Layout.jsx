import React from "react";
import Footer from "./footer/Footer";
import Header from "./header/Header";

function Layout({ children }) {
  return (
    <>
      <Header />
      <main className="main-content">{children}</main>
      <Footer />
      <style jsx>{`
        .main-content {
          padding: 20px;
          padding-bottom: 60px; /* Footer 높이만큼 패딩 추가 */
        }
      `}</style>
    </>
  );
}

export default Layout;
