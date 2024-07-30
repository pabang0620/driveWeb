import React from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Outlet,
} from "react-router-dom";
import Login from "./page/login/Login";
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
import TopRank from "./page/TopRank ";

function RouterApp() {
  return (
    <Router>
      <Routes>
        {/* Layout이 적용된 경로 */}
        <Route element={<LayoutWithOutlet />}>
          <Route path="/" element={<Home />} />
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<Signup />} />
          <Route path="/signup/email" element={<SignupEmail />} />
          <Route path="/signup/password" element={<SignupPassword />} />
          <Route path="/signup/job" element={<SignupJob />} />
          <Route path="/user/personalinfo" element={<PersonalInfo />} />
          <Route path="/user/carinfo" element={<CarInfo />} />
          <Route path="/user/incomeinfo" element={<IncomeInfo />} />
          <Route path="/board" element={<Board />} />
          <Route path="/board/list/:boardId" element={<BoardPost />} />
          <Route path="/board/post/:postId" element={<BoardDetail />} />
          <Route path="/board/post/add" element={<BoardPostAdd />} />
          <Route path="/board/post/edit/:id" element={<BoardPostAdd />} />
          <Route path="/ranking" element={<Ranking />} />
          <Route path="/mypage" element={<MyPage />} />
          <Route path="/mycar" element={<MyCar />} />
          <Route path="/mycar/maintenance" element={<MyCarMaintenance />} />
          <Route path="/driving_log" element={<DriveLog />} />
          <Route path="/driving_log/dashboard" element={<DriveDashBoard />} />
          <Route path="/mycar/log" element={<MyCarLog />} />
          <Route path="/SummaryComponent" element={<SummaryComponent />} />
          <Route path="/topRank" element={<TopRank />} />
        </Route>

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
