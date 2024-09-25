import React from "react";
import Footer from "./Footer";
import Header from "./Header";
import MobileNav from "./MobileNav";

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
