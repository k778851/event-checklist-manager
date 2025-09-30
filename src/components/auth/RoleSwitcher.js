import React, { useState } from 'react';
import { useAuth } from '../../contexts/AuthContext';

const RoleSwitcher = () => {
  const { currentUser, switchRole, ROLES } = useAuth();
  const [isExpanded, setIsExpanded] = useState(false);

  const roles = [
    { value: ROLES.SUPER_ADMIN, label: '총괄관리자', department: '본부', region: '본부' },
    { value: ROLES.ADMIN, label: '관리자 (기획부)', department: '기획부', region: '본부' },
    { value: ROLES.ADMIN, label: '관리자 (홍보부)', department: '홍보부', region: '북구' },
    { value: ROLES.USER, label: '사용자 (찬양부)', department: '찬양부', region: '광산' },
    { value: ROLES.USER, label: '사용자 (전도부)', department: '전도부', region: '서구' }
  ];

  const handleRoleChange = (role) => {
    switchRole(role.value, role.department, role.region);
  };

  // 개발 환경에서만 표시
  if (process.env.NODE_ENV !== 'development') {
    return null;
  }

  return (
    <div className="fixed bottom-4 left-4 z-50">
      {/* 축소된 상태 - 현재 사용자 정보만 표시 */}
      {!isExpanded && (
        <div 
          className="bg-blue-600 text-white px-4 py-2 rounded-lg shadow-lg cursor-pointer hover:bg-blue-700 transition-colors"
          onClick={() => setIsExpanded(true)}
        >
          <div className="text-sm font-medium">🔧 {currentUser?.name}</div>
          <div className="text-xs opacity-90">{currentUser?.department} ({currentUser?.role === 'super_admin' ? '총괄' : currentUser?.role === 'admin' ? '관리' : '사용'})</div>
        </div>
      )}
      
      {/* 확장된 상태 - 전체 권한 변경 패널 */}
      {isExpanded && (
        <div className="bg-white border border-gray-300 rounded-lg shadow-lg p-4 min-w-[280px] max-w-[320px]">
          <div className="flex items-center justify-between mb-3">
            <h3 className="text-sm font-semibold text-gray-800">권한 테스트 (개발용)</h3>
            <button
              onClick={() => setIsExpanded(false)}
              className="text-gray-400 hover:text-gray-600 text-lg leading-none"
            >
              ×
            </button>
          </div>
          
          <div className="text-xs text-gray-600 mb-3 p-2 bg-gray-50 rounded">
            현재: <span className="font-medium">{currentUser?.name}</span> ({currentUser?.role})
            <br />
            부서: {currentUser?.department} / 지역: {currentUser?.region}
          </div>
          
          <div className="space-y-2 max-h-60 overflow-y-auto">
            {roles.map((role, index) => (
              <button
                key={index}
                onClick={() => {
                  handleRoleChange(role);
                  setIsExpanded(false); // 권한 변경 후 자동으로 접기
                }}
                className={`w-full text-left px-3 py-2 text-xs rounded transition-colors ${
                  currentUser?.role === role.value && 
                  currentUser?.department === role.department &&
                  currentUser?.region === role.region
                    ? 'bg-blue-100 text-blue-800 border border-blue-300'
                    : 'bg-gray-50 text-gray-700 hover:bg-gray-100 border border-gray-200'
                }`}
              >
                <div className="font-medium">{role.label}</div>
                <div className="text-gray-500">{role.department} / {role.region}</div>
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default RoleSwitcher;
