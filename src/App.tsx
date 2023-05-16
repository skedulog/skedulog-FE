import { BrowserRouter as Router,
        Routes,
        Route } from 'react-router-dom';
import Movie from "./routes/Movie";
import MemberList from "./routes/MemberList";

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/movie" element={<Movie />} />
        <Route path="/members" element={<MemberList />} />
      </Routes>
    </Router>
  )
}

export default App
