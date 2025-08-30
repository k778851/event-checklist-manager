import React from 'react';
import { NavLink } from 'react-router-dom';
// CDN 아이콘 사용

const UserSidebar = () => {
  // 사용자 정보 (실제로는 로그인된 사용자 정보를 사용해야 함)
  const currentUser = {
    name: '김사용자',
    department: '기획부',
    role: 'user'
  };

  const menuItems = [
    {
      path: '/user',
      icon: <i className="icon-chart-bar w-6 h-6" />,
      label: '대시보드',
      description: '내 담당 항목 현황'
    },
    {
      path: '/user/events',
      icon: <i className="icon-calendar-days w-6 h-6" />,
      label: '행사 목록',
      description: '담당 행사 관리'
    },
    {
      path: '/user/tasks',
      icon: <i className="icon-clipboard-document-list w-6 h-6" />,
      label: '내 담당 항목',
      description: '전체 담당 항목'
    },
    {
      path: '/user/help',
      icon: <i className="icon-question-mark-circle w-6 h-6" />,
      label: '도움말',
      description: '사용법 안내'
    }
  ];

  return (
    <div className="fixed left-0 top-0 h-full w-64 bg-white shadow-lg border-r border-gray-200 z-50">
      {/* 헤더 */}
      <div className="p-6 border-b border-gray-200">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-blue-600 rounded-full flex items-center justify-center">
            <i className="icon-user w-7 h-7 text-white" />
          </div>
          <div>
            <h2 className="font-semibold text-gray-800">{currentUser.name}</h2>
            <p className="text-sm text-gray-600">{currentUser.department}</p>
          </div>
        </div>
      </div>

      {/* 메뉴 */}
      <nav className="p-4">
        <div className="space-y-2">
          {menuItems.map((item) => (
            <NavLink
              key={item.path}
              to={item.path}
              end={item.path === '/user'} // 대시보드 경로에만 end prop 추가
              className={({ isActive }) =>
                `flex items-center gap-3 px-4 py-3 rounded-lg transition-colors ${
                  isActive
                    ? 'bg-blue-50 text-blue-700 border border-blue-200'
                    : 'text-gray-700 hover:bg-gray-50'
                }`
              }
            >
              {item.icon}
              <div className="flex-1">
                <div className="font-medium">{item.label}</div>
                <div className="text-xs text-gray-500">{item.description}</div>
              </div>
            </NavLink>
          ))}
        </div>
      </nav>

      {/* 푸터 */}
      <div className="absolute bottom-0 left-0 right-0 p-4 border-t border-gray-200">
        <div className="text-center">
          <p className="text-xs text-gray-500">사용자 모드</p>
          <p className="text-xs text-gray-400 mt-1">v1.0.0</p>
        </div>
      </div>
    </div>
  );
};

export default UserSidebar; 