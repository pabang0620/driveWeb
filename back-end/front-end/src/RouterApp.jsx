import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Login from "./page/login/Login";
import Signup from "./page/signup/Signup";
import Home from "./page/home/Home";
import Layout from "./layout/Layout";
import SignupEmail from "./page/signup/SignupEmail";
import SignupPassword from "./page/signup/SignupPassword";
import SignupJob from "./page/signup/SignupJob";
import PersonalInfo from "./page/user/PersonalInfo";
import TermsPrivacy from "./page/terms/TermsPrivacy";
import TermsGeneral from "./page/terms/TermsGeneral";

function RouterApp() {
  return (
    <Router>
      <Routes>
        <Route
          path="/"
          element={
            <Layout>
              <Home />
            </Layout>
          }
        />
        {/* 로그인 */}
        <Route
          path="/login"
          element={
            <Layout>
              <Login />
            </Layout>
          }
        />
        {/* 회원가입 */}
        <Route
          path="/signup"
          element={
            <Layout>
              <Signup />
            </Layout>
          }
        />
        <Route
          path="/signup/email"
          element={
            <Layout>
              <SignupEmail />
            </Layout>
          }
        />
        <Route
          path="/signup/password"
          element={
            <Layout>
              <SignupPassword />
            </Layout>
          }
        />
        <Route
          path="/signup/job"
          element={
            <Layout>
              <SignupJob />
            </Layout>
          }
        />

        {/* 회원정보 */}
        <Route
          path="/user/personalInfo"
          element={
            <Layout>
              <PersonalInfo />
            </Layout>
          }
        />
        <Route path="/terms/privacy_policy" element={<TermsPrivacy />} />
        <Route path="/terms/general" element={<TermsGeneral />} />
      </Routes>
    </Router>
  );
}

export default RouterApp;
