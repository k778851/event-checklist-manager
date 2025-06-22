import React from "react";
import { Link, useLocation } from "react-router-dom";
import { 
  MdDashboard,
  MdEvent, 
  MdChecklist, 
  MdTimeline,
  MdUpload,
  MdPeople,
  MdSettings,
  MdHelp,
  MdLogout,
} from 'react-icons/md';

export default function Sidebar() {
  const location = useLocation();

  const menuItems = [
    { path: "/", icon: <MdDashboard className="w-5 h-5" />, label: "대시보드" },
    { path: "/events", icon: <MdEvent className="w-5 h-5" />, label: "행사 관리" },
    { path: "/checklist", icon: <MdChecklist className="w-5 h-5" />, label: "체크리스트" },
    { path: "/timeline", icon: <MdTimeline className="w-5 h-5" />, label: "타임라인" },
    { path: "/excel", icon: <MdUpload className="w-5 h-5" />, label: "엑셀 업로드/다운로드" },
    { path: "/admin", icon: <MdPeople className="w-5 h-5" />, label: "부서/사용자 관리" },
    { path: "/settings", icon: <MdSettings className="w-5 h-5" />, label: "시스템 설정" },
    { path: "/help", icon: <MdHelp className="w-5 h-5" />, label: "도움말" },
  ];

  const handleLogout = () => {
    // 여기에 실제 로그아웃 로직을 구현합니다.
    // 예: API 호출, 로컬 스토리지 클리어, 로그인 페이지로 리디렉션 등
    alert("로그아웃 되었습니다.");
  };

  return (
    <aside className="fixed left-0 top-0 h-screen w-64 bg-white border-r border-gray-100 flex flex-col z-50">
      {/* Header */}
      <div className="h-20 flex items-center justify-center border-b border-gray-100">
        <h1 className="text-xl font-bold text-blue-600">플랜체크</h1>
      </div>

      {/* Navigation */}
      <nav className="flex-1 p-4 space-y-2">
        {menuItems.map((item) => {
          const isActive = location.pathname === item.path;
          return (
            <Link
              key={item.path}
              to={item.path}
              className={`flex items-center space-x-4 px-4 py-3 rounded-lg transition-colors duration-200 ${
                isActive
                  ? "bg-blue-50 text-blue-600 font-semibold"
                  : "text-gray-500 hover:bg-gray-50 hover:text-gray-800"
              }`}
            >
              <span className={`${isActive ? "text-blue-600" : "text-gray-400"}`}>
                {item.icon}
              </span>
              <span>{item.label}</span>
            </Link>
          );
        })}
      </nav>

      {/* Logout Button */}
      <div className="p-4 border-t border-gray-100">
        <button
          onClick={handleLogout}
          className="flex items-center space-x-4 px-4 py-3 rounded-lg w-full text-gray-500 hover:bg-red-50 hover:text-red-600 transition-colors duration-200"
        >
          <span className="text-gray-400">
            <MdLogout className="w-5 h-5" />
          </span>
          <span>로그아웃</span>
        </button>
      </div>
    </aside>
  );
} 