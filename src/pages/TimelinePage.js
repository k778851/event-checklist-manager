import React, { useState, useEffect } from 'react';
import EventList from './EventList';
import ChecklistView from '../components/checklist/ChecklistView';
import TimelineView from '../components/timeline/TimelineView';

const TimelinePage = () => {
  const [selectedEvent, setSelectedEvent] = useState(null);
  const [activeTab, setActiveTab] = useState('daycheck'); // 'daycheck' or 'timeline'
  const [dayChecklist, setDayChecklist] = useState(null);
  const [isChecklistLoaded, setIsChecklistLoaded] = useState(false);

  // 행사 리스트에서 행사 선택 시 호출
  const handleSelectEvent = (event) => {
    setSelectedEvent(event);
    setDayChecklist(null);
    setIsChecklistLoaded(false);
  };

  // 체크리스트에서 타임라인 업데이트를 위한 콜백
  const handleTimelineUpdate = (categoryId, itemId, newStatus) => {
    console.log('Timeline update:', { categoryId, itemId, newStatus });
    
    // 체크리스트 상태가 변경되면 타임라인도 업데이트
    if (dayChecklist) {
      const updatedChecklist = dayChecklist.map(category =>
        category.id === categoryId
          ? {
              ...category,
              items: category.items.map(item =>
                item.id === itemId
                  ? { ...item, status: newStatus }
                  : item
              )
            }
          : category
      );
      
      setDayChecklist(updatedChecklist);
      console.log('Updated checklist:', updatedChecklist);
    }
  };

  // 체크리스트 데이터가 변경될 때 호출
  const handleChecklistChange = (newChecklist) => {
    console.log('Checklist changed:', newChecklist);
    setDayChecklist(newChecklist);
    setIsChecklistLoaded(true);
  };

  // 디버깅을 위한 로그
  useEffect(() => {
    console.log('TimelinePage state:', {
      selectedEvent,
      dayChecklist,
      isChecklistLoaded,
      activeTab
    });
  }, [selectedEvent, dayChecklist, isChecklistLoaded, activeTab]);

  if (!selectedEvent) {
    return (
      <div className="p-8">
        <EventList onSelectEvent={handleSelectEvent} checklistType="day" />
      </div>
    );
  }

  return (
    <div className="p-8">
      <button onClick={() => window.history.back()} className="text-primary-600 hover:text-primary-700 font-medium mb-4">← 이전 화면으로 돌아가기</button>
      <h1 className="text-2xl font-bold text-gray-800 mb-6">{selectedEvent.title}</h1>
      
      {/* 동기화 상태 표시 */}
      {dayChecklist && (
        <div className="mb-4 p-3 bg-blue-50 border border-blue-200 rounded-lg">
          <div className="flex items-center gap-2 text-blue-800 text-sm">
            <span>✓ 체크리스트 데이터 로드됨</span>
            <span>•</span>
            <span>타임라인과 동기화 준비 완료</span>
          </div>
        </div>
      )}
      
      <div className="mb-6 flex gap-2 border-b">
        <button
          className={`px-4 py-2 font-semibold border-b-2 ${activeTab === 'daycheck' ? 'border-primary-600 text-primary-600' : 'border-transparent text-gray-500'}`}
          onClick={() => setActiveTab('daycheck')}
        >
          당일 체크리스트
        </button>
        <button
          className={`px-4 py-2 font-semibold border-b-2 ${activeTab === 'timeline' ? 'border-primary-600 text-primary-600' : 'border-transparent text-gray-500'}`}
          onClick={() => setActiveTab('timeline')}
        >
          타임라인
        </button>
      </div>
      
      {activeTab === 'daycheck' && (
        <ChecklistView 
          event={selectedEvent} 
          checklistType="day" 
          onTimelineUpdate={handleTimelineUpdate}
          onChecklistChange={handleChecklistChange}
        />
      )}
      
      {activeTab === 'timeline' && (
        <TimelineView 
          event={selectedEvent} 
          dayChecklist={dayChecklist}
          onTimelineUpdate={handleTimelineUpdate}
        />
      )}
    </div>
  );
};

export default TimelinePage; 