import React from "react";
import { Link, useLocation } from "react-router-dom";
// CDN 아이콘 사용

export default function Sidebar({ onLogout }) {
  const location = useLocation();

  const menuItems = [
    { path: "/", icon: <i className="icon-chart-bar w-6 h-6" />, label: "대시보드" },
    { path: "/admin", icon: <i className="icon-users w-6 h-6" />, label: "사용자 관리" },
    { path: "/settings", icon: <i className="icon-cog-6-tooth w-6 h-6" />, label: "시스템 설정" },
    { path: "/help", icon: <i className="icon-question-mark-circle w-6 h-6" />, label: "도움말" },
  ];

  const handleLogout = () => {
    if (onLogout) {
      onLogout();
    }
  };

  const isActive = (item) => {
    return location.pathname === item.path;
  };

  return (
    <aside className="fixed left-0 top-0 h-screen w-64 bg-white border-r border-gray-100 flex flex-col z-50">
      {/* Header */}
      <div className="h-20 flex items-center justify-center border-b border-gray-100">
        <h1 className="text-xl font-bold text-blue-600">플랜체크 관리자</h1>
      </div>

      {/* Navigation */}
      <nav className="flex-1 p-4 space-y-2">
        {menuItems.map((item) => {
          return (
            <Link
              key={item.path}
              to={item.path}
              className={`flex items-center space-x-4 px-4 py-3 rounded-lg transition-colors duration-200 ${
                isActive(item)
                  ? "bg-blue-50 text-blue-600 font-semibold"
                  : "text-gray-500 hover:bg-gray-50 hover:text-gray-800"
              }`}
            >
              <span className={`${isActive(item) ? "text-blue-600" : "text-gray-400"}`}>
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
            <i className="icon-power w-6 h-6" />
          </span>
          <span>로그아웃</span>
        </button>
      </div>
    </aside>
  );
} 