import React, { createContext, useContext, useState } from 'react';

const EventContext = createContext();

export const useEvents = () => {
  const context = useContext(EventContext);
  if (!context) {
    throw new Error('useEvents must be used within an EventProvider');
  }
  return context;
};

export const EventProvider = ({ children }) => {
  // 실제 상태로 관리되는 행사 데이터
  const [events, setEvents] = useState([
    {
      id: 1,
      title: "2025 여름 행사",
      category: "총회",
      status: "진행중",
      date: "2025.07.01 - 2025.07.01",
      internalDate: "2025-07-01",
      departments: ["기획부", "홍보부", "전도부"],
      progress: 75,
      totalTasks: 48,
      completedTasks: 36
    },
    {
      id: 2,
      title: "2025 여름 프로모션",
      category: "지역",
      status: "예정",
      date: "2025.07.01 - 2025.07.01",
      internalDate: "2025-07-01",
      departments: ["홍보부", "문화부"],
      progress: 30,
      totalTasks: 24,
      completedTasks: 8
    },
    {
      id: 3,
      title: "2025 청년부 수련회",
      category: "지파",
      status: "완료",
      date: "2025.07.01 - 2025.07.01",
      internalDate: "2025-07-01",
      departments: ["기획부", "청년회"],
      progress: 100,
      totalTasks: 36,
      completedTasks: 36
    }
  ]);

  const addEvent = (eventData) => {
    const newEvent = {
      id: Date.now(),
      ...eventData,
      status: "진행중",
      progress: 0,
      totalTasks: 0,
      completedTasks: 0,
      // 대시보드용 날짜 형식 추가
      date: eventData.internalDate ? `${eventData.internalDate.replace(/-/g, '.')} - ${eventData.internalDate.replace(/-/g, '.')}` : "",
      internalDate: eventData.internalDate || eventData.date
    };
    
    setEvents(prevEvents => [...prevEvents, newEvent]);
    return newEvent;
  };

  const updateEvent = (eventId, eventData) => {
    setEvents(prevEvents => 
      prevEvents.map(event => 
        event.id === eventId 
          ? { 
              ...event, 
              ...eventData,
              // 대시보드용 날짜 형식 업데이트
              date: eventData.internalDate ? `${eventData.internalDate.replace(/-/g, '.')} - ${eventData.internalDate.replace(/-/g, '.')}` : event.date,
              internalDate: eventData.internalDate || eventData.date || event.internalDate
            }
          : event
      )
    );
  };

  const deleteEvent = (eventId) => {
    setEvents(prevEvents => prevEvents.filter(event => event.id !== eventId));
  };

  const getEventsByStatus = (status) => {
    return events.filter(event => event.status === status);
  };

  const getEventsByMonth = (yearMonth) => {
    return events.filter(event => {
      if (!event.internalDate) return false;
      
      const eventMonth = event.internalDate.substring(0, 7); // YYYY-MM 형식
      return eventMonth === yearMonth;
    });
  };

  const getEventsByYear = (year) => {
    return events.filter(event => {
      if (!event.internalDate) return false;
      return event.internalDate.startsWith(year + '-');
    });
  };

  const value = {
    events,
    addEvent,
    updateEvent,
    deleteEvent,
    getEventsByStatus,
    getEventsByMonth,
    getEventsByYear
  };

  return (
    <EventContext.Provider value={value}>
      {children}
    </EventContext.Provider>
  );
}; 