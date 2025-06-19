import Sidebar from "./components/layout/Sidebar";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Dashboard from "./pages/Dashboard";
import EventManagement from "./pages/EventManagement";
import Admin from "./pages/Admin";
import './App.css';

function App() {
  return (
    <Router basename={process.env.PUBLIC_URL}>
      <div className="flex min-h-screen">
        <Sidebar />
        <main className="flex-1 bg-bgPrimary">
          {/* 여기에 각 페이지 컴포넌트가 렌더링됩니다. */}
          <Routes>
            <Route path="/" element={<Dashboard />} />
            <Route path="/events" element={<EventManagement />} />
            <Route path="/checklist" element={<div className="p-8">체크리스트</div>} />
            <Route path="/timeline" element={<div className="p-8">타임라인</div>} />
            <Route path="/excel" element={<div className="p-8">엑셀 업로드/다운로드</div>} />
            <Route path="/admin" element={<Admin />} />
            <Route path="/settings" element={<div className="p-8">설정</div>} />
          </Routes>
        </main>
      </div>
    </Router>
  );
}

export default App;
