import React, { useState } from 'react';
import UserGuide from '../components/help/UserGuide';
import { 
  MdCheckCircle,
  MdWarning,
  MdInfo,
  MdAssignment,
} from 'react-icons/md';


const QuickTipsSection = ({ tips }) => (
  <div className="mt-8 bg-white p-6 rounded-lg shadow-sm border">
     <div className="flex items-center space-x-3 mb-6">
      <MdInfo className="w-6 h-6 text-blue-500" />
      <h3 className="text-xl font-semibold text-gray-900">빠른 팁</h3>
    </div>
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
      {tips.map((tip, index) => (
        <div key={index} className="flex items-start space-x-3 p-3 bg-gray-50 rounded-lg">
          {tip.icon}
          <p className="text-sm text-gray-800">{tip.tip}</p>
        </div>
      ))}
    </div>
  </div>
);


const Help = () => {
  const [activeTab, setActiveTab] = useState('gettingStarted');

  const tabs = [
    { id: 'gettingStarted', label: '시작하기' },
    { id: 'mainFeatures', label: '주요 기능' },
    { id: 'userGuide', label: '사용자 가이드' },
  ];
  
  const quickTips = [
    { icon: <MdCheckCircle className="w-5 h-5 text-green-500" />, tip: '담당 항목을 완료하면 자동으로 진행률이 업데이트됩니다.' },
    { icon: <MdWarning className="w-5 h-5 text-yellow-500" />, tip: '마감일이 임박한 미완료 항목은 긴급 알림으로 표시됩니다.' },
    { icon: <MdAssignment className="w-5 h-5 text-blue-500" />, tip: '대시보드에서 내 담당 항목 현황을 한눈에 확인할 수 있습니다.' },
    { icon: <MdInfo className="w-5 h-5 text-gray-500" />, tip: '행사별 체크리스트에서 담당 항목만 필터링되어 표시됩니다.' }
  ];

  return (
    <div className="p-8">
      {/* 헤더 */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">사용자 도움말</h1>
        <p className="mt-2 text-sm text-gray-600">
          담당 행사 체크리스트 관리 시스템 사용법을 안내합니다.
        </p>
      </div>

      {/* 탭 네비게이션 */}
      <div className="border-b border-gray-200 mb-6">
        <nav className="-mb-px flex space-x-8">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`py-2 px-1 border-b-2 font-medium text-sm flex items-center space-x-2 ${
                activeTab === tab.id
                  ? 'border-blue-500 text-blue-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              <span>{tab.label}</span>
            </button>
          ))}
        </nav>
      </div>

      {/* 탭 콘텐츠 */}
      <div className="bg-white rounded-lg shadow-sm border p-6">
        <UserGuide activeGuide={activeTab} />
      </div>
      
      {/* 빠른 팁 섹션 */}
      <QuickTipsSection tips={quickTips} />
    </div>
  );
};

export default Help; 