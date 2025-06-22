import React from 'react';
import { 
  MdSettings, 
  MdSecurity, 
  MdApi, 
  MdComputer 
} from 'react-icons/md';

const SettingsTabs = ({ activeTab, onTabChange, canAccessTab }) => {
  const tabs = [
    { id: 'features', label: '기능 관리', icon: <MdSettings className="w-5 h-5" /> },
    { id: 'security', label: '보안 설정', icon: <MdSecurity className="w-5 h-5" /> },
    { id: 'api', label: 'API 설정', icon: <MdApi className="w-5 h-5" /> },
    { id: 'system', label: '시스템 정보', icon: <MdComputer className="w-5 h-5" /> }
  ];

  return (
    <div className="border-b border-gray-200 mb-6">
      <nav className="-mb-px flex space-x-8">
        {tabs.map((tab) => {
          const hasAccess = canAccessTab ? canAccessTab(tab.id) : true;
          return (
            <button
              key={tab.id}
              onClick={() => onTabChange(tab.id)}
              disabled={!hasAccess}
              className={`py-2 px-1 border-b-2 font-medium text-sm flex items-center space-x-2 ${
                activeTab === tab.id
                  ? 'border-blue-500 text-blue-600'
                  : hasAccess
                  ? 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                  : 'border-transparent text-gray-300 cursor-not-allowed'
              }`}
            >
              <span className={`transition-colors duration-200 ${
                activeTab === tab.id ? 'text-blue-600' : hasAccess ? 'text-gray-500' : 'text-gray-300'
              }`}>
                {tab.icon}
              </span>
              <span>{tab.label}</span>
              {!hasAccess && (
                <span className="text-xs text-gray-400">(권한 없음)</span>
              )}
            </button>
          );
        })}
      </nav>
    </div>
  );
};

export default SettingsTabs; 