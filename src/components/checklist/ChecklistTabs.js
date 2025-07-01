import React, { useState, useMemo } from 'react';
import { useParams, useSearchParams } from 'react-router-dom';
import ChecklistView from './ChecklistView';
import TimelineView from '../timeline/TimelineView';

const ChecklistTabs = (props) => {
  const { id } = useParams();
  const [searchParams] = useSearchParams();
  const tabFromQuery = searchParams.get('tab');
  // 샘플 행사 데이터 (Dashboard.js와 동일하게)
  const events = [
    { id: 1, title: "2024 신년 행사" },
    { id: 2, title: "봄 시즌 프로모션" },
    { id: 3, title: "청년부 수련회" },
    { id: 4, title: "찬양팀 워크샵" },
    { id: 5, title: "2023 성탄절 행사" },
    { id: 6, title: "가을 수확감사절" }
  ];
  // event prop이 있으면 그걸 사용, 없으면 id로 샘플 데이터에서 찾음
  const event = props.event || events.find(e => String(e.id) === String(id));
  const onBack = props.onBack;

  const [activeTab, setActiveTab] = useState(tabFromQuery || props.activeTab || 'pre'); // 'pre', 'day', 'timeline'

  // 당일 준비 체크리스트 항목을 state로 관리 (event의 카테고리에서 추출)
  const initialDayChecklist = event && event.categories
    ? event.categories.find(cat => cat.name === '당일 준비')?.items || []
    : [];
  const [dayChecklist, setDayChecklist] = useState(initialDayChecklist);

  // dayChecklist를 타임라인 데이터로 변환
  const timelineData = useMemo(() =>
    dayChecklist.map((item, idx) => ({
      id: item.id || idx,
      time: item.time || '',
      department: item.assignee || '',
      title: item.title,
      content: item.note || '',
      status: item.status,
      assignee: item.assignee || '',
      checked: item.status === '완료',
      checkedAt: null // 필요시 확장
    })),
    [dayChecklist]
  );

  return (
    <div>
      {/* 타이틀(상단 헤더) */}
      <div className="mb-6 flex items-center gap-4">
        <button
          onClick={onBack}
          className="px-4 py-2 bg-gray-100 rounded hover:bg-gray-200 text-gray-700 text-sm font-medium"
        >
          ← 행사 목록으로 돌아가기
        </button>
        <h1 className="text-2xl font-bold text-gray-800">
          {event ? event.title : '행사 정보 없음'} - 체크리스트
        </h1>
      </div>

      {/* 탭 메뉴 */}
      <div className="flex gap-2 mb-6 border-b">
        <button
          className={`px-4 py-2 font-semibold border-b-2 transition-colors ${activeTab === 'pre' ? 'border-blue-600 text-blue-600 bg-blue-50' : 'border-transparent text-gray-500 hover:text-blue-600'}`}
          onClick={() => setActiveTab('pre')}
        >
          사전 체크리스트
        </button>
        <button
          className={`px-4 py-2 font-semibold border-b-2 transition-colors ${activeTab === 'day' ? 'border-blue-600 text-blue-600 bg-blue-50' : 'border-transparent text-gray-500 hover:text-blue-600'}`}
          onClick={() => setActiveTab('day')}
        >
          당일 체크리스트
        </button>
        <button
          className={`px-4 py-2 font-semibold border-b-2 transition-colors ${activeTab === 'timeline' ? 'border-blue-600 text-blue-600 bg-blue-50' : 'border-transparent text-gray-500 hover:text-blue-600'}`}
          onClick={() => setActiveTab('timeline')}
        >
          타임라인
        </button>
      </div>

      {/* 탭 내용에 여백 추가 */}
      <div className="mb-8">
        {activeTab === 'pre' && (
          <ChecklistView
            event={event}
            hideHeader={true}
            categoryFilter="사전 준비"
          />
        )}
        {activeTab === 'day' && (
          <ChecklistView
            event={event}
            hideHeader={true}
            categoryFilter="당일 준비"
            dayChecklist={dayChecklist}
            setDayChecklist={setDayChecklist}
          />
        )}
        {activeTab === 'timeline' && (
          <TimelineView
            event={event}
            dayChecklist={dayChecklist}
            setDayChecklist={setDayChecklist}
            timelineData={timelineData}
            hideHeader={true}
          />
        )}
      </div>
    </div>
  );
};

export default ChecklistTabs; 