import React, { useState } from 'react';
import { 
  MdWarning, 
  MdInfo 
} from 'react-icons/md';
import SettingsTabs from '../components/settings/SettingsTabs';
import FeatureSettings from '../components/settings/FeatureSettings';
import SecuritySettings from '../components/settings/SecuritySettings';
import ApiSettings from '../components/settings/ApiSettings';
import SystemInfo from '../components/settings/SystemInfo';

const Settings = () => {
  const [activeTab, setActiveTab] = useState('features');
  const [userRole, setUserRole] = useState('admin'); // 'admin', 'department', 'user'

  const renderTabContent = () => {
    switch (activeTab) {
      case 'features':
        return <FeatureSettings />;
      case 'security':
        return <SecuritySettings />;
      case 'api':
        return <ApiSettings />;
      case 'system':
        return <SystemInfo />;
      default:
        return <FeatureSettings />;
    }
  };

  const canAccessTab = (tabId) => {
    switch (userRole) {
      case 'admin':
        return true; // 총괄부서 관리자는 모든 탭 접근 가능
      case 'department':
        return tabId === 'features'; // 부서 관리자는 기능 관리 탭만 접근 가능
      case 'user':
        return false; // 일반 사용자는 설정 화면 접근 불가
      default:
        return false;
    }
  };

  const getPermissionMessage = () => {
    if (userRole === 'user') {
      return (
        <div className="bg-yellow-50 border border-yellow-200 rounded-md p-4 mb-6">
          <div className="flex">
            <div className="flex-shrink-0">
              <MdWarning className="h-5 w-5 text-yellow-400" />
            </div>
            <div className="ml-3">
              <h3 className="text-sm font-medium text-yellow-800">
                접근 권한이 없습니다
              </h3>
              <div className="mt-2 text-sm text-yellow-700">
                <p>시스템 설정 화면에 접근할 권한이 없습니다. 관리자에게 문의하세요.</p>
              </div>
            </div>
          </div>
        </div>
      );
    }
    return null;
  };

  if (userRole === 'user') {
    return (
      <div className="p-8">
        {getPermissionMessage()}
      </div>
    );
  }

  return (
    <div className="p-8">
      {/* 헤더 */}
      <div className="mb-8">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">시스템 설정</h1>
            <p className="mt-2 text-sm text-gray-600">
              행사 체크리스트 관리 시스템의 설정을 관리합니다.
            </p>
          </div>
          <div className="flex items-center space-x-4">
            <div className="text-sm text-gray-500">
              현재 권한: 
              <span className="ml-1 font-medium text-gray-900">
                {userRole === 'admin' ? '총괄부서 관리자' : '부서 관리자'}
              </span>
            </div>
            {/* 권한 시뮬레이션을 위한 드롭다운 (실제 구현에서는 제거) */}
            <select
              value={userRole}
              onChange={(e) => setUserRole(e.target.value)}
              className="px-3 py-1 text-sm border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="admin">총괄부서 관리자</option>
              <option value="department">부서 관리자</option>
              <option value="user">일반 사용자</option>
            </select>
          </div>
        </div>
      </div>

      {/* 권한 안내 메시지 */}
      {userRole === 'department' && (
        <div className="bg-blue-50 border border-blue-200 rounded-md p-4 mb-6">
          <div className="flex">
            <div className="flex-shrink-0">
              <MdInfo className="h-5 w-5 text-blue-400" />
            </div>
            <div className="ml-3">
              <h3 className="text-sm font-medium text-blue-800">
                제한된 접근 권한
              </h3>
              <div className="mt-2 text-sm text-blue-700">
                <p>부서 관리자 권한으로 기능 관리 탭만 접근할 수 있습니다.</p>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* 탭 네비게이션 */}
      <SettingsTabs 
        activeTab={activeTab} 
        onTabChange={setActiveTab}
        canAccessTab={canAccessTab}
      />

      {/* 탭 콘텐츠 */}
      <div className="bg-white rounded-lg shadow-sm border">
        <div className="p-6">
          {renderTabContent()}
        </div>
      </div>

      {/* 설정 저장 상태 표시 */}
      <div className="mt-6 text-center">
        <p className="text-sm text-gray-500">
          설정 변경사항은 자동으로 저장됩니다. 
          <span className="text-blue-600 font-medium">마지막 저장: {new Date().toLocaleString('ko-KR')}</span>
        </p>
      </div>
    </div>
  );
};

export default Settings; 