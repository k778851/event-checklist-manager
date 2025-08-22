import Sidebar from "./components/layout/Sidebar";
import UserSidebar from "./components/layout/UserSidebar";
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import Dashboard from "./pages/Dashboard";
import EventList from "./pages/EventList";
import ChecklistPage from "./pages/ChecklistPage";
import TimelinePage from "./pages/TimelinePage";
import Admin from "./pages/Admin";
import Settings from "./pages/Settings";
import Help from "./pages/Help";
import ChecklistView from "./components/checklist/ChecklistView";
import TimelineView from "./components/timeline/TimelineView";
import './App.css';
import ChecklistTabs from "./components/checklist/ChecklistTabs";
import { EventProvider } from "./contexts/EventContext";

// 사용자용 페이지들
import UserDashboard from "./pages/UserDashboard";
import UserEventList from "./pages/UserEventList";
import UserTasks from "./pages/UserTasks";
import UserChecklist from "./components/user/UserChecklist";
import UserTimeline from "./components/user/UserTimeline";

function App() {
  return (
    <EventProvider>
      <Router basename={process.env.PUBLIC_URL}>
        <Routes>
          {/* 사용자 라우트 - 더 구체적인 경로를 먼저 정의 */}
          <Route path="/user/events" element={
            <div className="flex min-h-screen bg-gray-50">
              <UserSidebar />
              <main className="flex-1 bg-bgPrimary ml-64">
                <UserEventList />
              </main>
            </div>
          } />
          <Route path="/user/tasks" element={
            <div className="flex min-h-screen bg-gray-50">
              <UserSidebar />
              <main className="flex-1 bg-bgPrimary ml-64">
                <UserTasks />
              </main>
            </div>
          } />
          <Route path="/user/checklist/:id" element={
            <div className="flex min-h-screen bg-gray-50">
              <UserSidebar />
              <main className="flex-1 bg-bgPrimary ml-64">
                <UserChecklist />
              </main>
            </div>
          } />
          <Route path="/user/timeline/:id" element={
            <div className="flex min-h-screen bg-gray-50">
              <UserSidebar />
              <main className="flex-1 bg-bgPrimary ml-64">
                <UserTimeline />
              </main>
            </div>
          } />
          <Route path="/user/help" element={
            <div className="flex min-h-screen bg-gray-50">
              <UserSidebar />
              <main className="flex-1 bg-bgPrimary ml-64">
                <Help />
              </main>
            </div>
          } />
          <Route path="/user" element={
            <div className="flex min-h-screen bg-gray-50">
              <UserSidebar />
              <main className="flex-1 bg-bgPrimary ml-64">
                <UserDashboard />
              </main>
            </div>
          } />

          {/* 관리자 라우트 */}
          <Route path="/" element={
            <div className="flex min-h-screen bg-gray-50">
              <Sidebar />
              <main className="flex-1 bg-bgPrimary ml-64">
                <Dashboard />
              </main>
            </div>
          } />
          <Route path="/events" element={
            <div className="flex min-h-screen bg-gray-50">
              <Sidebar />
              <main className="flex-1 bg-bgPrimary ml-64">
                <EventList />
              </main>
            </div>
          } />
          <Route path="/checklist/*" element={
            <div className="flex min-h-screen bg-gray-50">
              <Sidebar />
              <main className="flex-1 bg-bgPrimary ml-64">
                <ChecklistPage />
              </main>
            </div>
          } />
          <Route path="/timeline/*" element={
            <div className="flex min-h-screen bg-gray-50">
              <Sidebar />
              <main className="flex-1 bg-bgPrimary ml-64">
                <TimelinePage />
              </main>
            </div>
          } />
          <Route path="/admin" element={
            <div className="flex min-h-screen bg-gray-50">
              <Sidebar />
              <main className="flex-1 bg-bgPrimary ml-64">
                <Admin />
              </main>
            </div>
          } />
          <Route path="/settings" element={
            <div className="flex min-h-screen bg-gray-50">
              <Sidebar />
              <main className="flex-1 bg-bgPrimary ml-64">
                <Settings />
              </main>
            </div>
          } />
          <Route path="/help" element={
            <div className="flex min-h-screen bg-gray-50">
              <Sidebar />
              <main className="flex-1 bg-bgPrimary ml-64">
                <Help />
              </main>
            </div>
          } />
          <Route path="/checklist/pre-event/:id" element={
            <div className="flex min-h-screen bg-gray-50">
              <Sidebar />
              <main className="flex-1 bg-bgPrimary ml-64">
                <ChecklistTabs />
              </main>
            </div>
          } />
          <Route path="/timeline/:id" element={
            <div className="flex min-h-screen bg-gray-50">
              <Sidebar />
              <main className="flex-1 bg-bgPrimary ml-64">
                <TimelineView />
              </main>
            </div>
          } />
          
          {/* 404 페이지 */}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </Router>
    </EventProvider>
  );
}

export default App;
