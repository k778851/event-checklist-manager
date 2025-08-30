import React, { useState, useEffect } from "react";
import Sidebar from "./components/layout/Sidebar";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Dashboard from "./pages/Dashboard";
import EventList from "./pages/EventList";
import ChecklistPage from "./pages/ChecklistPage";
import TimelinePage from "./pages/TimelinePage";
import Admin from "./pages/Admin";
import Settings from "./pages/Settings";
import Help from "./pages/Help";

import './App.css';
import ChecklistTabs from "./components/checklist/ChecklistTabs";
import { EventProvider } from "./contexts/EventContext";
import AuthContainer from "./components/auth/AuthContainer";

function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [userInfo, setUserInfo] = useState(null);

  useEffect(() => {
    // 로컬 스토리지에서 인증 상태 확인
    const authData = localStorage.getItem('plancheck_auth');
    if (authData) {
      try {
        const parsed = JSON.parse(authData);
        const now = new Date();
        const tokenTime = new Date(parsed.timestamp);
        
        // 24시간 이내인지 확인
        if (now - tokenTime < 24 * 60 * 60 * 1000) {
          setIsAuthenticated(true);
          setUserInfo(parsed);
        } else {
          // 토큰 만료 시 로컬 스토리지 클리어
          localStorage.removeItem('plancheck_auth');
        }
      } catch (error) {
        console.error('인증 데이터 파싱 오류:', error);
        localStorage.removeItem('plancheck_auth');
      }
    }
  }, []);

  const handleAuthSuccess = (authData) => {
    setIsAuthenticated(true);
    setUserInfo(authData);
    
    // 로컬 스토리지에 인증 정보 저장 (24시간 유효)
    localStorage.setItem('plancheck_auth', JSON.stringify(authData));
  };

  const handleLogout = () => {
    setIsAuthenticated(false);
    setUserInfo(null);
    localStorage.removeItem('plancheck_auth');
  };

  // 인증되지 않은 경우 로그인 화면 표시
  if (!isAuthenticated) {
    return (
      <EventProvider>
        <AuthContainer onAuthSuccess={handleAuthSuccess} />
      </EventProvider>
    );
  }

  return (
    <EventProvider>
      <Router basename={process.env.PUBLIC_URL}>
        <div className="flex min-h-screen bg-gray-50">
          <Sidebar onLogout={handleLogout} />
          <main className="flex-1 bg-bgPrimary ml-64">
            {/* 여기에 각 페이지 컴포넌트가 렌더링됩니다. */}
            <Routes>
              <Route path="/" element={<Dashboard />} />
              <Route path="/events" element={<EventList />} />
              <Route path="/checklist/*" element={<ChecklistPage />} />
              <Route path="/timeline/*" element={<TimelinePage />} />
              <Route path="/admin" element={<Admin />} />
              <Route path="/settings" element={<Settings />} />
              <Route path="/help" element={<Help />} />
              <Route path="/checklist/pre-event/:id" element={<ChecklistTabs />} />

            </Routes>
          </main>
        </div>
      </Router>
    </EventProvider>
  );
}

export default App;
