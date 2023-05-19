import { BrowserRouter as Router,
        Routes,
        Route } from 'react-router-dom';
import MemberView from "./routes/MemberView";
import MemberList from "./routes/MemberList";
import MemberUpdate from "./routes/MemberUpdate";
import SignUp from "./routes/SignUp";

export default function App() {
  return (
    <Router>
      <Routes>
        // 회원 가입
        <Route path="/signup" element={<SignUp />} />

        // 회원 목록
        <Route path="/member/list" element={<MemberList />} />

        // 회원 View
        <Route path="/member/:id" element={<MemberView />} />

        // 회원 정보 수정
        <Route path="/member/update/:id" element={<MemberUpdate />} />
      </Routes>
    </Router>
  )
}