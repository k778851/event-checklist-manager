import React, { useState } from 'react';
import EventList from './EventList';
import ChecklistView from '../components/checklist/ChecklistView';

const ChecklistPage = () => {
  const [selectedEvent, setSelectedEvent] = useState(null);

  // 행사 리스트에서 행사 선택 시 호출
  const handleSelectEvent = (event) => {
    setSelectedEvent(event);
  };

  // 사전 체크리스트만 보여줌
  return (
    <div className="p-8">
      {!selectedEvent ? (
        <EventList onSelectEvent={handleSelectEvent} checklistType="pre" />
      ) : (
        <div>
          <button onClick={() => setSelectedEvent(null)} className="text-primary-600 hover:text-primary-700 font-medium mb-4">← 행사 목록으로 돌아가기</button>
          <h1 className="text-2xl font-bold text-gray-800 mb-6">{selectedEvent.title}</h1>
          <ChecklistView event={selectedEvent} checklistType="pre" />
        </div>
      )}
    </div>
  );
};

export default ChecklistPage; 