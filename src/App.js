import Sidebar from "./components/layout/Sidebar";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
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

function App() {
  return (
    <EventProvider>
      <Router basename={process.env.PUBLIC_URL}>
        <div className="flex min-h-screen bg-gray-50">
          <Sidebar />
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
              <Route path="/timeline/:id" element={<TimelineView />} />
            </Routes>
          </main>
        </div>
      </Router>
    </EventProvider>
  );
}

export default App;
