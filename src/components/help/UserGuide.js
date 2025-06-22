import React from 'react';
import { 
  MdDashboard, 
  MdEvent, 
  MdChecklist, 
  MdTimeline,
  MdUpload,
  MdPeople,
  MdSettings,
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
          subtitle: '로그인 및 권한',
          description: '시스템에 로그인하면 사용자 권한에 따라 접근 가능한 기능이 결정됩니다.',
          details: ['총괄부서 관리자: 모든 기능 접근 가능', '부서 관리자: 본인 부서 관련 기능만 접근 가능', '일반 사용자: 제한된 기능만 접근 가능']
        },
        {
          subtitle: '대시보드 확인',
          description: '로그인 후 대시보드에서 현재 진행 중인 행사와 전체 현황을 확인할 수 있습니다.',
          details: ['현재 진행 중인 행사 목록', '전체 행사 진행률', '최근 업데이트된 체크리스트']
        }
      ]
    },
    mainFeatures: {
      title: '주요 기능',
      icon: <MdDashboard className="w-6 h-6 text-green-500" />,
      content: [
        {
          subtitle: '행사 관리',
          description: '새로운 행사를 생성하고 관리할 수 있습니다.',
          details: ['행사명, 일정, 성격(보건/내부/대외) 설정', '참여 부서 지정', '행사별 색상 태그 적용', '중복 행사 동시 진행 가능']
        },
        {
          subtitle: '체크리스트 관리',
          description: '행사별 체크리스트를 생성하고 관리할 수 있습니다.',
          details: ['대분류(카테고리) → 세부 항목 계층 구조', '사전 항목과 당일 항목 구분', '항목별 상태 관리 (미진행/진행 중/완료)', '담당자, 비고, 체크일 설정']
        },
        {
          subtitle: '타임라인 관리',
          description: '당일 행사 일정을 시간순으로 관리할 수 있습니다.',
          details: ['시간대별 체크리스트 표시', '완료된 항목 회색 처리', '미체크 항목 알림 및 경고', '부서별 필터링 기능']
        }
      ]
    },
    excel: {
      title: 'Excel 기능',
      icon: <MdUpload className="w-6 h-6 text-purple-500" />,
      content: [
        {
          subtitle: 'Excel 업로드',
          description: '사전 준비된 Excel 파일을 업로드하여 체크리스트를 일괄 생성할 수 있습니다.',
          details: ['템플릿 형식의 Excel 파일 사용', '사전 항목에 한해 업로드 가능', '업로드 시 유효성 검사 수행', '오류 발생 시 상세 오류 메시지 표시']
        },
        {
          subtitle: 'Excel 다운로드',
          description: '작성된 체크리스트를 Excel 파일로 다운로드할 수 있습니다.',
          details: ['현재 상태 포함 여부 선택 가능', '부서별 필터링 기능', '행사별 개별 다운로드', '전체 데이터 일괄 다운로드']
        }
      ]
    },
    permissions: {
      title: '권한별 기능',
      icon: <MdPeople className="w-6 h-6 text-orange-500" />,
      content: [
        {
          subtitle: '총괄부서 관리자',
          description: '시스템의 모든 기능을 사용할 수 있습니다.',
          details: ['전체 행사 및 부서 관리', '행사 생성 및 부서 지정', '전체 진행률 확인', '시스템 설정 관리', 'Excel 업로드/다운로드']
        },
        {
          subtitle: '부서 관리자',
          description: '본인 부서가 참여하는 행사만 관리할 수 있습니다.',
          details: ['참여 행사 체크리스트 관리', '당일 타임라인 확인 및 체크', '부서별 진행률 확인', '제한된 Excel 기능 사용']
        }
      ]
    },
    tips: {
      tips: [
        { icon: <MdCheckCircle className="w-5 h-5 text-green-500" />, tip: '체크리스트 항목을 완료하면 자동으로 진행률이 업데이트됩니다.' },
        { icon: <MdWarning className="w-5 h-5 text-yellow-500" />, tip: '시간이 지난 미완료 항목은 자동으로 경고 표시됩니다.' },
        { icon: <MdInfo className="w-5 h-5 text-blue-500" />, tip: 'Excel 업로드 시 반드시 제공된 템플릿 형식을 사용하세요.' },
        { icon: <MdSettings className="w-5 h-5 text-gray-500" />, tip: '시스템 설정에서 알림 기능을 활성화하면 실시간 업데이트를 받을 수 있습니다.' }
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