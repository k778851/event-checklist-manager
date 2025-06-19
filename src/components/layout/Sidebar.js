import React from "react";
import { Link, useLocation } from "react-router-dom";
import { 
  MdDashboard,
  MdEvent, 
  MdChecklist, 
  MdTimeline,
  MdUpload,
  MdPeople,
  MdSettings 
} from 'react-icons/md';

export default function Sidebar() {
  const location = useLocation();
  
  const menuItems = [
    { icon: <MdDashboard className="w-6 h-6" />, text: '대시보드', path: '/' },
    { icon: <MdEvent className="w-6 h-6" />, text: '행사 관리', path: '/events' },
    { icon: <MdChecklist className="w-6 h-6" />, text: '체크리스트', path: '/checklist' },
    { icon: <MdTimeline className="w-6 h-6" />, text: '타임라인', path: '/timeline' },
    { icon: <MdUpload className="w-6 h-6" />, text: '엑셀 업로드/다운로드', path: '/excel' },
    { icon: <MdPeople className="w-6 h-6" />, text: '부서/사용자 관리', path: '/admin' },
    { icon: <MdSettings className="w-6 h-6" />, text: '시스템 설정', path: '/settings' }
  ];

  return (
    <aside className="h-screen w-60 bg-bgSecondary border-r border-borderOutline flex flex-col shadow-md">
      <div className="h-20 flex items-center justify-center border-b border-borderOutline">
        <span className="text-2xl font-bold tracking-tight text-primaryBlue" style={{ color: 'var(--primaryBlue)' }}>
          플렌체크
        </span>
      </div>
      <nav className="flex-1 py-6">
        <div className="px-4 space-y-2">
          {menuItems.map((item, index) => {
            const isActive = location.pathname === item.path;
            return (
              <Link
                key={index}
                to={item.path}
                className={`flex items-center px-4 py-3 text-contentSub transition-colors duration-200 rounded-lg group ${
                  isActive 
                    ? 'bg-blue-100 text-blue-700' 
                    : 'hover:bg-blue-50 hover:text-blue-600'
                }`}
              >
                <div className={`transition-colors duration-200 ${
                  isActive ? 'text-blue-700' : 'text-gray-500 group-hover:text-blue-600'
                }`}>
                  {item.icon}
                </div>
                <span className={`ml-3 text-sm font-medium ${
                  isActive ? 'text-blue-700' : ''
                }`}>
                  {item.text}
                </span>
              </Link>
            );
          })}
        </div>
      </nav>
    </aside>
  );
} 