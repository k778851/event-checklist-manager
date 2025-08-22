import React, { createContext, useContext, useState } from 'react';
import sampleEvents from '../sampleEvents';

const EventContext = createContext();

export const useEvents = () => {
  const context = useContext(EventContext);
  if (!context) {
    throw new Error('useEvents must be used within an EventProvider');
  }
  return context;
};

export const EventProvider = ({ children }) => {
  // 샘플 데이터를 초기 데이터로 사용
  const [events, setEvents] = useState(sampleEvents);

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