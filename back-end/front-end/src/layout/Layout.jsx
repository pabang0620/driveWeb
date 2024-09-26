import React from "react";
import Footer from "./Footer";
import Header from "./Header";
import MobileNav from "./MobileNav";
import "./layout.scss";

function Layout({ children }) {
  return (
    <>
      <Header />
      {children}
      <Footer />
      <MobileNav />
    </>
  );
}

export default Layout;
