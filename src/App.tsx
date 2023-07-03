import { Routes, Route } from 'react-router-dom';
import MainView from './routes/main/MainView';
import MemberView from "./routes/member/MemberView";
import MemberList from "./routes/member/MemberList";
import MemberUpdate from "./routes/member/MemberUpdate";
import SignUp from "./routes/signup/SignUp";
import Navbar from './components/navbar/Navbar';
import styles from "./styles/common/Common.module.scss";

export default function App() {
  return (
    <div className={styles.app_container}>
      <Navbar />
      <Routes>
        // 메인 페이지
        <Route path="/" element={<MainView />} />

        // 회원 가입
        <Route path="/signup" element={<SignUp />} />

        // 회원 목록
        <Route path="/member/list" element={<MemberList />} />

        // 회원 View
        <Route path="/member/:id" element={<MemberView />} />

        // 회원 정보 수정
        <Route path="/member/update/:id" element={<MemberUpdate />} />
      </Routes>
    </div>
  )
}