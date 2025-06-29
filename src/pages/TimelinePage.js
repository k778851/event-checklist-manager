import React, { useState } from 'react';
import EventList from './EventList';
import ChecklistView from '../components/checklist/ChecklistView';
import TimelineView from '../components/timeline/TimelineView';

const TimelinePage = () => {
  const [selectedEvent, setSelectedEvent] = useState(null);
  const [activeTab, setActiveTab] = useState('daycheck'); // 'daycheck' or 'timeline'

  // 행사 리스트에서 행사 선택 시 호출
  const handleSelectEvent = (event) => {
    setSelectedEvent(event);
  };

  if (!selectedEvent) {
    return (
      <div className="p-8">
        <EventList onSelectEvent={handleSelectEvent} checklistType="day" />
      </div>
    );
  }

  return (
    <div className="p-8">
      <button onClick={() => setSelectedEvent(null)} className="text-primary-600 hover:text-primary-700 font-medium mb-4">← 행사 목록으로 돌아가기</button>
      <h1 className="text-2xl font-bold text-gray-800 mb-6">{selectedEvent.title}</h1>
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
      {activeTab === 'daycheck' && <ChecklistView event={selectedEvent} checklistType="day" />}
      {activeTab === 'timeline' && <TimelineView event={selectedEvent} />}
    </div>
  );
};

export default TimelinePage; 