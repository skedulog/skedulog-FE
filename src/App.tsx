import { Routes, Route } from 'react-router-dom';
import LogIn from './routes/login/LogIn';
import MainView from './routes/main/MainView';
import MemberUpdate from "./routes/member/MemberUpdate";
import Navbar from './components/navbar/Navbar';
import PassWordCheck from './routes/passwordcheck/PasswordCheck';
import SignUp from "./routes/signup/SignUp";
import styles from "./App.module.scss";

const App: React.FC = () => {

  return (
    <div className={styles.app_container}>
      <Navbar />
      <Routes>
        // 메인 페이지
        <Route path="/" element={<MainView />} />

        // 로그인 페이지
        <Route path="/login" element={<LogIn />} />

        // 회원 가입
        <Route path="/signup" element={<SignUp />} />

        // 회원 정보 수정
        <Route path="/member/me" element={<MemberUpdate />} />

        // 비밀번호 확인
        <Route path="/password/check" element={<PassWordCheck />} />
      </Routes>
    </div>
  )
}

export default App;