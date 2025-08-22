import React from 'react';
import { 
  MdDashboard, 
  MdEvent, 
  MdChecklist, 
  MdTimeline,
  MdAssignment,
  MdPlayArrow,
  MdCheckCircle,
  MdWarning,
  MdInfo,
  MdHelp
} from 'react-icons/md';

const GuideSection = ({ title, icon, content }) => (
  <div className="space-y-8">
    <div className="flex items-center space-x-3 mb-6">
      {icon}
      <h3 className="text-xl font-semibold text-gray-900">{title}</h3>
    </div>
    
    <div className="space-y-6">
      {content.map((item, itemIndex) => (
        <div key={itemIndex} className="border-l-4 border-blue-200 pl-4">
          <h4 className="text-lg font-medium text-gray-800 mb-2">{item.subtitle}</h4>
          <p className="text-gray-600 mb-3">{item.description}</p>
          <ul className="space-y-1">
            {item.details.map((detail, detailIndex) => (
              <li key={detailIndex} className="flex items-start space-x-2">
                <span className="text-blue-500 mt-1">•</span>
                <span className="text-gray-700">{detail}</span>
              </li>
            ))}
          </ul>
        </div>
      ))}
    </div>
  </div>
);

const QuickTipsSection = ({ tips }) => (
  <div className="space-y-4">
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

const UserGuide = ({ activeGuide }) => {
  const guideData = {
    gettingStarted: {
      title: '시작하기',
      icon: <MdPlayArrow className="w-6 h-6 text-blue-500" />,
      content: [
        {
          subtitle: '대시보드 확인',
          description: '로그인 후 대시보드에서 내 담당 항목 현황을 확인할 수 있습니다.',
          details: ['전체 담당 항목 수', '완료된 항목 수', '진행중인 항목 수', '긴급한 항목 수', '이번 달 담당 행사 목록']
        },
        {
          subtitle: '담당 항목 확인',
          description: '내 담당 항목 페이지에서 모든 행사의 담당 체크리스트를 확인할 수 있습니다.',
          details: ['행사별로 그룹화된 담당 항목', '상태별 필터링 (완료/진행중/미진행)', '검색 기능으로 빠른 항목 찾기', '긴급 항목 우선 표시']
        }
      ]
    },
    mainFeatures: {
      title: '주요 기능',
      icon: <MdDashboard className="w-6 h-6 text-green-500" />,
      content: [
        {
          subtitle: '대시보드',
          description: '내 담당 항목의 전체 현황을 한눈에 확인할 수 있습니다.',
          details: ['통계 카드로 전체/완료/진행중/대기/긴급 항목 수 확인', '최근 업데이트된 담당 항목 목록', '이번 달 담당 행사 캘린더', '긴급 알림 표시']
        },
        {
          subtitle: '행사 목록',
          description: '담당하는 행사들의 체크리스트를 확인하고 관리할 수 있습니다.',
          details: ['담당 항목이 있는 행사만 표시', '월별 필터링 기능', '상태별 필터링 (진행중/예정/완료)', '담당 항목 수 표시', '체크리스트 및 타임라인 바로가기']
        },
        {
          subtitle: '내 담당 항목',
          description: '모든 행사에서 담당하는 체크리스트 항목들을 한 곳에서 관리할 수 있습니다.',
          details: ['행사별로 그룹화된 담당 항목', '상태별 필터링 (완료/진행중/미진행)', '유형별 필터링 (사전 준비/당일 준비)', '검색 기능', '긴급 항목 알림']
        }
      ]
    },
    userGuide: {
      title: '사용자 가이드',
      icon: <MdHelp className="w-6 h-6 text-orange-500" />,
      content: [
        {
          subtitle: '체크리스트 사용법',
          description: '행사별 체크리스트에서 담당 항목을 관리하는 방법입니다.',
          details: ['담당 항목만 필터링되어 표시', '항목 상태 변경 (미진행 → 진행중 → 완료)', '완료 시 체크 날짜 자동 기록', '사전 준비와 당일 준비 탭 구분']
        },
        {
          subtitle: '타임라인 사용법',
          description: '당일 행사 일정을 시간순으로 확인하고 체크하는 방법입니다.',
          details: ['담당 항목만 시간순으로 표시', '현재 시간 기준 진행 상황 확인', '지연된 항목 경고 표시', '30분 이내 예정 항목 알림', '완료 항목 회색 처리']
        },
        {
          subtitle: '효율적인 업무 관리',
          description: '담당 항목을 효율적으로 관리하는 팁입니다.',
          details: ['대시보드에서 긴급 항목 우선 확인', '행사별로 담당 항목 정리', '정기적으로 진행 상황 업데이트', '마감일 임박 항목 우선 처리']
        }
      ]
    },
    tips: {
      tips: [
        { icon: <MdCheckCircle className="w-5 h-5 text-green-500" />, tip: '담당 항목을 완료하면 자동으로 진행률이 업데이트됩니다.' },
        { icon: <MdWarning className="w-5 h-5 text-yellow-500" />, tip: '마감일이 임박한 미완료 항목은 긴급 알림으로 표시됩니다.' },
        { icon: <MdAssignment className="w-5 h-5 text-blue-500" />, tip: '대시보드에서 내 담당 항목 현황을 한눈에 확인할 수 있습니다.' },
        { icon: <MdInfo className="w-5 h-5 text-gray-500" />, tip: '행사별 체크리스트에서 담당 항목만 필터링되어 표시됩니다.' }
      ]
    }
  };

  const activeContent = guideData[activeGuide];

  if (!activeContent) return <div>가이드를 선택해주세요.</div>;

  if (activeGuide === 'tips') {
    return <QuickTipsSection tips={activeContent.tips} />;
  }

  return <GuideSection {...activeContent} />;
};

export default UserGuide; 