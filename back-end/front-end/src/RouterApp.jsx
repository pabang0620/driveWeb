import React, { useEffect } from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Outlet,
} from "react-router-dom";

import Login from "./page/login/Login";
import ForgotPassword from "./page/login/ForgotPassword";
import FindUsername from "./page/login/FindUsername";
import ResetPassword from "./page/login/ResetPassword";
import Signup from "./page/signup/Signup";
import Home from "./page/home/Home";
import Layout from "./layout/Layout";
import SignupEmail from "./page/signup/SignupEmail";
import SignupPassword from "./page/signup/SignupPassword";
import SignupJob from "./page/signup/SignupJob";
import PersonalInfo from "./page/user/PersonalInfo";
import CarInfo from "./page/user/CarInfo";
import IncomeInfo from "./page/user/IncomeInfo";
import TermsPrivacy from "./page/terms/TermsPrivacy";
import TermsGeneral from "./page/terms/TermsGeneral";
import Board from "./page/board/Board";
import BoardPost from "./page/board/BoardPost";
import BoardDetail from "./page/board/BoardDetail";
import BoardPostAdd from "./page/board/BoardPostAdd";
import Ranking from "./page/ranking/Ranking";
import MyPage from "./page/mypage/MyPage";
import MyCar from "./page/mycar/MyCar";
import MyCarMaintenance from "./page/mycar/MyCarMaintenance";
import DriveLog from "./page/drive/DriveLog";
import MyCarLog from "./page/mycar/MyCarLog";
import DriveDashBoard from "./page/drive/DriveDashBoard";
import SummaryComponent from "./page/SummaryComponent ";
// import TopRank from "./page/TopRank ";
import EstimatedIncomeTaxPage from "./page/mypage/EstimatedIncomeTaxPage";
import ProfitLossMainPage from "./page/mypage/ProfitLossMainPage";
import PageTracker from "./PageTracker";
import Payment from "./page/payment/Payment";
import { SuccessPage } from "./page/payment/SuccessPage";
import { FailPage } from "./page/payment/FailPage";
import BoardManagement from "./page/admin/BoardManagement";
import UserManagement from "./page/admin/UserManagement";
import RankingManagement from "./page/admin/RankingManagement";
import StatisticsManagement from "./page/admin/StatisticsManagement";
import AuthCheck from "./AuthCheck";

function RouterApp() {
  return (
    <Router>
      <PageTracker />
      <Routes>
        {/* Layout이 적용된 경로 */}
        <Route element={<LayoutWithOutlet />}>
          <Route path="/" element={<Home />} />
          {/* 로그인 */}
          <Route path="/login" element={<Login />} />

          {/* 비밀번호 찾기 & 재설정 */}
          <Route path="/login/forgotpassword" element={<ForgotPassword />} />
          <Route path="/login/resetpassword" element={<ResetPassword />} />
          <Route path="/login/findUsername" element={<FindUsername />} />

          {/* 회원가입 */}
          <Route path="/signup" element={<Signup />} />
          <Route path="/signup/email" element={<SignupEmail />} />
          <Route path="/signup/password" element={<SignupPassword />} />
          <Route path="/signup/job" element={<SignupJob />} />

          {/* 회원정보 */}
          <Route
            path="/user/personalinfo"
            element={
              <AuthCheck>
                <PersonalInfo />{" "}
              </AuthCheck>
            }
          />
          <Route
            path="/user/carinfo"
            element={
              <AuthCheck>
                <CarInfo />{" "}
              </AuthCheck>
            }
          />
          <Route
            path="/user/incomeinfo"
            element={
              <AuthCheck>
                <IncomeInfo />{" "}
              </AuthCheck>
            }
          />

          {/* 게시판 */}
          <Route path="/board" element={<Board />} />
          <Route path="/board/list/:boardId" element={<BoardPost />} />
          <Route path="/board/post/:postId" element={<BoardDetail />} />
          <Route path="/board/post/add" element={<BoardPostAdd />} />
          <Route path="/board/post/edit/:id" element={<BoardPostAdd />} />

          {/* 랭킹 */}
          <Route path="/ranking" element={<Ranking />} />

          {/* 마이페이지 */}
          <Route
            path="/mypage"
            element={
              <AuthCheck>
                <MyPage />{" "}
              </AuthCheck>
            }
          />

          {/* 차계부 */}
          <Route
            path="/mycar"
            element={
              <AuthCheck>
                <MyCar />{" "}
              </AuthCheck>
            }
          />
          <Route path="/mycar/maintenance" element={<MyCarMaintenance />} />
          <Route path="/mycar/log" element={<MyCarLog />} />

          {/* 운행일지 */}
          <Route
            path="/driving_log"
            element={
              <AuthCheck>
                <DriveLog />{" "}
              </AuthCheck>
            }
          />
          <Route path="/driving_log/:userId" element={<DriveLog />} />
          <Route path="/driving_log/dashboard" element={<DriveDashBoard />} />

          {/* 결재 */}
          <Route path="/payment" element={<Payment />} />
          <Route path="/payment/success" element={<SuccessPage />} />
          <Route path="/payment/fail" element={<FailPage />} />

          {/* 관리자페이지 */}
          <Route path="/admin/user" element={<UserManagement />} />
          <Route path="/admin/board" element={<BoardManagement />} />
          <Route path="/admin/ranking" element={<RankingManagement />} />
          <Route path="/admin/statistics" element={<StatisticsManagement />} />

          {/* 기타 */}
          <Route path="/SummaryComponent" element={<SummaryComponent />} />
          {/* <Route path="/topRank" element={<TopRank />} /> */}
        </Route>

        {/* Layout이 적용되지 않은 경로 */}
        <Route path="/terms/privacy_policy" element={<TermsPrivacy />} />
        <Route path="/terms/general" element={<TermsGeneral />} />

        <Route
          path="/estimated-income-tax"
          element={<EstimatedIncomeTaxPage />}
        />
        <Route path="/profit-loss-statement" element={<ProfitLossMainPage />} />

        {/* Layout이 적용되지 않은 경로 */}
        <Route path="/terms/privacy_policy" element={<TermsPrivacy />} />
        <Route path="/terms/general" element={<TermsGeneral />} />
      </Routes>
    </Router>
  );
}

function LayoutWithOutlet() {
  return (
    <Layout>
      <Outlet />
    </Layout>
  );
}

export default RouterApp;
